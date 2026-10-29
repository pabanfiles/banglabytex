$ErrorActionPreference = "Stop"
$utf8 = New-Object System.Text.UTF8Encoding $false
$root = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend\src\pages\tools"
function WF($rel, $body) {
  $full = Join-Path $root $rel
  $dir = Split-Path $full -Parent
  if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  [System.IO.File]::WriteAllText($full, $body, $utf8)
  Write-Host "  [+] $rel" -ForegroundColor Green
}
function BK($rel) { $f = Join-Path $root $rel; if (Test-Path -LiteralPath $f) { Copy-Item -LiteralPath $f -Destination "$f.bak" -Force } }

Write-Host "=== Batch 4 ===" -ForegroundColor Cyan

# ============ PDF MERGE ============
BK "PdfMerge\index.tsx"
WF "PdfMerge\index.tsx" @"
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
"@
Write-Host "  [+] PdfMerge done" -ForegroundColor Green

# ============ PDF SPLIT ============
BK "PdfSplit\index.tsx"
WF "PdfSplit\index.tsx" @"
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
"@
Write-Host "  [+] PdfSplit done" -ForegroundColor Green

# ============ PDF COMPRESS ============
BK "PdfCompress\index.tsx"
WF "PdfCompress\index.tsx" @"
import { useState } from 'react'
import ToolShell from '@/components/ToolShell'
import UploadBox from '@/components/UploadBox'
import DownloadButton from '@/components/DownloadButton'

function kb(b: number) { return b < 1048576 ? (b / 1024).toFixed(0) + ' KB' : (b / 1048576).toFixed(2) + ' MB' }

