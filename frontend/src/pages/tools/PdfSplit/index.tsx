import { useState } from 'react'
import ToolShell from '@/components/ToolShell'
import UploadBox from '@/components/UploadBox'
import DownloadButton from '@/components/DownloadButton'

function kb(b: number) { return b < 1048576 ? (b / 1024).toFixed(0) + ' KB' : (b / 1048576).toFixed(2) + ' MB' }

export default function PdfSplit() {
  const [file, setFile] = useState<File | null>(null)
  const [pageCount, setPageCount] = useState(0)
  const [ranges, setRanges] = useState('1-')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [outputs, setOutputs] = useState<{ name: string; blob: Blob }[]>([])

  const handleFile = async (f: File) => {
    setError(''); setOutputs([])
    if (f.type !== 'application/pdf') { setError('Please choose a PDF file.'); return }
    try {
      const { PDFDocument } = await import('pdf-lib')
      const bytes = new Uint8Array(await f.arrayBuffer())
      const doc = await PDFDocument.load(bytes, { ignoreEncryption: true })
      setPageCount(doc.getPageCount())
      setRanges('1-' + doc.getPageCount())
      setFile(f)
    } catch { setError('Could not open this PDF. It may be encrypted or damaged.') }
  }

  const parseRanges = (): number[][] => {
    return ranges.split(',').map((chunk) => chunk.trim()).filter(Boolean).map((chunk) => {
      if (chunk.includes('-')) {
        const [a, b] = chunk.split('-').map((s) => s.trim())
        const start = a ? Math.max(1, parseInt(a, 10)) : 1
        const end = b ? Math.min(pageCount, parseInt(b, 10)) : pageCount
        const list: number[] = []
        for (let i = start; i <= end; i++) list.push(i - 1)
        return list
      }
      return [Math.max(0, Math.min(pageCount - 1, parseInt(chunk, 10) - 1))]
    })
  }

  const split = async (): Promise<Blob | null> => {
    if (!file) return null
    const groups = parseRanges()
    if (groups.length === 0) { setError('Enter at least one page range.'); return null }
    setBusy(true)
    try {
      const { PDFDocument } = await import('pdf-lib')
      const bytes = new Uint8Array(await file.arrayBuffer())
      const src = await PDFDocument.load(bytes, { ignoreEncryption: true })
      const results: { name: string; blob: Blob }[] = []
      for (let gi = 0; gi < groups.length; gi++) {
        const indices = groups[gi]
        if (indices.length === 0) continue
        const out = await PDFDocument.create()
        const pages = await out.copyPages(src, indices)
        pages.forEach((p) => out.addPage(p))
        const saved = await out.save()
        const blob = new Blob([saved], { type: 'application/pdf' })
        results.push({ name: 'part-' + (gi + 1) + '.pdf', blob })
      }
      setOutputs(results)
      // Auto-trigger download of the first part; also expose all parts below
      return results[0]?.blob || null
    } catch { setError('Could not split this PDF.'); return null }
    finally { setBusy(false) }
  }

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this tool do?', a: 'It splits a PDF into several smaller PDFs. You type page ranges like 1-3, 4-6, 7- and the tool produces one PDF for each range.' },
      { q: 'Is it free?', a: 'Yes. No account, no upload, no daily limit.' },
      { q: 'Does the page order matter?', a: 'Yes. The order you enter in the ranges field is the order of the resulting files. Within a range, pages stay in their original order.' },
    ]},
    { heading: 'Ranges', items: [
      { q: 'How do I write page ranges?', a: 'Use numbers with a hyphen for a range and commas to separate groups. For example 1-3, 4-6, 7- splits a seven-page file into three PDFs.' },
      { q: 'Can I split every page into its own file?', a: 'Yes. Use commas with single numbers, like 1, 2, 3, 4, 5. Each number becomes its own PDF.' },
      { q: 'What happens if a range is out of bounds?', a: 'The tool clamps the numbers to the actual page count, so a range like 5-99 on a ten-page file ends at page ten.' },
    ]},
    { heading: 'Privacy and troubleshooting', items: [
      { q: 'Is my PDF uploaded?', a: 'No. The split happens in your browser. The file is not sent to any server.' },
      { q: 'Why did the split fail?', a: 'The most common reasons are an encrypted or damaged source PDF. Try opening it in a PDF reader first to confirm it loads.' },
      { q: 'How do I download all parts?', a: 'The first part downloads automatically. Other parts appear below the button with their own download button.' },
      { q: 'What is the maximum file size?', a: 'Files up to 100 MB work. Very large PDFs may take longer to load on older phones.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to split a PDF</h2>
      <ol>
        <li>Upload a PDF.</li>
        <li>Type the page ranges. For example 1-3, 4-6, 7-.</li>
        <li>Press Split PDF. The first part downloads and every part is listed for download.</li>
      </ol>
      <h2>Why use this tool</h2>
      <p>Splitting lets you share a specific chapter, extract a single signed page, or reduce a large PDF into parts small enough for an upload limit. The split runs in your browser, so nothing is uploaded.</p>
      <h2>Privacy and data</h2>
      <p>Files are read and split locally. Nothing leaves your device.</p>
    </>
  )

  return (
    <ToolShell
      title="Split PDF Files Online Free | PPM Creator"
      description="Split a PDF into multiple PDFs by page range online for free. Files stay in your browser."
      path="/pdf-split"
      crumb={[{ label: 'PDF Tools', to: '/pdf-tools' }]}
      h1="Split PDF: Extract Pages into Separate Files"
      lead="Upload a PDF, enter page ranges, and download the split parts. Everything runs in your browser."
      faqGroups={faqGroups}
      related={[
        { name: 'Merge PDF', href: '/pdf-merge', blurb: 'Combine multiple PDFs into one' },
        { name: 'Compress PDF', href: '/pdf-compress', blurb: 'Make a PDF smaller' },
        { name: 'Unlock PDF', href: '/pdf-unlock', blurb: 'Remove a known password' },
        { name: 'Image to PDF', href: '/image-to-pdf', blurb: 'Turn photos into one PDF' },
      ]}
      guides={[
        { title: 'Extracting a chapter from a PDF' },
        { title: 'Splitting a large PDF for upload limits' },
        { title: 'Common PDF split errors and fixes' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        {!file && <UploadBox accept="application/pdf" maxMB={100} hint="PDF file - up to 100 MB - nothing is uploaded" onFile={handleFile} />}
        {file && (
          <div>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>{file.name} - {pageCount} pages - {kb(file.size)}</div>
            <label style={{ fontSize: 13, color: '#6b7280' }}>Page ranges (e.g. 1-3, 4-6, 7-)</label>
            <input value={ranges} onChange={(e) => setRanges(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 4, marginBottom: 12, fontSize: 14 }} />
            <DownloadButton getBlob={split} filename="ppm-creator-split.pdf" label={busy ? 'Splitting...' : 'Split PDF'} />
            <button type="button" onClick={() => { setFile(null); setOutputs([]); setError('') }} style={{ border: '1px solid #e7e5e4', background: 'transparent', color: '#1c1917', padding: '12px 20px', borderRadius: 10, fontWeight: 500, cursor: 'pointer', marginLeft: 8 }}>Reset</button>
            {outputs.length > 1 && (
              <div style={{ marginTop: 14 }}>
                <b style={{ fontSize: 13 }}>All parts:</b>
                {outputs.map((o, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', padding: 6, borderBottom: '1px dashed #e7e5e4' }}>
                    <span style={{ flex: 1, fontSize: 13 }}>{o.name}</span>
                    <span style={{ fontSize: 12, color: '#6b7280' }}>{kb(o.blob.size)}</span>
                    <a href={URL.createObjectURL(o.blob)} download={o.name} style={{ fontSize: 12, color: '#F97316', textDecoration: 'none', fontWeight: 500 }}>Download</a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
        {error && <p role="alert" style={{ color: '#be123c', fontSize: 14, marginTop: 10 }}>{error}</p>}
      </section>
    </ToolShell>
  )
}