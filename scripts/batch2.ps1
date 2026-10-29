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

Write-Host "=== Batch 2 ===" -ForegroundColor Cyan

# ============ QR CODE GENERATOR ============
BK "QrCodeGen\index.tsx"
WF "QrCodeGen\index.tsx" @"
import { useEffect, useRef, useState } from 'react'
import ToolShell from '@/components/ToolShell'
import DownloadButton from '@/components/DownloadButton'

function drawQR(text: string, size: number, dark: string, light: string): HTMLCanvasElement | null {
  if (!text) return null
  // Minimal QR: use qrcode via window? Not available. Use a simple fallback: draw text on canvas.
  // Real QR needs a library. Fall back to using a free public API would be network. Use built-in google chart API is not reliable.
  return null
}

const LIB_URL = 'https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js'

export default function QrCodeGen() {
  const [text, setText] = useState('https://ppmcreator.pages.dev')
  const [size, setSize] = useState(300)
  const [color, setColor] = useState('#1c1917')
  const [bg, setBg] = useState('#ffffff')
  const [ready, setReady] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    if ((window as any).QRCode) { setReady(true); return }
    const s = document.createElement('script')
    s.src = LIB_URL
    s.onload = () => setReady(true)
    s.onerror = () => setError('Could not load the QR library. Check your connection and reload.')
    document.body.appendChild(s)
  }, [])

  useEffect(() => {
    if (!ready) return
    const cv = canvasRef.current
    if (!cv) return
    const QR = (window as any).QRCode
    if (!QR) return
    cv.width = size; cv.height = size
    const ctx = cv.getContext('2d')
    if (ctx) { ctx.fillStyle = bg; ctx.fillRect(0, 0, size, size) }
    QR.toCanvas(cv, text || ' ', { width: size, margin: 2, color: { dark: color, light: bg } }, (err: any) => {
      if (err) setError('Could not build the QR code for that text.')
    })
  }, [text, size, color, bg, ready])

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this QR code generator do?', a: 'It turns a link or a short line of text into a scannable QR code. You can change the size and the colours, then download the image as a PNG file.' },
      { q: 'Is it free?', a: 'Yes. No account is needed and there is no daily limit. The tool works in the browser.' },
      { q: 'Which devices can scan the result?', a: 'Almost every modern phone camera can scan a QR code. Older devices may need a dedicated scanner app.' },
    ]},
    { heading: 'Using the code', items: [
      { q: 'Can I use it on a poster or a flyer?', a: 'Yes. Larger codes are easier to scan from a distance. Pick a size that matches the print area and test the printed code with a phone before you order many copies.' },
      { q: 'Why does the scan fail sometimes?', a: 'Very low contrast between the dark and light colours can confuse scanners. Keep the code dark and the background light. Very small printed codes also fail, so keep at least 2 cm of width.' },
      { q: 'Can I add a logo in the middle?', a: 'You can design that in an image editor after downloading, but keep the logo small so the scanner can still find the code. This tool does not add logos itself.' },
    ]},
    { heading: 'Privacy and output', items: [
      { q: 'Is the text I type stored?', a: 'No. The text stays in your browser. It is not sent to a server and is not saved after you close the page.' },
      { q: 'What format is the download?', a: 'PNG. It is lossless, keeps the code sharp, and is accepted everywhere images are accepted.' },
      { q: 'Can I use the code for a tracking link?', a: 'Yes. Shorten the URL with any shortener first, then generate the code from the short link. The code itself is just a picture of the link.' },
    ]},
    { heading: 'Troubleshooting', items: [
      { q: 'Why is the QR area blank?', a: 'The library takes a moment to load the first time. If it still shows blank after a few seconds, check your internet connection and reload the page.' },
      { q: 'Why did my text break the code?', a: 'Very long text makes the pattern dense. Shorten the text or use a URL shortener so the code stays easy to scan.' },
      { q: 'What size should I pick?', a: 'For a phone screen, 300 pixels is enough. For a print, calculate at least 2 cm of width and pick a larger pixel size so the print stays sharp.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to make a QR code</h2>
      <ol>
        <li>Type or paste a link or a short line of text.</li>
        <li>Pick a size and, if you like, change the colours.</li>
        <li>Press Download to save the QR code as a PNG.</li>
      </ol>
      <h2>Why use this QR code generator</h2>
      <h3>Simple controls</h3>
      <p>One input, one size slider and two colours. Nothing to learn, and no signup step.</p>
      <h3>Live preview</h3>
      <p>Every change updates the code immediately, so you can check it looks right before downloading.</p>
      <h3>Processed in your browser</h3>
      <p>The text and the code stay on your device. Nothing is uploaded.</p>
      <h2>About QR codes</h2>
      <p>A QR code is a square image that stores text, usually a link. Phones read it with their camera. The pattern must have enough contrast to scan, and it needs to be large enough that the camera can lock on. A code with a dark foreground and a light background scans best.</p>
      <p>You can use a QR code on a poster, a business card, a menu, or a form. Keep a copy of the code next to the link it points to, so you can confirm later that the code still resolves to the right page.</p>
      <h2>Privacy and data</h2>
      <p>The text never leaves your device. The code is built in your browser and only the downloaded PNG is saved, by you.</p>
    </>
  )

  return (
    <ToolShell
      title="QR Code Generator Free | PPM Creator"
      description="Create a QR code for a link or text online for free. Change size and colours, preview live, download as PNG. Everything runs in your browser."
      path="/qr-code-gen"
      crumb={[{ label: 'Utilities', to: '/image-tools' }]}
      h1="QR Code Generator: Make a Code from a Link"
      lead="Type or paste a link, adjust the size and colours, then download the QR code as a PNG."
      faqGroups={faqGroups}
      related={[
        { name: 'Image Compressor', href: '/image-compress', blurb: 'Reduce file size at a chosen quality' },
        { name: 'Favicon Generator', href: '/favicon-generator', blurb: 'Make favicons from one image' },
        { name: 'Image to Base64', href: '/image-to-base64', blurb: 'Turn an image into base64 text' },
        { name: 'Password Generator', href: '/password-generator', blurb: 'Generate a strong random password' },
      ]}
      guides={[
        { title: 'Using QR codes on printed material' },
        { title: 'Choosing the right size for a printed QR code' },
        { title: 'QR code colour contrast tips' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        <label style={{ fontSize: 13, color: '#6b7280' }}>Text or URL</label>
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="https://ppmcreator.pages.dev" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 4, marginBottom: 12, fontSize: 14 }} />

        <label style={{ fontSize: 13, color: '#6b7280' }}>Size: {size} px</label>
        <input type="range" min={150} max={800} step={10} value={size} onChange={(e) => setSize(Number(e.target.value))} style={{ width: '100%', accentColor: '#F97316', margin: '6px 0 12px' }} />

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 13, color: '#6b7280' }}>Foreground</label>
            <input type="color" value={color} onChange={(e) => setColor(e.target.value)} style={{ width: '100%', height: 40, border: '1px solid #e7e5e4', borderRadius: 8 }} />
          </div>
          <div>
            <label style={{ fontSize: 13, color: '#6b7280' }}>Background</label>
            <input type="color" value={bg} onChange={(e) => setBg(e.target.value)} style={{ width: '100%', height: 40, border: '1px solid #e7e5e4', borderRadius: 8 }} />
          </div>
        </div>

        <div style={{ display: 'flex', justifyContent: 'center', padding: 14, background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12 }}>
          <canvas ref={canvasRef} style={{ maxWidth: '100%' }} />
        </div>

        <div style={{ marginTop: 14 }}>
          <DownloadButton getBlob={async () => {
            const cv = canvasRef.current
            if (!cv) return null
            return new Promise<Blob | null>((res) => cv.toBlob((b) => res(b), 'image/png'))
          }} filename="qr-code.png" label="Download QR code" />
        </div>

        {error && <p role="alert" style={{ color: '#be123c', fontSize: 14, marginTop: 10 }}>{error}</p>}
      </section>

      <p style={{ fontSize: 13, color: '#6b7280', background: '#fff7ed', borderRadius: 10, padding: '10px 12px' }}>
        The QR library loads from a public CDN the first time. Your text is not sent to any server.
      </p>
    </ToolShell>
  )
}
"@
Write-Host "  [+] QrCodeGen done" -ForegroundColor Green

# ============ PASSPORT PHOTO ============
BK "PassportPhoto\index.tsx"
WF "PassportPhoto\index.tsx" @"
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
"@
Write-Host "  [+] PassportPhoto done" -ForegroundColor Green

Write-Host "=== Batch 2 done ===" -ForegroundColor Green