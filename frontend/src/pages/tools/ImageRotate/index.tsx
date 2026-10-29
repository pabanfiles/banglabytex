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