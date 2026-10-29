$ErrorActionPreference = "Stop"
$utf8 = New-Object System.Text.UTF8Encoding $false
$filePath = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend\src\pages\tools\ImageConvert\index.tsx"
$backup = "$filePath.bak"
if (Test-Path -LiteralPath $filePath) { Copy-Item -LiteralPath $filePath -Destination $backup -Force; Write-Host "  [~] backup created" -ForegroundColor Yellow }

$content = @"
import { useEffect, useRef, useState } from 'react'
import ToolShell from '@/components/ToolShell'
import UploadBox from '@/components/UploadBox'
import DownloadButton from '@/components/DownloadButton'

function kb(b: number): string {
  return b < 1048576 ? (b / 1024).toFixed(0) + ' KB' : (b / 1048576).toFixed(2) + ' MB'
}

type Fmt = 'jpeg' | 'png' | 'webp'
type R = { blob: Blob | null; bytes: number | null }

export default function ImageConvert() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [origFmt, setOrigFmt] = useState('')
  const [origBytes, setOrigBytes] = useState(0)
  const [target, setTarget] = useState<Fmt>('png')
  const [quality, setQuality] = useState(90)
  const [newBytes, setNewBytes] = useState<number | null>(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const tokenRef = useRef(0)
  const timerRef = useRef<number | null>(null)

  const render = async () => {
    const my = ++tokenRef.current
    const im = imgRef.current
    const cv = canvasRef.current
    if (!im || !cv) return
    cv.width = im.width
    cv.height = im.height
    const ctx = cv.getContext('2d')
    if (!ctx) return
    if (target === 'jpeg') { ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, cv.width, cv.height) }
    ctx.drawImage(im, 0, 0)

    setBusy(true)
    const mime = 'image/' + target
    const q = target === 'png' ? undefined : quality / 100

    await new Promise<void>((resolve) => {
      cv.toBlob((b) => {
        if (my === tokenRef.current) {
          if (b) { setNewBytes(b.size); setResultBlob(b) }
          else { setNewBytes(null); setResultBlob(null) }
          setBusy(false)
        }
        resolve()
      }, mime, q)
    })
  }

  useEffect(() => {
    if (!file) return
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => { render() }, 200)
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, quality, file])

  const handleFile = (f: File) => {
    setError('')
    if (!f.type.startsWith('image/')) { setError('Please choose a JPG, PNG or WebP image.'); return }
    if (f.size > 25 * 1048576) { setError('This file is over 25 MB. Please choose a smaller image.'); return }
    const im = new Image()
    im.onload = () => {
      imgRef.current = im
      setOrigFmt((f.type.split('/')[1] || 'image').toUpperCase().replace('JPEG', 'JPG'))
      setOrigBytes(f.size)
      setNewBytes(null)
      setResultBlob(null)
      setFile(f)
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(URL.createObjectURL(f))
    }
    im.onerror = () => setError('This image could not be opened. Try a JPG, PNG or WebP file.')
    im.src = URL.createObjectURL(f)
  }

  const reset = () => {
    setFile(null); setNewBytes(null); setResultBlob(null); setOrigBytes(0); setOrigFmt(''); setError('')
    setQuality(90); setTarget('png')
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl('')
  }

  const ext = target === 'jpeg' ? 'jpg' : target
  const filename = (() => {
    if (!file) return 'ppm-creator-converted.' + ext
    const base = file.name.replace(/\.[^.]+$/, '')
    return (base || 'image') + '.' + ext
  })()

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this image converter do?', a: 'It changes an image from one format to another. You upload a JPG, PNG or WebP file, choose the output format, and download a copy in that format. The new file size updates live.' },
      { q: 'Is it free?', a: 'Yes. The tool is free and does not need an account. There is no daily limit, and no file is uploaded, so you can use it as often as you like.' },
      { q: 'Do I need to install anything?', a: 'No. It runs in any modern browser on a phone or computer. Open the page, choose a file, pick the format, and download.' },
    ]},
    { heading: 'Formats', items: [
      { q: 'Which formats can I convert to?', a: 'You can convert to JPG, PNG or WebP. JPG is the best choice for photos, PNG works for images that need sharp edges, and WebP gives smaller files on modern browsers.' },
      { q: 'Will transparency survive the conversion?', a: 'PNG and WebP support transparency and keep it. JPG does not, so transparent areas become white. Convert a transparent image to PNG or WebP if you need the transparency.' },
      { q: 'What is the difference between JPG and JPEG?', a: 'They are the same format. JPG is the common file extension while JPEG is the formal name. The tool uses the .jpg extension for downloads.' },
      { q: 'Which format should I pick for a photo?', a: 'For photos with many colours, JPG or WebP usually gives the smallest file at good quality. Pick PNG only if you need sharp text, line art, or transparency.' },
    ]},
    { heading: 'Quality and size', items: [
      { q: 'What does the quality slider do?', a: 'It changes how much compression is applied to JPG and WebP output. A higher value keeps more detail and makes a larger file. PNG ignores the slider because PNG is a lossless format.' },
      { q: 'Why is the PNG file sometimes larger than the JPG?', a: 'PNG is lossless, so it stores every pixel without approximation. Photos contain a lot of detail, so the PNG file ends up larger than a JPG of the same image. Line art and screenshots often stay small.' },
      { q: 'Why is the WebP file smaller than the PNG?', a: 'WebP uses a newer compression method that often produces smaller files at similar quality. On modern browsers the WebP result is a good default when you do not need a specific format.' },
    ]},
    { heading: 'Privacy and troubleshooting', items: [
      { q: 'Is my image uploaded?', a: 'No. Conversion happens in your browser. The file is not sent to any server and is not stored by this site.' },
      { q: 'Why does the new size update a moment after I change the format?', a: 'The tool waits briefly after each change, then rebuilds the image in the new format. This avoids re-encoding on every click and keeps the result stable.' },
      { q: 'What happens to the file name?', a: 'The download keeps your original name with the new extension. For example, photo.png becomes photo.jpg when you convert to JPG. If you upload a file without a name, the tool uses a generic name.' },
      { q: 'Can I use the converted file for a form?', a: 'Yes, but each form sets its own rules for size, format and dimensions. Check the official instructions for that form. This tool does not enforce any government rule.' },
      { q: 'Why is the download button still disabled?', a: 'It stays disabled while the tool is preparing the latest version in the new format. Wait a moment and the button becomes active.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to convert an image online</h2>
      <ol>
        <li>Tap the box and choose a JPG, PNG or WebP file.</li>
        <li>Pick the output format. JPG, PNG and WebP are available.</li>
        <li>If you pick JPG or WebP, move the quality slider to balance size and detail.</li>
        <li>Press Download. The tool builds the new file and downloads it with the correct extension.</li>
      </ol>

      <h2>Why use this image converter</h2>
      <h3>Choose your format</h3>
      <p>Some sites accept only JPG. Some need PNG with transparency. Some benefit from WebP for smaller pages. One tool covers all three, so you do not need to hunt for a different app for each case.</p>
      <h3>Live size preview</h3>
      <p>The new file size updates as you change the format or the quality slider, so you can stop at a size that fits without trying dozens of downloads.</p>
      <h3>Processed in your browser</h3>
      <p>Nothing is uploaded. The image is drawn on a canvas in your browser and saved locally. This keeps the file private and works on slow connections too.</p>

      <h2>About image formats</h2>
      <p>JPG uses lossy compression and works well for photos. PNG is lossless and is the better choice for sharp graphics, screenshots and transparency. WebP is a newer format that often gives a smaller file than JPG or PNG at similar quality and is supported by all current browsers.</p>
      <p>Each format has a place. Use JPG for a photo you plan to share on social media. Use PNG for a logo or a screenshot with text. Use WebP when you want the smallest file on a modern website. There is no single best format; the choice depends on the content.</p>

      <h2>Common mistakes</h2>
      <ul>
        <li>Converting a transparent PNG to JPG and expecting the transparency to stay.</li>
        <li>Using a very low quality value on a screenshot and then wondering why the text is blurry.</li>
        <li>Converting the same file repeatedly instead of keeping a lossless original.</li>
        <li>Assuming a PNG is always bigger; screenshots and line art can be small PNGs.</li>
      </ul>

      <h2>Which format to choose</h2>
      <p>For a photo from a phone, JPG or WebP keeps the file small and the colours natural. For a screenshot with text, PNG keeps the edges sharp and the file small at the same time. For a logo with a transparent background, PNG or WebP preserves the transparency. For a page banner, WebP often gives the best balance between quality and size on modern browsers.</p>
      <p>If a form asks for JPG specifically, convert to JPG even if WebP would be smaller. The form sets the rules, and the file must match them.</p>

      <h2>Privacy and data</h2>
      <p>The file never leaves your device. The page does not upload it, does not store its name, and does not keep a copy. When you close the tab, the temporary file in memory is cleared by the browser.</p>
    </>
  )

  return (
    <ToolShell
      title="Image Converter (JPG, PNG, WebP) Free | PPM Creator"
      description="Convert images between JPG, PNG and WebP online for free. See the new file size live and download. Files stay in your browser."
      path="/image-convert"
      crumb={[{ label: 'Image Tools', to: '/image-tools' }]}
      h1="Image Converter: JPG, PNG and WebP"
      lead="Upload an image, choose the output format, and download the converted file. The new size updates as you pick a format or move the quality slider."
      faqGroups={faqGroups}
      related={[
        { name: 'Image Compressor', href: '/image-compress', blurb: 'Reduce file size at a chosen quality' },
        { name: 'Image Resizer', href: '/image-resize', blurb: 'Change width and height in pixels' },
        { name: 'Image Cropper', href: '/image-crop', blurb: 'Crop to a square or custom size' },
        { name: 'Image to Base64', href: '/image-to-base64', blurb: 'Turn an image into base64 text' },
        { name: 'Image to PDF', href: '/image-to-pdf', blurb: 'Turn photos into one PDF' },
        { name: 'Favicon Generator', href: '/favicon-generator', blurb: 'Make favicons from one image' },
      ]}
      guides={[
        { title: 'JPG, PNG or WebP: which format should you use?' },
        { title: 'When to keep transparency in an image' },
        { title: 'Choosing a quality level for JPG and WebP' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {!file && <UploadBox accept="image/*" maxMB={25} hint="JPG, PNG or WebP - up to 25 MB - nothing is uploaded" onFile={handleFile} />}

        {file && (
          <div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
              <img src={previewUrl} alt="Preview of the image you selected" style={{ width: 88, height: 88, objectFit: 'cover', borderRadius: 10, border: '1px solid #e7e5e4', flex: 'none' }} />
              <div>
                <b style={{ fontWeight: 600 }}>{origFmt} - {kb(origBytes)}</b>
                <div style={{ fontSize: 13, color: '#6b7280', marginTop: 6 }}>{file.name}</div>
              </div>
            </div>

            <label style={{ fontSize: 13, color: '#6b7280' }}>Convert to</label>
            <div style={{ display: 'flex', gap: 8, margin: '4px 0 14px', flexWrap: 'wrap' }}>
              {(['jpeg', 'png', 'webp'] as Fmt[]).map((f) => (
                <button key={f} type="button" onClick={() => setTarget(f)} style={{ padding: '10px 18px', borderRadius: 10, border: '1px solid ' + (target === f ? '#F97316' : '#e7e5e4'), background: target === f ? '#FFF7ED' : '#fff', color: target === f ? '#F97316' : '#1c1917', fontWeight: 500, cursor: 'pointer' }}>
                  {f === 'jpeg' ? 'JPG' : f.toUpperCase()}
                </button>
              ))}
            </div>

            {target !== 'png' && (
              <div style={{ marginBottom: 14 }}>
                <label style={{ fontSize: 13, color: '#6b7280' }}>Quality: {quality}%</label>
                <input type="range" min={10} max={100} step={1} value={quality} onChange={(e) => setQuality(Number(e.target.value))} style={{ width: '100%', accentColor: '#F97316', margin: '8px 0 2px' }} />
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '6px 0 16px' }}>
              <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 12 }}>
                <small style={{ display: 'block', color: '#6b7280', fontSize: 12 }}>Original ({origFmt})</small>
                <b style={{ fontSize: 20, fontWeight: 600 }}>{kb(origBytes)}</b>
              </div>
              <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 12 }}>
                <small style={{ display: 'block', color: '#6b7280', fontSize: 12 }}>New ({(target === 'jpeg' ? 'JPG' : target.toUpperCase())})</small>
                <b style={{ fontSize: 20, fontWeight: 600 }}>{newBytes != null ? kb(newBytes) : (busy ? '...' : '-')}</b>
              </div>
            </div>

            <div>
              <DownloadButton getBlob={async () => resultBlob} filename={filename} label="Download converted image" />
              <button type="button" onClick={reset} style={{ border: '1px solid #e7e5e4', background: 'transparent', color: '#1c1917', padding: '12px 20px', borderRadius: 10, fontWeight: 500, cursor: 'pointer', marginLeft: 8 }}>Choose another</button>
            </div>
          </div>
        )}

        {error && <p role="alert" style={{ color: '#be123c', fontSize: 14, marginTop: 10 }}>{error}</p>}
      </section>

      <p style={{ fontSize: 13, color: '#6b7280', background: '#fff7ed', borderRadius: 10, padding: '10px 12px' }}>
        Your image is processed inside your browser. It is never uploaded or stored.
      </p>
    </ToolShell>
  )
}
"@
[System.IO.File]::WriteAllText($filePath, $content, $utf8)
Write-Host "  [+] ImageConvert/index.tsx rewritten" -ForegroundColor Green