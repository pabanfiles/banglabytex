import { useState } from 'react'
import ToolShell from '@/components/ToolShell'
import UploadBox from '@/components/UploadBox'
import DownloadButton from '@/components/DownloadButton'

function kb(b: number) { return b < 1048576 ? (b / 1024).toFixed(0) + ' KB' : (b / 1048576).toFixed(2) + ' MB' }

export default function PdfMerge() {
  const [files, setFiles] = useState<File[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const addFile = (f: File) => {
    setError('')
    if (f.type !== 'application/pdf') { setError('Please choose PDF files only.'); return }
    if (f.size > 100 * 1048576) { setError('Each PDF must be under 100 MB.'); return }
    setFiles((prev) => [...prev, f])
  }

  const move = (i: number, dir: -1 | 1) => {
    setFiles((prev) => {
      const j = i + dir
      if (j < 0 || j >= prev.length) return prev
      const copy = [...prev]
      const t = copy[i]; copy[i] = copy[j]; copy[j] = t
      return copy
    })
  }
  const removeAt = (i: number) => setFiles((prev) => prev.filter((_, k) => k !== i))
  const reset = () => { setFiles([]); setError('') }

  const merge = async (): Promise<Blob | null> => {
    if (files.length < 2) { setError('Add at least two PDFs to merge.'); return null }
    setBusy(true)
    try {
      const { PDFDocument } = await import('pdf-lib')
      const out = await PDFDocument.create()
      for (const f of files) {
        const bytes = new Uint8Array(await f.arrayBuffer())
        const src = await PDFDocument.load(bytes, { ignoreEncryption: true })
        const pages = await out.copyPages(src, src.getPageIndices())
        pages.forEach((p) => out.addPage(p))
      }
      const saved = await out.save()
      return new Blob([saved], { type: 'application/pdf' })
    } catch (e) { setError('Could not merge these PDFs. One file may be encrypted or damaged.'); return null }
    finally { setBusy(false) }
  }

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this tool do?', a: 'It combines multiple PDF files into one PDF, keeping all pages in the order you choose. You can add, remove and reorder files before merging.' },
      { q: 'Is it free?', a: 'Yes. No account, no upload, no daily limit.' },
      { q: 'Which file types can I add?', a: 'Only PDF files. If you have images, use the Image to PDF tool first, then merge the result.' },
    ]},
    { heading: 'Merging', items: [
      { q: 'How do I set the page order?', a: 'The list order is the page order in the merged PDF. Use the up and down buttons to move files, or remove a file and add it again at the right spot.' },
      { q: 'How many PDFs can I merge?', a: 'There is no hard limit, but very large batches can hit browser memory. Ten to twenty typical PDFs is a comfortable range.' },
      { q: 'What happens to encrypted PDFs?', a: 'The tool tries to read them, but a strongly password-protected PDF may fail. Remove the password with the Unlock PDF tool first.' },
    ]},
    { heading: 'Privacy and troubleshooting', items: [
      { q: 'Are my PDFs uploaded?', a: 'No. The merge happens in your browser. The files are not sent to any server.' },
      { q: 'Why is the download slow for many files?', a: 'Each PDF is read and its pages are copied one after another. For many files the wait is normal. The processing label appears on the button.' },
      { q: 'Why did the merge fail?', a: 'The most common reasons are a damaged file, a strongly encrypted file, or too many pages at once. Remove the problem file and try again.' },
      { q: 'Will the output be a smaller or larger file?', a: 'Usually larger, because the merged file stores all pages from all inputs. If size matters, compress the merged PDF afterwards.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to merge PDFs</h2>
      <ol>
        <li>Add two or more PDF files.</li>
        <li>Reorder them if needed. The list order is the page order in the result.</li>
        <li>Press Download merged PDF.</li>
      </ol>
      <h2>Why use this tool</h2>
      <p>Combining several PDFs into one makes them easier to email, print, or upload to a portal that accepts only a single file. The merge happens in your browser, so nothing is uploaded.</p>
      <h2>Privacy and data</h2>
      <p>Files are read and combined locally. Nothing leaves your device.</p>
    </>
  )

  return (
    <ToolShell
      title="Merge PDF Files Online Free | PPM Creator"
      description="Merge two or more PDF files into one online for free. Reorder, remove, and download. Files stay in your browser."
      path="/pdf-merge"
      crumb={[{ label: 'PDF Tools', to: '/pdf-tools' }]}
      h1="Merge PDF: Combine Multiple PDFs Into One"
      lead="Add PDF files, set the order, and download a single merged PDF. Everything runs in your browser."
      faqGroups={faqGroups}
      related={[
        { name: 'Split PDF', href: '/pdf-split', blurb: 'Split one PDF into many' },
        { name: 'Compress PDF', href: '/pdf-compress', blurb: 'Make a PDF smaller' },
        { name: 'Unlock PDF', href: '/pdf-unlock', blurb: 'Remove a known password' },
        { name: 'Protect PDF', href: '/pdf-protect', blurb: 'Add a password to a PDF' },
        { name: 'Image to PDF', href: '/image-to-pdf', blurb: 'Turn photos into one PDF' },
        { name: 'PDF to Word', href: '/pdf-to-word', blurb: 'Convert PDF to Word' },
      ]}
      guides={[
        { title: 'Combining invoices into one PDF' },
        { title: 'Preparing a single PDF for upload' },
        { title: 'Common PDF merge errors and fixes' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        <UploadBox accept="application/pdf" maxMB={100} hint="PDF files - up to 100 MB each - nothing is uploaded" onFile={addFile} />
        {files.length > 0 && (
          <div style={{ marginTop: 14 }}>
            {files.map((f, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 8, border: '1px solid #e7e5e4', borderRadius: 10, background: '#fff', marginBottom: 6 }}>
                <b style={{ flex: 1, fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</b>
                <span style={{ fontSize: 12, color: '#6b7280' }}>{kb(f.size)}</span>
                <button type="button" onClick={() => move(i, -1)} disabled={i === 0} style={{ border: '1px solid #e7e5e4', background: '#fff', padding: '4px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Up</button>
                <button type="button" onClick={() => move(i, 1)} disabled={i === files.length - 1} style={{ border: '1px solid #e7e5e4', background: '#fff', padding: '4px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Down</button>
                <button type="button" onClick={() => removeAt(i)} style={{ border: 0, background: '#be123c', color: '#fff', padding: '4px 8px', borderRadius: 6, cursor: 'pointer', fontSize: 12 }}>Remove</button>
              </div>
            ))}
            <div style={{ marginTop: 12 }}>
              <DownloadButton getBlob={merge} filename="ppm-creator-merged.pdf" label={busy ? 'Merging...' : 'Download merged PDF'} />
              <button type="button" onClick={reset} style={{ border: '1px solid #e7e5e4', background: 'transparent', color: '#1c1917', padding: '12px 20px', borderRadius: 10, fontWeight: 500, cursor: 'pointer', marginLeft: 8 }}>Clear</button>
            </div>
          </div>
        )}
        {error && <p role="alert" style={{ color: '#be123c', fontSize: 14, marginTop: 10 }}>{error}</p>}
      </section>
    </ToolShell>
  )
}