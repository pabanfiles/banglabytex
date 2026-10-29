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

Write-Host "=== Batch 3 ===" -ForegroundColor Cyan

# ============ IMAGE TO BASE64 ============
BK "ImageToBase64\index.tsx"
WF "ImageToBase64\index.tsx" @"
import { useState } from 'react'
import ToolShell from '@/components/ToolShell'
import UploadBox from '@/components/UploadBox'

function kb(b: number) { return b < 1048576 ? (b / 1024).toFixed(0) + ' KB' : (b / 1048576).toFixed(2) + ' MB' }

export default function ImageToBase64() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [b64, setB64] = useState('')
  const [origBytes, setOrigBytes] = useState(0)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const handleFile = (f: File) => {
    setError(''); setB64(''); setCopied(false)
    if (!f.type.startsWith('image/')) { setError('Please choose an image file.'); return }
    if (f.size > 5 * 1048576) { setError('For best results, keep the file under 5 MB.'); return }
    setOrigBytes(f.size)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(URL.createObjectURL(f))
    const reader = new FileReader()
    reader.onload = () => { setB64(String(reader.result || '')); setFile(f) }
    reader.onerror = () => setError('Could not read the file.')
    reader.readAsDataURL(f)
  }

  const copy = async () => {
    try { await navigator.clipboard.writeText(b64); setCopied(true); setTimeout(() => setCopied(false), 1600) } catch {}
  }

  const reset = () => {
    setFile(null); setPreviewUrl(''); setB64(''); setOrigBytes(0); setError('')
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  }

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What is Base64?', a: 'Base64 is a way to represent binary data as text using only letters, numbers, and a few symbols. It is used when a system needs to carry a file inside text, such as inside HTML, CSS, or JSON.' },
      { q: 'What does this tool do?', a: 'It reads an image file and outputs a Base64 data URL string. You can copy that string and paste it into CSS, HTML, or JSON without needing a separate image file.' },
      { q: 'Is it free?', a: 'Yes. No account is needed. The file is read in your browser and nothing is uploaded.' },
    ]},
    { heading: 'Using the output', items: [
      { q: 'Where can I use the string?', a: 'The most common place is in CSS for small icons and backgrounds, or inside HTML for inline images. It also fits in JSON payloads where a URL is not possible.' },
      { q: 'Why is the string bigger than the file?', a: 'Base64 uses about 4 characters to store 3 bytes, so the string is roughly 33 percent larger than the original file. This is fine for small images and expensive for large ones.' },
      { q: 'Can I decode the string back to an image?', a: 'Yes. The data URL starts with data:image/... and can be pasted into any browser address bar to view the image, or written to a file with the correct extension.' },
      { q: 'What size should I keep?', a: 'For CSS and inline use, keep the image under 100 KB. Larger images make pages heavy and slow to parse. For a payload you can go higher, but check the receiver size limit.' },
    ]},
    { heading: 'Privacy and troubleshooting', items: [
      { q: 'Is my image uploaded?', a: 'No. The image is read locally by your browser. It is never sent to a server.' },
      { q: 'Why is the copy button not working?', a: 'Some browsers block clipboard access on insecure pages. Use localhost or HTTPS, or select the text manually and copy it.' },
      { q: 'What format is the string?', a: 'It is a data URL such as data:image/png;base64,.... The prefix tells the browser how to display the image.' },
      { q: 'Can I convert the string back to a file?', a: 'Yes. Paste the data URL into a browser tab to view it, or use any Base64 decoder to save it as a file.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to convert an image to Base64</h2>
      <ol>
        <li>Tap the box and choose an image.</li>
        <li>The tool reads the file and shows the Base64 string.</li>
        <li>Copy the string and paste it into your CSS, HTML, or JSON.</li>
      </ol>
      <h2>Why use Base64</h2>
      <p>Base64 lets you carry a file inside text. It is useful when a system cannot load an external URL, or when you want a single file to contain everything it needs. Small icons in CSS are a common example.</p>
      <h2>Limits and trade-offs</h2>
      <p>Base64 makes the data about 33 percent larger, so use it for small assets. For large images, a normal file URL is smaller and caches better.</p>
      <h2>Privacy and data</h2>
      <p>The file is read in your browser. Nothing is uploaded. When you close the tab, the string and the file are gone.</p>
    </>
  )

  return (
    <ToolShell
      title="Image to Base64 Converter Online Free | PPM Creator"
      description="Convert an image file to a Base64 data URL online for free. Copy the string for CSS, HTML, or JSON. Files stay in your browser."
      path="/image-to-base64"
      crumb={[{ label: 'Image Tools', to: '/image-tools' }]}
      h1="Image to Base64: Turn an Image into Text"
      lead="Upload an image and copy the Base64 string. Useful for CSS icons and inline data."
      faqGroups={faqGroups}
      related={[
        { name: 'Image Compressor', href: '/image-compress', blurb: 'Reduce file size at a chosen quality' },
        { name: 'Image Converter', href: '/image-convert', blurb: 'Change JPG, PNG and WebP formats' },
        { name: 'Favicon Generator', href: '/favicon-generator', blurb: 'Make favicons from one image' },
        { name: 'QR Code Generator', href: '/qr-code-gen', blurb: 'Create a QR code from a link' },
      ]}
      guides={[
        { title: 'When to use Base64 in CSS' },
        { title: 'Base64 size overhead explained' },
        { title: 'Decoding a data URL to a file' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        {!file && <UploadBox accept="image/*" maxMB={5} hint="Image file - up to 5 MB - nothing is uploaded" onFile={handleFile} />}
        {file && (
          <div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12 }}>
              <img src={previewUrl} alt="Preview" style={{ width: 88, height: 88, objectFit: 'cover', borderRadius: 10, border: '1px solid #e7e5e4' }} />
              <div>
                <b>{file.name}</b>
                <div style={{ fontSize: 13, color: '#6b7280' }}>{kb(origBytes)}</div>
              </div>
            </div>
            <textarea readOnly value={b64} rows={10} style={{ width: '100%', fontFamily: 'monospace', fontSize: 12, padding: 12, border: '1px solid #e7e5e4', borderRadius: 10, background: '#fff', wordBreak: 'break-all' }} />
            <div style={{ marginTop: 10 }}>
              <button type="button" onClick={copy} style={{ border: 0, padding: '12px 20px', borderRadius: 10, background: '#F97316', color: '#fff', fontWeight: 600, cursor: 'pointer', marginRight: 8 }}>{copied ? 'Copied' : 'Copy Base64'}</button>
              <button type="button" onClick={reset} style={{ border: '1px solid #e7e5e4', padding: '12px 20px', borderRadius: 10, background: 'transparent', color: '#1c1917', fontWeight: 500, cursor: 'pointer' }}>Choose another</button>
            </div>
          </div>
        )}
        {error && <p role="alert" style={{ color: '#be123c', fontSize: 14, marginTop: 10 }}>{error}</p>}
      </section>
    </ToolShell>
  )
}
"@
Write-Host "  [+] ImageToBase64 done" -ForegroundColor Green

# ============ IMAGE ROTATE ============
BK "ImageRotate\index.tsx"
WF "ImageRotate\index.tsx" @"
import { useEffect, useRef, useState } from 'react'
import ToolShell from '@/components/ToolShell'
import UploadBox from '@/components/UploadBox'
import DownloadButton from '@/components/DownloadButton'

function kb(b: number) { return b < 1048576 ? (b / 1024).toFixed(0) + ' KB' : (b / 1048576).toFixed(2) + ' MB' }

export default function ImageRotate() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [origW, setOrigW] = useState(0)
  const [origH, setOrigH] = useState(0)
  const [origBytes, setOrigBytes] = useState(0)
  const [angle, setAngle] = useState(0)
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [newBytes, setNewBytes] = useState<number | null>(null)

  const imgRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const handleFile = (f: File) => {
    setError('')
    if (!f.type.startsWith('image/')) { setError('Please choose an image file.'); return }
    if (f.size > 25 * 1048576) { setError('This file is over 25 MB.'); return }
    const im = new Image()
    im.onload = () => {
      imgRef.current = im
      setOrigW(im.width); setOrigH(im.height); setOrigBytes(f.size)
      setAngle(0); setFlipH(false); setFlipV(false)
      setFile(f); setResultBlob(null); setNewBytes(null)
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(URL.createObjectURL(f))
      setTimeout(render, 50)
    }
    im.onerror = () => setError('This image could not be opened.')
    im.src = URL.createObjectURL(f)
  }

  const render = async () => {
    const im = imgRef.current
    const cv = canvasRef.current
    if (!im || !cv) return
    setBusy(true)
    const rad = (angle * Math.PI) / 180
    const cos = Math.abs(Math.cos(rad)), sin = Math.abs(Math.sin(rad))
    const w = im.width * cos + im.height * sin
    const h = im.width * sin + im.height * cos
    cv.width = Math.round(w); cv.height = Math.round(h)
    const ctx = cv.getContext('2d')
    if (!ctx) { setBusy(false); return }
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height)
    ctx.translate(cv.width / 2, cv.height / 2)
    ctx.rotate(rad)
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1)
    ctx.drawImage(im, -im.width / 2, -im.height / 2)
    await new Promise<void>((res) => {
      cv.toBlob((b) => { setResultBlob(b); setNewBytes(b ? b.size : null); setBusy(false); res() }, 'image/jpeg', 0.92)
    })
  }

  useEffect(() => { if (file) render() /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [angle, flipH, flipV, file])

  const reset = () => {
    setFile(null); setPreviewUrl(''); setAngle(0); setFlipH(false); setFlipV(false)
    setResultBlob(null); setNewBytes(null); setError('')
  }

  const filename = (() => {
    if (!file) return 'ppm-creator-rotated.jpg'
    const base = file.name.replace(/\.[^.]+$/, '')
    return (base || 'image') + '-rotated.jpg'
  })()

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this tool do?', a: 'It rotates or flips an image and saves a JPEG. You can rotate in one-degree steps and flip the image horizontally or vertically.' },
      { q: 'Is it free?', a: 'Yes. No account is needed, and the file stays in your browser.' },
      { q: 'Do I lose quality?', a: 'A small amount. The output is re-encoded as JPEG, which applies slight compression. Rotating a copy of the original keeps the best quality.' },
    ]},
    { heading: 'Rotation', items: [
      { q: 'How does the angle work?', a: 'The angle rotates the image around its centre. Positive angles rotate clockwise. The canvas grows to fit the rotated image, so corners are not cut off.' },
      { q: 'What does flipping do?', a: 'Flipping mirrors the image horizontally or vertically. Horizontal flip is useful for selfies. Vertical flip turns the image upside down.' },
      { q: 'Why does the file size change after a 90-degree rotation?', a: 'The canvas grows to fit the rotated image, so the total pixel count changes. A larger canvas gives a larger file.' },
    ]},
    { heading: 'Privacy and output', items: [
      { q: 'Is my image uploaded?', a: 'No. The image is loaded and rotated in your browser. It is never sent to a server.' },
      { q: 'What format is the download?', a: 'JPEG, with the original name and rotated appended.' },
      { q: 'Can I undo the change?', a: 'Yes. Move the slider back to zero and uncheck the flip boxes. The preview updates immediately.' },
    ]},
    { heading: 'Troubleshooting', items: [
      { q: 'Why does the preview show white edges?', a: 'When you rotate by a non-90-degree angle, the corners of the canvas may be filled with the white background. This is expected.' },
      { q: 'What is the maximum file size?', a: 'Files up to 25 MB work. Very large photos may take a moment to load on older phones.' },
      { q: 'Why is the download button disabled?', a: 'It is disabled while the tool prepares the final JPEG. The pause is usually under a second.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to rotate or flip an image</h2>
      <ol>
        <li>Upload an image.</li>
        <li>Move the angle slider, or tick flip horizontal or flip vertical.</li>
        <li>Press Download to save the JPEG.</li>
      </ol>
      <h2>Why use this tool</h2>
      <p>It covers a small but common need: a photo taken sideways, a selfie you want to mirror, or a scan that needs to be turned. The browser does the work, so there is no upload and no waiting for a server.</p>
      <h2>Privacy and data</h2>
      <p>The file stays on your device. Nothing is uploaded or stored.</p>
    </>
  )

  return (
    <ToolShell
      title="Rotate or Flip an Image Online Free | PPM Creator"
      description="Rotate an image by any angle or flip it horizontally and vertically online for free. Files stay in your browser."
      path="/image-rotate"
      crumb={[{ label: 'Image Tools', to: '/image-tools' }]}
      h1="Rotate and Flip Image Online"
      lead="Rotate by any angle or flip a photo, then download a JPEG."
      faqGroups={faqGroups}
      related={[
        { name: 'Image Cropper', href: '/image-crop', blurb: 'Crop to a square or custom size' },
        { name: 'Image Resizer', href: '/image-resize', blurb: 'Change width and height in pixels' },
        { name: 'Image Compressor', href: '/image-compress', blurb: 'Reduce file size at a chosen quality' },
        { name: 'Image Converter', href: '/image-convert', blurb: 'Change JPG, PNG and WebP formats' },
      ]}
      guides={[
        { title: 'Fixing a sideways photo' },
        { title: 'Rotation vs flipping: which to choose' },
        { title: 'Keeping quality when you rotate a photo' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {!file && <UploadBox accept="image/*" maxMB={25} hint="JPG, PNG or WebP - up to 25 MB - nothing is uploaded" onFile={handleFile} />}
        {file && (
          <div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12 }}>
              <img src={previewUrl} alt="Original" style={{ width: 88, height: 88, objectFit: 'cover', borderRadius: 10, border: '1px solid #e7e5e4' }} />
              <div>
                <b>{origW} x {origH} px</b>
                <div style={{ fontSize: 13, color: '#6b7280' }}>{file.name} - {kb(origBytes)}</div>
              </div>
            </div>
            <label style={{ fontSize: 13, color: '#6b7280' }}>Angle: {angle} degrees</label>
            <input type="range" min={-180} max={180} step={1} value={angle} onChange={(e) => setAngle(Number(e.target.value))} style={{ width: '100%', accentColor: '#F97316', margin: '6px 0 10px' }} />
            <div style={{ display: 'flex', gap: 16, marginBottom: 12 }}>
              <label style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><input type="checkbox" checked={flipH} onChange={(e) => setFlipH(e.target.checked)} />Flip horizontal</label>
              <label style={{ fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}><input type="checkbox" checked={flipV} onChange={(e) => setFlipV(e.target.checked)} />Flip vertical</label>
            </div>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 10 }}>New size: {newBytes != null ? kb(newBytes) : (busy ? '...' : '-')}</div>
            <div>
              <DownloadButton getBlob={async () => resultBlob} filename={filename} label="Download rotated image" />
              <button type="button" onClick={reset} style={{ border: '1px solid #e7e5e4', background: 'transparent', color: '#1c1917', padding: '12px 20px', borderRadius: 10, fontWeight: 500, cursor: 'pointer', marginLeft: 8 }}>Choose another</button>
            </div>
          </div>
        )}
        {error && <p role="alert" style={{ color: '#be123c', fontSize: 14, marginTop: 10 }}>{error}</p>}
      </section>
    </ToolShell>
  )
}
"@
Write-Host "  [+] ImageRotate done" -ForegroundColor Green

# ============ IMAGE TO PDF ============
BK "ImageToPdf\index.tsx"
WF "ImageToPdf\index.tsx" @"
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
"@
Write-Host "  [+] ImageToPdf done" -ForegroundColor Green

Write-Host "=== Batch 3 done. Build next. ===" -ForegroundColor Green