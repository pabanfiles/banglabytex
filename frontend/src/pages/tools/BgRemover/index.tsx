import { useRef, useState } from 'react'
import ToolShell from '@/components/ToolShell'
import UploadBox from '@/components/UploadBox'
import DownloadButton from '@/components/DownloadButton'

function kb(b: number) { return b < 1048576 ? (b / 1024).toFixed(0) + ' KB' : (b / 1048576).toFixed(2) + ' MB' }

export default function BgRemover() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [origBytes, setOrigBytes] = useState(0)
  const [tolerance, setTolerance] = useState(30)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [newBytes, setNewBytes] = useState<number | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const handleFile = (f: File) => {
    setError('')
    if (!f.type.startsWith('image/')) { setError('Please choose an image.'); return }
    if (f.size > 25 * 1048576) { setError('This file is over 25 MB.'); return }
    const im = new Image()
    im.onload = () => {
      imgRef.current = im
      setOrigBytes(f.size)
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
    cv.width = im.width; cv.height = im.height
    const ctx = cv.getContext('2d')
    if (!ctx) { setBusy(false); return }
    ctx.drawImage(im, 0, 0)
    const data = ctx.getImageData(0, 0, cv.width, cv.height)
    const d = data.data
    // pick background colour from four corners
    const getPix = (x: number, y: number) => {
      const i = (y * cv.width + x) * 4
      return [d[i], d[i + 1], d[i + 2]]
    }
    const corners = [getPix(0, 0), getPix(cv.width - 1, 0), getPix(0, cv.height - 1), getPix(cv.width - 1, cv.height - 1)]
    const bg = corners.reduce((acc, c) => [acc[0] + c[0] / 4, acc[1] + c[1] / 4, acc[2] + c[2] / 4], [0, 0, 0] as number[])
    const tol2 = tolerance * tolerance * 3
    for (let i = 0; i < d.length; i += 4) {
      const dr = d[i] - bg[0], dg = d[i + 1] - bg[1], db = d[i + 2] - bg[2]
      if (dr * dr + dg * dg + db * db < tol2) d[i + 3] = 0
    }
    ctx.putImageData(data, 0, 0)
    await new Promise<void>((res) => {
      cv.toBlob((b) => { setResultBlob(b); setNewBytes(b ? b.size : null); setBusy(false); res() }, 'image/png')
    })
  }

  const reset = () => { setFile(null); setPreviewUrl(''); setResultBlob(null); setNewBytes(null); setError('') }

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this tool do?', a: 'It removes a solid background colour by sampling the four corners of the image and making pixels close to that colour transparent. It works best on clean studio or product photos.' },
      { q: 'Is it free?', a: 'Yes. No account, no upload, no daily limit.' },
      { q: 'Is my image uploaded?', a: 'No. The tool runs in your browser. The image is not sent to any server.' },
    ]},
    { heading: 'Results', items: [
      { q: 'Why does the background stay?', a: 'If the background is not a single flat colour, corner sampling may not match it. Try a cleaner photo, or use the tolerance slider to widen the matching range.' },
      { q: 'What does the tolerance slider do?', a: 'Higher values match more colours as background, which removes more of the background but may also remove parts of the subject. Lower values are safer for photos with distinct subjects.' },
      { q: 'Does the tool handle hair and edges?', a: 'Not precisely. The tool removes flat background colour, so fine edges and hair may still carry a faint halo. A dedicated AI background remover gives cleaner edges for portraits.' },
    ]},
    { heading: 'Output', items: [
      { q: 'What format is the download?', a: 'PNG. It keeps the transparency and is accepted by most design tools.' },
      { q: 'Can I add a new background later?', a: 'Yes. Open the PNG in any editor and place it over a new colour or photo.' },
      { q: 'Why is the new file sometimes larger?', a: 'PNG stores transparency and does not throw away pixel detail, so a transparent PNG can be larger than the compressed JPEG you started with.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to remove a background</h2>
      <ol>
        <li>Upload a photo with a clean background.</li>
        <li>Move the tolerance slider to widen or narrow the background match.</li>
        <li>Press Download to save the transparent PNG.</li>
      </ol>
      <h2>Why use this tool</h2>
      <p>For product shots and clean studio photos, corner sampling removes the background quickly and locally, without an upload and without a subscription.</p>
      <h2>Limitations</h2>
      <p>This is a colour-based remover, not an AI model. Complex backgrounds, hair and translucent edges need a dedicated tool.</p>
      <h2>Privacy and data</h2>
      <p>The image stays on your device. Nothing is uploaded.</p>
    </>
  )

  return (
    <ToolShell
      title="Background Remover Online Free | PPM Creator"
      description="Remove a solid background colour from an image and download a transparent PNG. Files stay in your browser."
      path="/bg-remover"
      crumb={[{ label: 'Image Tools', to: '/image-tools' }]}
      h1="Background Remover: Make a Solid Colour Transparent"
      lead="Remove a flat background colour and download a transparent PNG. Best for clean studio photos."
      faqGroups={faqGroups}
      related={[
        { name: 'Image Compressor', href: '/image-compress', blurb: 'Reduce file size at a chosen quality' },
        { name: 'Image Cropper', href: '/image-crop', blurb: 'Crop to a square or custom size' },
        { name: 'Image Converter', href: '/image-convert', blurb: 'Change JPG, PNG and WebP formats' },
        { name: 'Image Resizer', href: '/image-resize', blurb: 'Change width and height in pixels' },
      ]}
      guides={[
        { title: 'Photographing a product on a clean background' },
        { title: 'Transparent PNG vs JPEG: when to use which' },
        { title: 'Why hair edges are hard to remove' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {!file && <UploadBox accept="image/*" maxMB={25} hint="Image with a clean background - up to 25 MB - nothing is uploaded" onFile={handleFile} />}
        {file && (
          <div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12 }}>
              <img src={previewUrl} alt="Original" style={{ width: 88, height: 88, objectFit: 'cover', borderRadius: 10, border: '1px solid #e7e5e4' }} />
              <div><b>{file.name}</b><div style={{ fontSize: 13, color: '#6b7280' }}>{kb(origBytes)}</div></div>
            </div>
            <label style={{ fontSize: 13, color: '#6b7280' }}>Tolerance: {tolerance}</label>
            <input type="range" min={5} max={80} step={1} value={tolerance} onChange={(e) => setTolerance(Number(e.target.value))} onMouseUp={render} onTouchEnd={render} style={{ width: '100%', accentColor: '#F97316', margin: '6px 0 12px' }} />
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 10 }}>New size: {newBytes != null ? kb(newBytes) : (busy ? '...' : '-')}</div>
            <DownloadButton getBlob={async () => resultBlob} filename={file.name.replace(/\.[^.]+$/, '') + '-transparent.png'} label="Download PNG" />
            <button type="button" onClick={reset} style={{ border: '1px solid #e7e5e4', background: 'transparent', color: '#1c1917', padding: '12px 20px', borderRadius: 10, fontWeight: 500, cursor: 'pointer', marginLeft: 8 }}>Choose another</button>
          </div>
        )}
        {error && <p role="alert" style={{ color: '#be123c', fontSize: 14, marginTop: 10 }}>{error}</p>}
      </section>
    </ToolShell>
  )
}