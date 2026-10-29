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

Write-Host "=== MemeGenerator ===" -ForegroundColor Cyan
BK "MemeGenerator\index.tsx"
WF "MemeGenerator\index.tsx" @"
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
"@

Write-Host "=== ImageColorPicker ===" -ForegroundColor Cyan
BK "ImageColorPicker\index.tsx"
WF "ImageColorPicker\index.tsx" @"
import { useRef, useState } from 'react'
import ToolShell from '@/components/ToolShell'
import UploadBox from '@/components/UploadBox'

function rgbToHex(r: number, g: number, b: number): string {
  return '#' + [r, g, b].map((v) => v.toString(16).padStart(2, '0')).join('').toUpperCase()
}
function rgbToHsl(r: number, g: number, b: number): string {
  r /= 255; g /= 255; b /= 255
  const max = Math.max(r, g, b), min = Math.min(r, g, b)
  let h = 0, s = 0
  const l = (max + min) / 2
  if (max !== min) {
    const d = max - min
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
    if (max === r) h = (g - b) / d + (g < b ? 6 : 0)
    else if (max === g) h = (b - r) / d + 2
    else h = (r - g) / d + 4
    h /= 6
  }
  return Math.round(h * 360) + 'deg, ' + Math.round(s * 100) + '%, ' + Math.round(l * 100) + '%'
}

