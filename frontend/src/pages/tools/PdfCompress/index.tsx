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