export default function PdfCompress() {
  const [file, setFile] = useState<File | null>(null)
  const [level, setLevel] = useState(70)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [newSize, setNewSize] = useState<number | null>(null)
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)

  const handleFile = async (f: File) => {
    setError(''); setNewSize(null); setResultBlob(null)
    if (f.type !== 'application/pdf') { setError('Please choose a PDF file.'); return }
    if (f.size > 100 * 1048576) { setError('PDF must be under 100 MB.'); return }
    setFile(f)
  }

  const compress = async (): Promise<Blob | null> => {
    if (!file) return null
    setBusy(true)
    try {
      const { PDFDocument } = await import('pdf-lib')
      const bytes = new Uint8Array(await file.arrayBuffer())
      const src = await PDFDocument.load(bytes, { ignoreEncryption: true })
      // Use pdf-lib save options; compression is limited without re-encoding images
      const out = await PDFDocument.create()
      const pages = await out.copyPages(src, src.getPageIndices())
      pages.forEach((p) => out.addPage(p))
      const saved = await out.save({ useObjectStreams: true })
      const blob = new Blob([saved], { type: 'application/pdf' })
      setNewSize(blob.size)
      setResultBlob(blob)
      return blob
    } catch { setError('Could not compress this PDF. It may be encrypted or damaged.'); return null }
    finally { setBusy(false) }
  }

  const reset = () => { setFile(null); setNewSize(null); setResultBlob(null); setError('') }

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this tool do?', a: 'It re-saves a PDF with object streams enabled, which often reduces the file size for PDFs that carry a lot of small objects. Large images inside the PDF may not shrink much.' },
      { q: 'Is it free?', a: 'Yes. No account, no upload, no daily limit.' },
      { q: 'How much can it reduce my PDF?', a: 'The result depends on the PDF. Files with many small objects and annotations often shrink the most. Image-heavy PDFs may shrink less because the images are already compressed.' },
    ]},
    { heading: 'Results', items: [
      { q: 'Why is the compressed PDF sometimes larger?', a: 'Object streams add a small overhead. For very small PDFs the extra structure can outweigh the saving, so the output is slightly larger. The tool shows the new size before you download.' },
      { q: 'Does the tool reduce image quality?', a: 'No. This version does not re-encode images. It only reorganises the file structure, so the visual content stays the same.' },
      { q: 'Can I compress an encrypted PDF?', a: 'Only if the password is not required to open it. Strongly encrypted PDFs fail. Remove the password with Unlock PDF first.' },
    ]},
    { heading: 'Privacy and troubleshooting', items: [
      { q: 'Is my PDF uploaded?', a: 'No. The compression happens in your browser. The file is not sent to any server.' },
      { q: 'What is the maximum file size?', a: 'Files up to 100 MB work. Very large PDFs may take longer to load on older phones.' },
      { q: 'Why is the download button disabled?', a: 'It is disabled while the tool prepares the new PDF. The pause is usually under a second for typical files.' },
      { q: 'When should I use a different PDF tool?', a: 'If the images inside the PDF are the main problem, use an image compressor on the source images, or a dedicated PDF image optimiser. This tool focuses on structure, not image recompression.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to compress a PDF</h2>
      <ol>
        <li>Upload a PDF file.</li>
        <li>Press Compress PDF. The tool rebuilds the file with object streams.</li>
        <li>Download the smaller PDF. The new size appears before the download starts.</li>
      </ol>
      <h2>Why use this tool</h2>
      <p>Many PDFs carry a lot of small internal objects that can be packed more tightly. Rebuilding with object streams often reduces the size without touching the visible content. The tool runs in your browser, so nothing is uploaded.</p>
      <h2>Privacy and data</h2>
      <p>Files are read and compressed locally. Nothing leaves your device.</p>
    </>
  )

  return (
    <ToolShell
      title="Compress PDF Online Free | PPM Creator"
      description="Reduce PDF file size online for free by rebuilding with object streams. Files stay in your browser."
      path="/pdf-compress"
      crumb={[{ label: 'PDF Tools', to: '/pdf-tools' }]}
      h1="Compress PDF: Make a PDF Smaller"
      lead="Upload a PDF, rebuild it with object streams, and download a smaller file. Everything runs in your browser."
      faqGroups={faqGroups}
      related={[
        { name: 'Merge PDF', href: '/pdf-merge', blurb: 'Combine multiple PDFs into one' },
        { name: 'Split PDF', href: '/pdf-split', blurb: 'Split one PDF into many' },
        { name: 'Unlock PDF', href: '/pdf-unlock', blurb: 'Remove a known password' },
        { name: 'Image Compressor', href: '/image-compress', blurb: 'Reduce image file size' },
      ]}
      guides={[
        { title: 'Why some PDFs are large' },
        { title: 'Reducing a scanned PDF' },
        { title: 'When to re-encode images in a PDF' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        {!file && <UploadBox accept="application/pdf" maxMB={100} hint="PDF file - up to 100 MB - nothing is uploaded" onFile={handleFile} />}
        {file && (
          <div>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>{file.name} - {kb(file.size)}</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
              <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 12 }}>
                <small style={{ display: 'block', color: '#6b7280', fontSize: 12 }}>Original size</small>
                <b style={{ fontSize: 20, fontWeight: 600 }}>{kb(file.size)}</b>
              </div>
              <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 12 }}>
                <small style={{ display: 'block', color: '#6b7280', fontSize: 12 }}>New size</small>
                <b style={{ fontSize: 20, fontWeight: 600 }}>{newSize != null ? kb(newSize) : (busy ? '...' : '-')}</b>
              </div>
            </div>
            <DownloadButton getBlob={compress} filename={file.name.replace(/\.[^.]+$/, '') + '-compressed.pdf'} label={busy ? 'Compressing...' : 'Compress PDF'} />
            <button type="button" onClick={reset} style={{ border: '1px solid #e7e5e4', background: 'transparent', color: '#1c1917', padding: '12px 20px', borderRadius: 10, fontWeight: 500, cursor: 'pointer', marginLeft: 8 }}>Choose another</button>
          </div>
        )}
        {error && <p role="alert" style={{ color: '#be123c', fontSize: 14, marginTop: 10 }}>{error}</p>}
      </section>
    </ToolShell>
  )
}
"@
Write-Host "  [+] PdfCompress done" -ForegroundColor Green

Write-Host "=== Batch 4 done. Build next. ===" -ForegroundColor Green