export default function ImageColorPicker() {
  const [previewUrl, setPreviewUrl] = useState('')
  const [picked, setPicked] = useState<{ hex: string; rgb: string; hsl: string } | null>(null)
  const [copied, setCopied] = useState('')
  const [error, setError] = useState('')
  const imgRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const handleFile = (f: File) => {
    setError(''); setPicked(null)
    if (!f.type.startsWith('image/')) { setError('Choose an image.'); return }
    const im = new Image()
    im.onload = () => {
      imgRef.current = im
      const cv = canvasRef.current
      if (cv) { cv.width = im.width; cv.height = im.height; cv.getContext('2d')?.drawImage(im, 0, 0) }
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(URL.createObjectURL(f))
    }
    im.onerror = () => setError('Could not open this image.')
    im.src = URL.createObjectURL(f)
  }

  const onPick = (e: React.MouseEvent<HTMLImageElement>) => {
    const cv = canvasRef.current
    const im = imgRef.current
    if (!cv || !im) return
    const rect = e.currentTarget.getBoundingClientRect()
    const x = Math.floor(((e.clientX - rect.left) / rect.width) * im.width)
    const y = Math.floor(((e.clientY - rect.top) / rect.height) * im.height)
    const ctx = cv.getContext('2d')
    if (!ctx) return
    const p = ctx.getImageData(x, y, 1, 1).data
    setPicked({ hex: rgbToHex(p[0], p[1], p[2]), rgb: 'rgb(' + p[0] + ', ' + p[1] + ', ' + p[2] + ')', hsl: rgbToHsl(p[0], p[1], p[2]) })
  }

  const copy = async (text: string, label: string) => {
    try { await navigator.clipboard.writeText(text); setCopied(label); setTimeout(() => setCopied(''), 1500) } catch {}
  }

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this tool do?', a: 'It reads the exact pixel colour where you click on an image and shows the HEX, RGB and HSL values. You can copy any of the three formats.' },
      { q: 'Is it free?', a: 'Yes. No account, no upload.' },
      { q: 'Is my image uploaded?', a: 'No. The file is read in your browser with a canvas.' },
    ]},
    { heading: 'Colour formats', items: [
      { q: 'What is HEX?', a: 'A six-character code like #F97316 that starts with a hash. It is the format most CSS and design tools use.' },
      { q: 'What is RGB?', a: 'Three values from 0 to 255 for red, green and blue. It matches how screens mix colour.' },
      { q: 'What is HSL?', a: 'Hue in degrees, saturation and lightness in percent. It is easier for adjusting a colour by hand.' },
    ]},
    { heading: 'Precision', items: [
      { q: 'Why does the colour change slightly between clicks?', a: 'JPEG images have compression noise, so neighbouring pixels can differ. Click the same area again to see the range.' },
      { q: 'Can I pick a colour on a phone?', a: 'Yes. Tap the image and the tool reads that pixel. Small screens may make precise picks harder.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to pick a colour</h2>
      <ol>
        <li>Upload an image.</li>
        <li>Click or tap any pixel.</li>
        <li>Copy the HEX, RGB or HSL value.</li>
      </ol>
      <h2>Why use this tool</h2>
      <p>No upload, no app. Useful for matching a brand colour from a screenshot or a photo.</p>
      <h2>Privacy</h2>
      <p>The image stays in your browser.</p>
    </>
  )

  return (
    <ToolShell
      title="Image Colour Picker Online Free | PPM Creator"
      description="Click any pixel to get the HEX, RGB and HSL colour values. Runs in your browser."
      path="/image-color-picker"
      crumb={[{ label: 'Image Tools', to: '/image-tools' }]}
      h1="Image Colour Picker"
      lead="Upload an image, click any pixel, and copy the HEX, RGB or HSL value."
      faqGroups={faqGroups}
      related={[
        { name: 'Image Compressor', href: '/image-compress', blurb: 'Reduce file size' },
        { name: 'Image Cropper', href: '/image-crop', blurb: 'Crop to a size' },
        { name: 'Image Watermark', href: '/image-watermark', blurb: 'Add a text watermark' },
        { name: 'Meme Generator', href: '/meme-generator', blurb: 'Make a meme' },
      ]}
      guides={[
        { title: 'HEX vs RGB vs HSL' },
        { title: 'Picking a brand colour from a screenshot' },
        { title: 'Why JPEG colours vary slightly' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {!previewUrl && <UploadBox accept="image/*" maxMB={25} hint="Image - up to 25 MB" onFile={handleFile} />}
        {previewUrl && (
          <div>
            <img src={previewUrl} alt="Click to pick" onClick={onPick} style={{ maxWidth: '100%', borderRadius: 10, cursor: 'crosshair' }} />
            {picked && (
              <div style={{ marginTop: 14, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
                {[['HEX', picked.hex], ['RGB', picked.rgb], ['HSL', picked.hsl]].map(([label, val]) => (
                  <div key={label} style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 12 }}>
                    <small style={{ color: '#6b7280', fontSize: 12 }}>{label}</small>
                    <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4, fontFamily: 'monospace', wordBreak: 'break-all' }}>{val}</div>
                    <button type="button" onClick={() => copy(String(val), String(label))} style={{ marginTop: 6, fontSize: 12, padding: '4px 9px', border: '1px solid #e7e5e4', background: 'transparent', borderRadius: 6, cursor: 'pointer' }}>{copied === label ? 'Copied' : 'Copy'}</button>
                  </div>
                ))}
              </div>
            )}
            {picked && <div style={{ marginTop: 10, display: 'flex', alignItems: 'center', gap: 10 }}><div style={{ width: 44, height: 44, borderRadius: 10, background: picked.hex, border: '1px solid #e7e5e4' }} /><span style={{ fontSize: 13 }}>Preview</span></div>}
          </div>
        )}
        {error && <p style={{ color: '#be123c', fontSize: 14 }}>{error}</p>}
      </section>
    </ToolShell>
  )
}
"@

Write-Host "=== ImageWatermark ===" -ForegroundColor Cyan
BK "ImageWatermark\index.tsx"
WF "ImageWatermark\index.tsx" @"
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
"@

Write-Host "=== ImageToText (OCR via Tesseract.js) ===" -ForegroundColor Cyan
BK "ImageToText\index.tsx"
WF "ImageToText\index.tsx" @"
import { useEffect, useRef, useState } from 'react'
import ToolShell from '@/components/ToolShell'
import UploadBox from '@/components/UploadBox'

const TESS_CDN = 'https://cdn.jsdelivr.net/npm/tesseract.js@5.0.5/dist/tesseract.min.js'

export default function ImageToText() {
  const [ready, setReady] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState('')
  const [lang, setLang] = useState<'eng' | 'ben' | 'hin'>('eng')
  const [text, setText] = useState('')
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')
  const workerRef = useRef<any>(null)

  useEffect(() => {
    if ((window as any).Tesseract) { setReady(true); return }
    const s = document.createElement('script')
    s.src = TESS_CDN
    s.onload = () => setReady(true)
    s.onerror = () => setError('Could not load the OCR library. Check your connection.')
    document.body.appendChild(s)
  }, [])

  const handleFile = (f: File) => {
    setError(''); setText('')
    if (!f.type.startsWith('image/')) { setError('Choose an image.'); return }
    if (f.size > 10 * 1048576) { setError('Keep the image under 10 MB for faster OCR.'); return }
    setFile(f)
    if (preview) URL.revokeObjectURL(preview)
    setPreview(URL.createObjectURL(f))
  }

  const run = async () => {
    if (!ready || !file) return
    setBusy(true); setProgress(0); setText(''); setError('')
    try {
      if (workerRef.current) { try { await workerRef.current.terminate() } catch {} }
      const worker = await (window as any).Tesseract.createWorker(lang, 1, {
        logger: (m: any) => { if (m.status === 'recognizing text') setProgress(Math.round(m.progress * 100)) },
      })
      workerRef.current = worker
      const { data } = await worker.recognize(file)
      setText(data.text || '')
      await worker.terminate()
      workerRef.current = null
    } catch { setError('OCR failed. Try a clearer image or a different language.') }
    finally { setBusy(false) }
  }

  const copy = async () => { try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch {} }

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this tool do?', a: 'It reads printed text from an image using OCR (Optical Character Recognition) and shows it as selectable text. It works on photos of documents, screenshots and signs.' },
      { q: 'Is it free?', a: 'Yes. No account, no upload. The OCR engine runs in your browser and downloads once.' },
      { q: 'Which languages are supported?', a: 'English, Bengali and Hindi in this version. Each language downloads its own recognition data the first time, so the first run can be slow.' },
    ]},
    { heading: 'Quality', items: [
      { q: 'Why is the text not perfect?', a: 'OCR depends on image quality. Sharp, well-lit photos with straight text give the best results. Blur, skew, shadows and very small text reduce accuracy.' },
      { q: 'How can I improve the result?', a: 'Use a high-contrast image, straighten the page before uploading, and crop to just the text area. Crop and resize tools on this site can help.' },
      { q: 'Does it handle handwriting?', a: 'Poorly. The engine is trained on printed text. Handwriting usually returns partial or wrong characters.' },
    ]},
    { heading: 'Privacy', items: [
      { q: 'Is my image uploaded?', a: 'The image is processed in your browser. No server receives it. Only the language data is downloaded from a CDN.' },
      { q: 'What happens after I close the tab?', a: 'The text and the image are cleared. The OCR model stays in the browser cache for next time.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to extract text from an image</h2>
      <ol>
        <li>Upload a photo or screenshot with printed text.</li>
        <li>Pick the language.</li>
        <li>Press Extract text and wait for the progress bar.</li>
        <li>Copy the text.</li>
      </ol>
      <h2>Why use this tool</h2>
      <p>Useful for turning a screenshot into editable text, or for reading a printed page without retyping it. The OCR runs in your browser, so the image stays private.</p>
      <h2>Limits</h2>
      <p>Handwriting and very low quality images rarely work well. For important documents, verify the text against the source.</p>
      <h2>Privacy</h2>
      <p>The image stays in your browser. Only the language data is downloaded from a public CDN.</p>
    </>
  )

  return (
    <ToolShell
      title="Image to Text (OCR) Online Free | PPM Creator"
      description="Extract printed text from an image in English, Bengali or Hindi using OCR. Runs in your browser."
      path="/image-to-text"
      crumb={[{ label: 'Image Tools', to: '/image-tools' }]}
      h1="Image to Text (OCR)"
      lead="Extract printed text from a photo or screenshot. Runs in your browser."
      faqGroups={faqGroups}
      related={[
        { name: 'Image Compressor', href: '/image-compress', blurb: 'Reduce file size' },
        { name: 'Image Cropper', href: '/image-crop', blurb: 'Crop to the text area first' },
        { name: 'Image Resizer', href: '/image-resize', blurb: 'Change size' },
        { name: 'Image Converter', href: '/image-convert', blurb: 'Change format' },
      ]}
      guides={[
        { title: 'Getting better OCR results' },
        { title: 'OCR vs retyping: when to use each' },
        { title: 'Why OCR struggles with handwriting' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        {!file && <UploadBox accept="image/*" maxMB={10} hint="Image with printed text - up to 10 MB" onFile={handleFile} />}
        {file && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 12 }}><img src={preview} alt="Preview" style={{ maxHeight: 200, borderRadius: 10 }} /></div>
            <label style={{ fontSize: 13, color: '#6b7280' }}>Language</label>
            <div style={{ display: 'flex', gap: 8, margin: '4px 0 12px' }}>
              {(['eng', 'ben', 'hin'] as const).map((l) => (
                <button key={l} type="button" onClick={() => setLang(l)} style={{ padding: '8px 14px', borderRadius: 10, border: '1px solid ' + (lang === l ? '#F97316' : '#e7e5e4'), background: lang === l ? '#FFF7ED' : '#fff', color: lang === l ? '#F97316' : '#1c1917', fontSize: 13, cursor: 'pointer' }}>{l === 'eng' ? 'English' : l === 'ben' ? 'Bengali' : 'Hindi'}</button>
              ))}
            </div>
            <button type="button" onClick={run} disabled={busy || !ready} style={{ border: 0, padding: '12px 20px', borderRadius: 10, background: '#F97316', color: '#fff', fontWeight: 600, cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.7 : 1 }}>{busy ? 'Extracting... ' + progress + '%' : 'Extract text'}</button>
            {busy && <div style={{ marginTop: 8, height: 8, background: '#e7e5e4', borderRadius: 99 }}><div style={{ height: '100%', background: '#F97316', width: progress + '%', borderRadius: 99, transition: 'width .2s' }} /></div>}
            {text && (
              <>
                <textarea readOnly value={text} rows={10} style={{ width: '100%', marginTop: 14, padding: 12, border: '1px solid #e7e5e4', borderRadius: 10, fontSize: 13, fontFamily: 'inherit' }} />
                <button type="button" onClick={copy} style={{ marginTop: 8, border: '1px solid #e7e5e4', padding: '10px 16px', borderRadius: 10, background: 'transparent', cursor: 'pointer' }}>{copied ? 'Copied' : 'Copy text'}</button>
              </>
            )}
            <button type="button" onClick={() => { setFile(null); setPreview(''); setText('') }} style={{ marginTop: 12, marginLeft: 8, border: '1px solid #e7e5e4', padding: '10px 16px', borderRadius: 10, background: 'transparent', cursor: 'pointer' }}>Choose another</button>
            <p style={{ fontSize: 12, color: '#6b7280', marginTop: 12 }}>First run downloads the OCR model for the chosen language (~2 MB). Later runs are faster.</p>
          </div>
        )}
        {error && <p style={{ color: '#be123c', fontSize: 14, marginTop: 8 }}>{error}</p>}
      </section>
    </ToolShell>
  )
}
"@

Write-Host "=== SocialChecker ===" -ForegroundColor Cyan
BK "SocialChecker\index.tsx"
WF "SocialChecker\index.tsx" @"
import { useMemo, useState } from 'react'
import ToolShell from '@/components/ToolShell'

const PLATFORMS = [
  { name: 'Instagram', url: (u: string) => 'https://instagram.com/' + u },
  { name: 'Twitter / X', url: (u: string) => 'https://x.com/' + u },
  { name: 'Facebook', url: (u: string) => 'https://facebook.com/' + u },
  { name: 'GitHub', url: (u: string) => 'https://github.com/' + u },
  { name: 'TikTok', url: (u: string) => 'https://tiktok.com/@' + u },
  { name: 'YouTube', url: (u: string) => 'https://youtube.com/@' + u },
  { name: 'Reddit', url: (u: string) => 'https://reddit.com/user/' + u },
  { name: 'Pinterest', url: (u: string) => 'https://pinterest.com/' + u },
  { name: 'LinkedIn', url: (u: string) => 'https://linkedin.com/in/' + u },
  { name: 'Telegram', url: (u: string) => 'https://t.me/' + u },
  { name: 'Medium', url: (u: string) => 'https://medium.com/@' + u },
  { name: 'Twitch', url: (u: string) => 'https://twitch.tv/' + u },
]

export default function SocialChecker() {
  const [name, setName] = useState('')

  const clean = useMemo(() => name.trim().toLowerCase().replace(/[^a-z0-9._-]/g, ''), [name])
  const valid = clean.length >= 3 && clean.length <= 30

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this tool do?', a: 'It builds a profile link for your username on twelve common platforms. You click a platform to open its page in a new tab and see whether the username is taken.' },
      { q: 'Is it free?', a: 'Yes. No account, no upload.' },
      { q: 'Does it check availability automatically?', a: 'No. Platforms do not offer a public availability API, and automated checks risk rate limits and blocks. The tool gives you the exact link so you can check manually in one click.' },
    ]},
    { heading: 'Using the links', items: [
      { q: 'What does "taken" mean?', a: 'A 404 page usually means the username is free. A profile page with content means it is taken. A login or captcha wall means you cannot tell from here without signing in.' },
      { q: 'Which characters are allowed?', a: 'Most platforms allow letters, numbers, dots, underscores and hyphens. Spaces and symbols are removed automatically so the link stays valid.' },
      { q: 'Can I check for a brand name?', a: 'Yes. Enter the brand and check each platform. Short, pronounceable usernames are usually more available than long ones.' },
    ]},
    { heading: 'Privacy', items: [
      { q: 'Is the username stored?', a: 'No. It stays in your browser. Nothing is sent to a server.' },
      { q: 'Does clicking a platform link share data?', a: 'You open that platform directly. This site does not track which link you clicked.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to check a username</h2>
      <ol>
        <li>Type the username you want.</li>
        <li>Click a platform to open its profile link.</li>
        <li>If the page shows 404, the username is usually free.</li>
      </ol>
      <h2>Why use this tool</h2>
      <p>Building twelve URLs by hand is slow. This tool does it in one click and removes invalid characters automatically.</p>
      <h2>Privacy</h2>
      <p>The username stays in your browser.</p>
    </>
  )

  return (
    <ToolShell
      title="Social Username Checker Online Free | PPM Creator"
      description="Build profile links for a username on 12 platforms. Runs in your browser."
      path="/social-checker"
      crumb={[{ label: 'Utilities', to: '/calculators' }]}
      h1="Social & Domain Username Checker"
      lead="Type a username and open its profile link on any of twelve platforms."
      faqGroups={faqGroups}
      related={[
        { name: 'Password Generator', href: '/password-generator', blurb: 'Strong random password' },
        { name: 'QR Code Generator', href: '/qr-code-gen', blurb: 'Make a QR code' },
        { name: 'Text Case Converter', href: '/text-case-converter', blurb: 'Change text case' },
        { name: 'Word Counter', href: '/word-counter', blurb: 'Count words' },
      ]}
      guides={[
        { title: 'Choosing a brand username' },
        { title: 'Why availability checks are not automatic' },
        { title: 'Common username rules across platforms' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        <label style={{ fontSize: 13, color: '#6b7280' }}>Username</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. ppmcreator" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 4, marginBottom: 6, fontSize: 14 }} />
        <div style={{ fontSize: 12, color: valid ? '#15803D' : '#6b7280', marginBottom: 12 }}>Cleaned: {clean || '(empty)'} {valid ? '- valid' : '- enter 3 to 30 letters, numbers, dots, dashes'}</div>
        {valid && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
            {PLATFORMS.map((p) => (
              <a key={p.name} href={p.url(clean)} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: 12, border: '1px solid #e7e5e4', borderRadius: 10, background: '#fff', textDecoration: 'none', color: '#1c1917' }}>
                <b style={{ display: 'block', fontSize: 13 }}>{p.name}</b>
                <span style={{ fontSize: 11, color: '#6b7280', wordBreak: 'break-all' }}>{p.url(clean).replace('https://', '')}</span>
              </a>
            ))}
          </div>
        )}
        <p style={{ fontSize: 12, color: '#6b7280', marginTop: 12, background: '#FFF7ED', padding: 10, borderRadius: 8 }}>
          Open each link to see if the username is free. A 404 usually means available; a profile page means taken. The tool does not auto-check availability.
        </p>
      </section>
    </ToolShell>
  )
}
"@

Write-Host "=== All 5 done ===" -ForegroundColor Green