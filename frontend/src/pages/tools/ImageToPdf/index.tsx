import { useState } from 'react'
import ToolShell from '@/components/ToolShell'
import UploadBox from '@/components/UploadBox'
import DownloadButton from '@/components/DownloadButton'

function kb(b: number) { return b < 1048576 ? (b / 1024).toFixed(0) + ' KB' : (b / 1048576).toFixed(2) + ' MB' }

export default function ImageToPdf() {
  const [files, setFiles] = useState<File[]>([])
  const [previewUrls, setPreviewUrls] = useState<string[]>([])
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  const addFiles = (f: File) => {
    setError('')
    if (!f.type.startsWith('image/')) { setError('Please choose image files.'); return }
    if (f.size > 25 * 1048576) { setError('Each file must be under 25 MB.'); return }
    setFiles((prev) => [...prev, f])
    setPreviewUrls((prev) => [...prev, URL.createObjectURL(f)])
  }

  const removeAt = (i: number) => {
    setFiles((prev) => prev.filter((_, idx) => idx !== i))
    setPreviewUrls((prev) => prev.filter((_, idx) => idx !== i))
  }

  const reset = () => { setFiles([]); setPreviewUrls([]); setError('') }

  const buildPdf = async (): Promise<Blob | null> => {
    if (files.length === 0) return null
    setBusy(true)
    try {
      const pdfLib = await import('pdf-lib')
      const { PDFDocument } = pdfLib
      const pdf = await PDFDocument.create()
      for (const f of files) {
        const dataUrl = await new Promise<string>((res, rej) => {
          const r = new FileReader()
          r.onload = () => res(String(r.result || ''))
          r.onerror = () => rej(new Error('read failed'))
          r.readAsDataURL(f)
        })
        const base64 = dataUrl.split(',')[1]
        const bin = atob(base64)
        const bytes = new Uint8Array(bin.length)
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i)
        let img
        if (f.type === 'image/png') img = await pdf.embedPng(bytes)
        else if (f.type === 'image/jpeg' || f.type === 'image/jpg') img = await pdf.embedJpg(bytes)
        else {
          // convert to jpeg via canvas first
          const url = URL.createObjectURL(f)
          const im = await new Promise<HTMLImageElement>((res, rej) => { const x = new Image(); x.onload = () => res(x); x.onerror = rej; x.src = url })
          const cv = document.createElement('canvas'); cv.width = im.width; cv.height = im.height
          cv.getContext('2d')?.drawImage(im, 0, 0)
          URL.revokeObjectURL(url)
          const jpeg = await new Promise<Blob>((res) => cv.toBlob((b) => res(b!), 'image/jpeg', 0.92))
          const buf = new Uint8Array(await jpeg.arrayBuffer())
          img = await pdf.embedJpg(buf)
        }
        const page = pdf.addPage([img.width, img.height])
        page.drawImage(img, { x: 0, y: 0, width: img.width, height: img.height })
      }
      const out = await pdf.save()
      const blob = new Blob([out], { type: 'application/pdf' })
      return blob
    } catch (e) {
      setError('Could not build the PDF. Try fewer or smaller images.')
      return null
    } finally { setBusy(false) }
  }

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this tool do?', a: 'It combines one or more images into a single PDF file. Each image becomes its own page at the image resolution.' },
      { q: 'Is it free?', a: 'Yes. No account, no upload, no daily limit.' },
      { q: 'Which image formats work?', a: 'JPG and PNG are handled directly. Other formats are converted to JPEG first, so the result is still a valid PDF.' },
    ]},
    { heading: 'Output', items: [
      { q: 'What page size is used?', a: 'Each page takes the size of the image in pixels at 72 DPI. A large photo makes a large page. If you need a specific paper size, resize the images first.' },
      { q: 'How many images can I add?', a: 'There is no hard limit, but very large batches take longer and may hit browser memory limits. Twenty to thirty images is a good working range.' },
      { q: 'Can I reorder the pages?', a: 'Remove an image with the small button. The order in the list is the order in the PDF, so add them in the sequence you want.' },
    ]},
    { heading: 'Privacy and troubleshooting', items: [
      { q: 'Are my images uploaded?', a: 'No. The PDF is built in your browser. Nothing leaves your device.' },
      { q: 'Why is the download slow for many images?', a: 'Each image is embedded one after another. For twenty images the wait is normal. The processing label appears on the download button.' },
      { q: 'What happens to the images after the PDF is ready?', a: 'They stay in memory until you close or reload the tab. Nothing is stored on the server.' },
      { q: 'Why did the PDF fail to build?', a: 'Very large images can use more memory than the browser allows. Try fewer images per PDF, or resize large photos first.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to make a PDF from images</h2>
      <ol>
        <li>Add one or more images.</li>
        <li>Remove any you do not want. The order in the list is the order in the PDF.</li>
        <li>Press Download PDF.</li>
      </ol>
      <h2>Why use this tool</h2>
      <p>Scanned pages, receipts and photos are often easier to share as a single PDF. The tool does the merge in your browser, so nothing is uploaded and the file stays private.</p>
      <h2>Privacy and data</h2>
      <p>The PDF is built locally. Nothing leaves your device.</p>
    </>
  )

  return (
    <ToolShell
      title="Image to PDF Converter Online Free | PPM Creator"
      description="Combine images into a single PDF online for free. Files stay in your browser."
      path="/image-to-pdf"
      crumb={[{ label: 'Image Tools', to: '/image-tools' }]}
      h1="Image to PDF: Combine Images Into One PDF"
      lead="Add one or more images and download a single PDF. Files stay in your browser."
      faqGroups={faqGroups}
      related={[
        { name: 'Image Compressor', href: '/image-compress', blurb: 'Reduce file size at a chosen quality' },
        { name: 'Image Resizer', href: '/image-resize', blurb: 'Change width and height in pixels' },
        { name: 'Merge PDF', href: '/pdf-merge', blurb: 'Combine multiple PDFs into one' },
        { name: 'Compress PDF', href: '/pdf-compress', blurb: 'Make a PDF smaller' },
      ]}
      guides={[
        { title: 'Sharing scanned pages as one PDF' },
        { title: 'Choosing image sizes for a PDF' },
        { title: 'Reducing a photo PDF after creation' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        <UploadBox accept="image/*" maxMB={25} hint="Add an image (you can add more than one)" onFile={addFiles} />
        {files.length > 0 && (
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {files.map((f, i) => (
                <div key={i} style={{ position: 'relative', border: '1px solid #e7e5e4', borderRadius: 10, padding: 6, background: '#fff', width: 110 }}>
                  <img src={previewUrls[i]} alt={f.name} style={{ width: '100%', height: 80, objectFit: 'cover', borderRadius: 8 }} />
                  <div style={{ fontSize: 11, color: '#6b7280', marginTop: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{f.name}</div>
                  <div style={{ fontSize: 11, color: '#6b7280' }}>{kb(f.size)}</div>
                  <button type="button" onClick={() => removeAt(i)} style={{ position: 'absolute', top: 4, right: 4, border: 0, background: '#be123c', color: '#fff', borderRadius: 20, width: 22, height: 22, cursor: 'pointer', fontWeight: 700 }}>x</button>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 14 }}>
              <DownloadButton getBlob={buildPdf} filename="ppm-creator-images.pdf" label={busy ? 'Building PDF...' : 'Download PDF'} />
              <button type="button" onClick={reset} style={{ border: '1px solid #e7e5e4', background: 'transparent', color: '#1c1917', padding: '12px 20px', borderRadius: 10, fontWeight: 500, cursor: 'pointer', marginLeft: 8 }}>Clear all</button>
            </div>
          </div>
        )}
        {error && <p role="alert" style={{ color: '#be123c', fontSize: 14, marginTop: 10 }}>{error}</p>}
      </section>
    </ToolShell>
  )
}