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