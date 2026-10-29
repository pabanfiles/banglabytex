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