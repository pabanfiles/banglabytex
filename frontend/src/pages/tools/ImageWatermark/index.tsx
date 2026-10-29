import { useEffect, useRef, useState } from 'react'
import ToolShell from '@/components/ToolShell'
import UploadBox from '@/components/UploadBox'
import DownloadButton from '@/components/DownloadButton'

type Pos = 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' | 'center'

export default function ImageWatermark() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [text, setText] = useState('PPM Creator')
  const [pos, setPos] = useState<Pos>('bottom-right')
  const [opacity, setOpacity] = useState(60)
  const [size, setSize] = useState(5)
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [error, setError] = useState('')
  const imgRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const handleFile = (f: File) => {
    setError('')
    if (!f.type.startsWith('image/')) { setError('Choose an image.'); return }
    const im = new Image()
    im.onload = () => {
      imgRef.current = im
      setFile(f)
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(URL.createObjectURL(f))
      setTimeout(render, 50)
    }
    im.onerror = () => setError('Could not open this image.')
    im.src = URL.createObjectURL(f)
  }

  const render = async () => {
    const im = imgRef.current
    const cv = canvasRef.current
    if (!im || !cv) return
    cv.width = im.width
    cv.height = im.height
    const ctx = cv.getContext('2d')
    if (!ctx) return
    ctx.drawImage(im, 0, 0)
    if (text) {
      ctx.font = 'bold ' + Math.max(10, Math.round((im.width / 100) * size)) + 'px system-ui, sans-serif'
      ctx.fillStyle = 'rgba(255,255,255,' + (opacity / 100) + ')'
      ctx.strokeStyle = 'rgba(0,0,0,' + Math.min(1, opacity / 100 + 0.1) + ')'
      ctx.lineWidth = 2
      ctx.textBaseline = 'top'
      const m = Math.round(im.width * 0.03)
      let x = m, y = m
      if (pos === 'top-right') { ctx.textAlign = 'right'; x = im.width - m }
      else if (pos === 'bottom-left') { ctx.textBaseline = 'bottom'; y = im.height - m }
      else if (pos === 'bottom-right') { ctx.textAlign = 'right'; ctx.textBaseline = 'bottom'; x = im.width - m; y = im.height - m }
      else if (pos === 'center') { ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; x = im.width / 2; y = im.height / 2 }
      ctx.strokeText(text, x, y)
      ctx.fillText(text, x, y)
    }
    await new Promise<void>((res) => { cv.toBlob((b) => { setResultBlob(b); res() }, 'image/jpeg', 0.92) })
  }

  useEffect(() => { if (file) render() /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [text, pos, opacity, size, file])

  const reset = () => { setFile(null); setPreviewUrl(''); setResultBlob(null); setError('') }

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this tool do?', a: 'It adds a text watermark to any image at a chosen position, size and opacity. You can download the JPEG after checking the preview.' },
      { q: 'Is it free?', a: 'Yes. No account, no upload.' },
      { q: 'Is my image uploaded?', a: 'No. Everything runs in your browser.' },
    ]},
    { heading: 'Design', items: [
      { q: 'Which positions are available?', a: 'Top-left, top-right, bottom-left, bottom-right and centre. Bottom-right is the most common for copyright marks.' },
      { q: 'What opacity should I use?', a: 'Around 50 to 70 percent keeps the watermark visible without hiding the image. Lower values are subtler but easier to miss.' },
      { q: 'Does the watermark scale with the image?', a: 'Yes. The font size is set as a percentage of the image width, so it looks the same on small and large images.' },
    ]},
    { heading: 'Output', items: [
      { q: 'What format is the download?', a: 'JPEG, widely supported and small.' },
      { q: 'Can I remove the watermark later?', a: 'The watermark is baked into the JPEG. Keep the original if you may need it without the mark.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to add a text watermark</h2>
      <ol>
        <li>Upload an image.</li>
        <li>Type the text.</li>
        <li>Pick a corner, size and opacity.</li>
        <li>Press Download.</li>
      </ol>
      <h2>Why use this tool</h2>
      <p>A quick way to mark images before sharing. No upload, and the watermark scales cleanly at every image size.</p>
      <h2>Privacy</h2>
      <p>The file stays in your browser.</p>
    </>
  )

  return (
    <ToolShell
      title="Image Watermark Online Free | PPM Creator"
      description="Add a text watermark to an image with position, size and opacity controls. Runs in your browser."
      path="/image-watermark"
      crumb={[{ label: 'Image Tools', to: '/image-tools' }]}
      h1="Image Watermark"
      lead="Add a text watermark to any image and download a JPEG."
      faqGroups={faqGroups}
      related={[
        { name: 'Image Compressor', href: '/image-compress', blurb: 'Reduce file size' },
        { name: 'Image Cropper', href: '/image-crop', blurb: 'Crop to a size' },
        { name: 'Meme Generator', href: '/meme-generator', blurb: 'Add meme text' },
        { name: 'Image Resizer', href: '/image-resize', blurb: 'Change size' },
      ]}
      guides={[
        { title: 'Choosing a watermark position' },
        { title: 'Watermark opacity tips' },
        { title: 'Watermark vs copyright metadata' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {!file && <UploadBox accept="image/*" maxMB={25} hint="Image - up to 25 MB" onFile={handleFile} />}
        {file && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><img src={previewUrl} alt="Preview" style={{ maxHeight: 220, borderRadius: 10 }} /></div>
            <label style={{ fontSize: 13, color: '#6b7280' }}>Watermark text</label>
            <input value={text} onChange={(e) => setText(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 4, marginBottom: 8, fontSize: 14 }} />
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
              {(['top-left', 'top-right', 'bottom-left', 'bottom-right', 'center'] as Pos[]).map((p) => (
                <button key={p} type="button" onClick={() => setPos(p)} style={{ padding: '8px 12px', borderRadius: 10, border: '1px solid ' + (pos === p ? '#F97316' : '#e7e5e4'), background: pos === p ? '#FFF7ED' : '#fff', color: pos === p ? '#F97316' : '#1c1917', fontSize: 12, cursor: 'pointer' }}>{p.replace('-', ' ')}</button>
              ))}
            </div>
            <label style={{ fontSize: 13, color: '#6b7280' }}>Opacity: {opacity}%</label>
            <input type="range" min={10} max={100} value={opacity} onChange={(e) => setOpacity(Number(e.target.value))} style={{ width: '100%', accentColor: '#F97316', margin: '6px 0 8px' }} />
            <label style={{ fontSize: 13, color: '#6b7280' }}>Size: {size}%</label>
            <input type="range" min={2} max={15} value={size} onChange={(e) => setSize(Number(e.target.value))} style={{ width: '100%', accentColor: '#F97316', margin: '6px 0 12px' }} />
            <DownloadButton getBlob={async () => resultBlob} filename="watermarked.jpg" label="Download" />
            <button type="button" onClick={reset} style={{ border: '1px solid #e7e5e4', background: 'transparent', padding: '12px 20px', borderRadius: 10, fontWeight: 500, cursor: 'pointer', marginLeft: 8 }}>Choose another</button>
          </div>
        )}
        {error && <p style={{ color: '#be123c', fontSize: 14 }}>{error}</p>}
      </section>
    </ToolShell>
  )
}