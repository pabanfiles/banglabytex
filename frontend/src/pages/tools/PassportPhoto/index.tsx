import { useRef, useState } from 'react'
import ToolShell from '@/components/ToolShell'
import UploadBox from '@/components/UploadBox'
import DownloadButton from '@/components/DownloadButton'

function kb(b: number) { return b < 1048576 ? (b / 1024).toFixed(0) + ' KB' : (b / 1048576).toFixed(2) + ' MB' }

type Preset = { name: string; w: number; h: number }
const PRESETS: Preset[] = [
  { name: '35 x 45 mm', w: 413, h: 531 },
  { name: '2 x 2 inch', w: 600, h: 600 },
  { name: '51 x 51 mm', w: 600, h: 600 },
  { name: '35 x 35 mm', w: 413, h: 413 },
]

export default function PassportPhoto() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [origW, setOrigW] = useState(0)
  const [origH, setOrigH] = useState(0)
  const [origBytes, setOrigBytes] = useState(0)
  const [preset, setPreset] = useState<Preset>(PRESETS[0])
  const [zoom, setZoom] = useState(1)
  const [offsetY, setOffsetY] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [newBytes, setNewBytes] = useState<number | null>(null)

  const imgRef = useRef<HTMLImageElement | null>(null)
  const cvRef = useRef<HTMLCanvasElement | null>(null)

  const handleFile = (f: File) => {
    setError('')
    if (!f.type.startsWith('image/')) { setError('Please choose a JPG, PNG or WebP image.'); return }
    if (f.size > 25 * 1048576) { setError('This file is over 25 MB.'); return }
    const im = new Image()
    im.onload = () => {
      imgRef.current = im
      setOrigW(im.width); setOrigH(im.height); setOrigBytes(f.size)
      setFile(f); setResultBlob(null); setNewBytes(null)
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(URL.createObjectURL(f))
      setTimeout(() => render(), 50)
    }
    im.onerror = () => setError('This image could not be opened.')
    im.src = URL.createObjectURL(f)
  }

  const render = async () => {
    const im = imgRef.current
    const cv = cvRef.current
    if (!im || !cv) return
    setBusy(true)
    cv.width = preset.w
    cv.height = preset.h
    const ctx = cv.getContext('2d')
    if (!ctx) { setBusy(false); return }
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height)
    // cover: fill the preset box, honouring zoom + offsetY (in %)
    const targetRatio = preset.w / preset.h
    const srcRatio = im.width / im.height
    let sw = im.width, sh = im.height
    if (srcRatio > targetRatio) { sw = im.height * targetRatio } else { sh = im.width / targetRatio }
    sw = sw / zoom
    sh = sh / zoom
    const sx = (im.width - sw) / 2
    const sy = (im.height - sh) / 2 + (offsetY / 100) * sh
    ctx.drawImage(im, sx, sy, sw, sh, 0, 0, cv.width, cv.height)
    await new Promise<void>((res) => {
      cv.toBlob((b) => { setResultBlob(b); setNewBytes(b ? b.size : null); setBusy(false); res() }, 'image/jpeg', 0.92)
    })
  }

  const reset = () => {
    setFile(null); setPreviewUrl(''); setOrigW(0); setOrigH(0); setOrigBytes(0)
    setResultBlob(null); setNewBytes(null); setZoom(1); setOffsetY(0); setError('')
  }

  const filename = (() => {
    if (!file) return 'ppm-creator-passport.jpg'
    const base = file.name.replace(/\.[^.]+$/, '')
    return (base || 'photo') + '-passport.jpg'
  })()

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this passport photo tool do?', a: 'It crops a photo to a common passport or visa size and saves a JPEG. You control the zoom and the vertical position, so you can line up the face before downloading.' },
      { q: 'Are these the official sizes?', a: 'No. The sizes listed are common examples. Each form sets its own rules for size, background and head height. Check the official instructions published by the authority you are applying to.' },
      { q: 'Is it free?', a: 'Yes. No account is needed and there is no daily limit. The tool runs in your browser.' },
    ]},
    { heading: 'Photo quality', items: [
      { q: 'What kind of photo should I start with?', a: 'Use a well-lit photo taken straight on, with the face filling most of the frame. Avoid shadows and busy backgrounds. A neutral face with the eyes open works best.' },
      { q: 'How do I line up the head?', a: 'Zoom in with the slider and drag the vertical position until the top of the head is near the top of the frame and the chin is near the bottom third.' },
      { q: 'Does the tool remove the background?', a: 'No. It only crops and rescales. If the form needs a plain background, take the photo against a plain wall, or remove the background in a separate editor first.' },
    ]},
    { heading: 'Privacy and output', items: [
      { q: 'Is my photo uploaded?', a: 'No. The photo stays in your browser. It is never sent to a server and never stored by this site.' },
      { q: 'What format is the download?', a: 'JPEG, because most forms accept it. The file name includes passport so you can spot it later.' },
      { q: 'Can I print the result at home?', a: 'Yes, but check the print size and paper quality carefully. A print shop often does a better job than a home printer for a formal photo.' },
    ]},
    { heading: 'Troubleshooting', items: [
      { q: 'Why does my photo look stretched?', a: 'The tool fills the crop box without changing the photo proportions. If the subject looks stretched, it is usually a very different starting aspect ratio. Try a different preset or start from a closer crop.' },
      { q: 'Can I use the result for a government form?', a: 'Only if the form allows a self-prepared photo. Many forms require a photo from an approved studio, so check the official instructions before submitting.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to prepare a passport-style photo</h2>
      <ol>
        <li>Choose a photo taken against a plain background.</li>
        <li>Pick the size closest to what your form asks for.</li>
        <li>Zoom and adjust the vertical position until the face fits the frame.</li>
        <li>Download the JPEG and check it against the form instructions.</li>
      </ol>
      <h2>Important disclaimer</h2>
      <p>The sizes shown are examples. They are not official requirements. Always check the official instructions published by the authority handling your application. Government forms often have specific rules about background colour, head height and photo age.</p>
      <h2>Why use this tool</h2>
      <p>You can prepare a photo at home without uploading it anywhere. The tool keeps the photo on your device, gives you exact pixel dimensions, and produces a file you can print or submit online.</p>
      <h2>Privacy and data</h2>
      <p>The image stays in the browser. Nothing is uploaded. When you close the tab, the temporary file is cleared.</p>
    </>
  )

  return (
    <ToolShell
      title="Passport Photo Maker Online Free | PPM Creator"
      description="Crop a photo to a common passport size and download a JPEG. Files stay in your browser. Always check official form instructions."
      path="/passport-photo"
      crumb={[{ label: 'Image Tools', to: '/image-tools' }]}
      h1="Passport Photo: Crop to a Common Size"
      lead="Prepare a passport-style photo in your browser. Pick a preset size, adjust zoom, and download. Always confirm with the official form instructions."
      faqGroups={faqGroups}
      related={[
        { name: 'Image Resizer', href: '/image-resize', blurb: 'Change width and height in pixels' },
        { name: 'Image Cropper', href: '/image-crop', blurb: 'Crop to a square or custom size' },
        { name: 'Image Compressor', href: '/image-compress', blurb: 'Reduce file size at a chosen quality' },
        { name: 'Image Converter', href: '/image-convert', blurb: 'Change JPG, PNG and WebP formats' },
      ]}
      guides={[
        { title: 'Taking a good passport photo at home' },
        { title: 'Why form photo sizes differ' },
        { title: 'Printing a passport photo at home' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        <canvas ref={cvRef} style={{ display: 'none' }} />
        {!file && <UploadBox accept="image/*" maxMB={25} hint="JPG, PNG or WebP - up to 25 MB - nothing is uploaded" onFile={handleFile} />}
        {file && (
          <div>
            <label style={{ fontSize: 13, color: '#6b7280' }}>Size</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', margin: '4px 0 12px' }}>
              {PRESETS.map((p) => (
                <button key={p.name} type="button" onClick={() => { setPreset(p); setTimeout(render, 30) }} style={{ padding: '8px 14px', borderRadius: 10, border: '1px solid ' + (preset.name === p.name ? '#F97316' : '#e7e5e4'), background: preset.name === p.name ? '#FFF7ED' : '#fff', color: preset.name === p.name ? '#F97316' : '#1c1917', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>{p.name}</button>
              ))}
            </div>

            <label style={{ fontSize: 13, color: '#6b7280' }}>Zoom: {zoom.toFixed(1)}x</label>
            <input type="range" min={1} max={3} step={0.05} value={zoom} onChange={(e) => setZoom(Number(e.target.value))} onMouseUp={render} onTouchEnd={render} style={{ width: '100%', accentColor: '#F97316', margin: '6px 0 12px' }} />

            <label style={{ fontSize: 13, color: '#6b7280' }}>Vertical position: {offsetY}%</label>
            <input type="range" min={-50} max={50} step={1} value={offsetY} onChange={(e) => setOffsetY(Number(e.target.value))} onMouseUp={render} onTouchEnd={render} style={{ width: '100%', accentColor: '#F97316', margin: '6px 0 12px' }} />

            <div style={{ display: 'flex', justifyContent: 'center', margin: '14px 0' }}>
              <img src={previewUrl} alt="Original" style={{ maxHeight: 200, borderRadius: 10 }} />
            </div>

            <div style={{ fontSize: 13, color: '#6b7280' }}>
              Original: {origW} x {origH} px - {kb(origBytes)}<br />
              Output: {preset.w} x {preset.h} px {newBytes != null ? '- ' + kb(newBytes) : ''}
            </div>

            <div style={{ marginTop: 14 }}>
              <DownloadButton getBlob={async () => resultBlob} filename={filename} label="Download passport photo" />
              <button type="button" onClick={reset} style={{ border: '1px solid #e7e5e4', background: 'transparent', color: '#1c1917', padding: '12px 20px', borderRadius: 10, fontWeight: 500, cursor: 'pointer', marginLeft: 8 }}>Choose another</button>
            </div>
          </div>
        )}
        {error && <p role="alert" style={{ color: '#be123c', fontSize: 14, marginTop: 10 }}>{error}</p>}
      </section>
    </ToolShell>
  )
}