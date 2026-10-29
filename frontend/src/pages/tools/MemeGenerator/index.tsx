import { useEffect, useRef, useState } from 'react'
import ToolShell from '@/components/ToolShell'
import UploadBox from '@/components/UploadBox'
import DownloadButton from '@/components/DownloadButton'

export default function MemeGenerator() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [top, setTop] = useState('WHEN YOU FIX ONE BUG')
  const [bottom, setBottom] = useState('AND CREATE THREE MORE')
  const [fontSize, setFontSize] = useState(48)
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [error, setError] = useState('')
  const imgRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const handleFile = (f: File) => {
    setError('')
    if (!f.type.startsWith('image/')) { setError('Choose an image.'); return }
    if (f.size > 25 * 1048576) { setError('Max 25 MB.'); return }
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
    ctx.fillStyle = '#fff'
    ctx.strokeStyle = '#000'
    ctx.lineWidth = Math.max(3, fontSize / 10)
    ctx.textAlign = 'center'
    const fs = Math.max(16, Math.round((im.width / 800) * fontSize))
    ctx.font = 'bold ' + fs + 'px Impact, Arial Black, sans-serif'
    if (top) {
      ctx.textBaseline = 'top'
      const y = Math.max(10, fs / 4)
      ctx.strokeText(top.toUpperCase(), cv.width / 2, y, cv.width - 20)
      ctx.fillText(top.toUpperCase(), cv.width / 2, y, cv.width - 20)
    }
    if (bottom) {
      ctx.textBaseline = 'bottom'
      const y = cv.height - Math.max(10, fs / 4)
      ctx.strokeText(bottom.toUpperCase(), cv.width / 2, y, cv.width - 20)
      ctx.fillText(bottom.toUpperCase(), cv.width / 2, y, cv.width - 20)
    }
    await new Promise<void>((res) => {
      cv.toBlob((b) => { setResultBlob(b); res() }, 'image/jpeg', 0.92)
    })
  }

  useEffect(() => { if (file) render() /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [top, bottom, fontSize, file])

  const reset = () => { setFile(null); setPreviewUrl(''); setResultBlob(null); setError('') }

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this tool do?', a: 'It adds top and bottom text over an image in the classic meme style. Text is uppercase, white with a black outline. You can change the text and the font size.' },
      { q: 'Is it free?', a: 'Yes. No account, no upload, no daily limit.' },
      { q: 'Is my image uploaded?', a: 'No. Everything runs in your browser.' },
    ]},
    { heading: 'Design', items: [
      { q: 'Which font is used?', a: 'Impact, the classic meme font. If your system does not have it, the browser falls back to Arial Black or the default bold sans font.' },
      { q: 'Why does text shrink on very wide images?', a: 'The font size scales with the image width so the text fits on screen at any size. Increase the font size slider to make it larger.' },
      { q: 'Can I use a different image size?', a: 'Yes. The canvas takes the size of the uploaded image, so there is no fixed aspect ratio.' },
    ]},
    { heading: 'Output', items: [
      { q: 'What format is the download?', a: 'JPEG, which is widely supported and small.' },
      { q: 'Can I use the meme commercially?', a: 'Only if you own the source image or the license allows it. The tool does not change copyright.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to make a meme</h2>
      <ol>
        <li>Upload an image.</li>
        <li>Type the top and bottom text.</li>
        <li>Adjust the font size.</li>
        <li>Press Download to save the JPEG.</li>
      </ol>
      <h2>Why use this tool</h2>
      <p>Quick, no upload, no signup. The classic white-on-black text is what most people expect from a meme.</p>
      <h2>Privacy</h2>
      <p>Everything runs in your browser.</p>
    </>
  )

  return (
    <ToolShell
      title="Meme Generator Online Free | PPM Creator"
      description="Add top and bottom text over an image to make a meme. Runs in your browser."
      path="/meme-generator"
      crumb={[{ label: 'Image Tools', to: '/image-tools' }]}
      h1="Meme Generator"
      lead="Add top and bottom text over your image and download a JPEG."
      faqGroups={faqGroups}
      related={[
        { name: 'Image Compressor', href: '/image-compress', blurb: 'Reduce file size' },
        { name: 'Image Cropper', href: '/image-crop', blurb: 'Crop to a size' },
        { name: 'Image Watermark', href: '/image-watermark', blurb: 'Add a text watermark' },
        { name: 'Image Resizer', href: '/image-resize', blurb: 'Resize pixels' },
      ]}
      guides={[
        { title: 'Classic meme text style' },
        { title: 'Choosing a font size' },
        { title: 'Why Impact is the meme font' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {!file && <UploadBox accept="image/*" maxMB={25} hint="Image - up to 25 MB" onFile={handleFile} />}
        {file && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><img src={previewUrl} alt="Preview" style={{ maxHeight: 240, borderRadius: 10 }} /></div>
            <label style={{ fontSize: 13, color: '#6b7280' }}>Top text</label>
            <input value={top} onChange={(e) => setTop(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 4, marginBottom: 8, fontSize: 14 }} />
            <label style={{ fontSize: 13, color: '#6b7280' }}>Bottom text</label>
            <input value={bottom} onChange={(e) => setBottom(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 4, marginBottom: 8, fontSize: 14 }} />
            <label style={{ fontSize: 13, color: '#6b7280' }}>Font size: {fontSize}</label>
            <input type="range" min={20} max={120} value={fontSize} onChange={(e) => setFontSize(Number(e.target.value))} style={{ width: '100%', accentColor: '#F97316', margin: '6px 0 12px' }} />
            <DownloadButton getBlob={async () => resultBlob} filename="meme.jpg" label="Download meme" />
            <button type="button" onClick={reset} style={{ border: '1px solid #e7e5e4', background: 'transparent', padding: '12px 20px', borderRadius: 10, fontWeight: 500, cursor: 'pointer', marginLeft: 8 }}>Choose another</button>
          </div>
        )}
        {error && <p style={{ color: '#be123c', fontSize: 14 }}>{error}</p>}
      </section>
    </ToolShell>
  )
}