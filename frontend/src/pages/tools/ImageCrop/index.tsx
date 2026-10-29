import { useRef, useState } from 'react'
import ToolShell from '@/components/ToolShell'
import UploadBox from '@/components/UploadBox'
import DownloadButton from '@/components/DownloadButton'

function kb(b: number): string {
  return b < 1048576 ? (b / 1024).toFixed(0) + ' KB' : (b / 1048576).toFixed(2) + ' MB'
}

type Rect = { x: number; y: number; w: number; h: number }
const RATIOS: { label: string; value: number | null }[] = [
  { label: 'Free', value: null },
  { label: '1:1', value: 1 },
  { label: '4:3', value: 4 / 3 },
  { label: '3:4', value: 3 / 4 },
  { label: '16:9', value: 16 / 9 },
  { label: '9:16', value: 9 / 16 },
]

export default function ImageCrop() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [origW, setOrigW] = useState(0)
  const [origH, setOrigH] = useState(0)
  const [origBytes, setOrigBytes] = useState(0)
  const [ratio, setRatio] = useState<number | null>(null)
  const [crop, setCrop] = useState<Rect>({ x: 0, y: 0, w: 100, h: 100 })
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [newBytes, setNewBytes] = useState<number | null>(null)

  const imgRef = useRef<HTMLImageElement | null>(null)
  const containerRef = useRef<HTMLDivElement | null>(null)
  const dragRef = useRef<{ startX: number; startY: number; base: Rect } | null>(null)
  const tokenRef = useRef(0)

  const handleFile = (f: File) => {
    setError('')
    if (!f.type.startsWith('image/')) { setError('Please choose a JPG, PNG or WebP image.'); return }
    if (f.size > 25 * 1048576) { setError('This file is over 25 MB.'); return }
    const im = new Image()
    im.onload = () => {
      imgRef.current = im
      setOrigW(im.width); setOrigH(im.height); setOrigBytes(f.size)
      setCrop({ x: 10, y: 10, w: 80, h: 80 })
      setFile(f); setResultBlob(null); setNewBytes(null)
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(URL.createObjectURL(f))
    }
    im.onerror = () => setError('This image could not be opened.')
    im.src = URL.createObjectURL(f)
  }

  const clampRect = (r: Rect): Rect => {
    let w = Math.max(5, Math.min(100, r.w))
    let h = Math.max(5, Math.min(100, r.h))
    let x = Math.max(0, Math.min(100 - w, r.x))
    let y = Math.max(0, Math.min(100 - h, r.y))
    return { x, y, w, h }
  }

  const applyRatio = (r: Rect, ratio: number | null): Rect => {
    if (ratio == null) return clampRect(r)
    // convert to pixel space, keep aspect
    const pxW = (r.w / 100) * origW
    const pxH = (r.h / 100) * origH
    let nw = pxW, nh = pxW / ratio
    if (nh > pxH) { nh = pxH; nw = pxH * ratio }
    const pctW = (nw / origW) * 100
    const pctH = (nh / origH) * 100
    return clampRect({ ...r, w: pctW, h: pctH })
  }

  const onRatioClick = (v: number | null) => {
    setRatio(v)
    setCrop(applyRatio(crop, v))
  }

  const onDown = (e: React.MouseEvent) => {
    const el = containerRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    dragRef.current = { startX: e.clientX - rect.left, startY: e.clientY - rect.top, base: { ...crop } }
    const onMove = (ev: MouseEvent) => {
      const dr = dragRef.current
      if (!dr) return
      const nx = ((ev.clientX - rect.left) / rect.width) * 100
      const ny = ((ev.clientY - rect.top) / rect.height) * 100
      const nx2 = (dr.startX / rect.width) * 100
      const ny2 = (dr.startY / rect.height) * 100
      const left = Math.min(nx2, nx)
      const top = Math.min(ny2, ny)
      const w = Math.abs(nx - nx2)
      const h = Math.abs(ny - ny2)
      const next = applyRatio({ x: left, y: top, w, h }, ratio)
      setCrop(next)
    }
    const onUp = () => {
      dragRef.current = null
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup', onUp)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
  }

  const doCrop = async (): Promise<Blob | null> => {
    const im = imgRef.current
    if (!im) return null
    const my = ++tokenRef.current
    const sx = (crop.x / 100) * origW
    const sy = (crop.y / 100) * origH
    const sw = (crop.w / 100) * origW
    const sh = (crop.h / 100) * origH
    const cv = document.createElement('canvas')
    cv.width = Math.max(1, Math.round(sw))
    cv.height = Math.max(1, Math.round(sh))
    const ctx = cv.getContext('2d')
    if (!ctx) return null
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, cv.width, cv.height)
    ctx.drawImage(im, sx, sy, sw, sh, 0, 0, cv.width, cv.height)
    return new Promise((resolve) => {
      cv.toBlob((b) => {
        if (my === tokenRef.current) {
          setResultBlob(b)
          setNewBytes(b ? b.size : null)
        }
        resolve(b)
      }, 'image/jpeg', 0.92)
    })
  }

  const reset = () => {
    setFile(null); setPreviewUrl(''); setOrigW(0); setOrigH(0); setOrigBytes(0)
    setResultBlob(null); setNewBytes(null); setError(''); setRatio(null); setCrop({ x: 10, y: 10, w: 80, h: 80 })
  }

  const filename = (() => {
    if (!file) return 'ppm-creator-cropped.jpg'
    const base = file.name.replace(/\.[^.]+$/, '')
    return (base || 'image') + '-cropped.jpg'
  })()

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this image cropper do?', a: 'It cuts the image to the area you draw on the preview. You can drag a free box or pick a fixed ratio like 1:1 or 16:9, then download a JPEG of just that area.' },
      { q: 'Is it free?', a: 'Yes. No account is needed, and there is no limit on how many images you crop. It runs in your browser, so it works on phones and desktop computers.' },
      { q: 'Do I need to install anything?', a: 'No. Open the page, choose a file, draw the crop box, and download. It works in any modern browser.' },
    ]},
    { heading: 'Cropping', items: [
      { q: 'How do I pick the crop area?', a: 'Click and drag on the preview image. The shaded selection shows the area that will be kept. The crop is applied to the full-resolution original, not just the visible preview.' },
      { q: 'What do the ratio buttons do?', a: 'They lock the shape of the selection. For a square profile photo, pick 1:1. For a landscape banner, pick 16:9. Free mode lets you draw any shape.' },
      { q: 'Can I crop a transparent image?', a: 'Yes, but the download is a JPEG, so transparent areas become white. If you need transparency, keep a PNG copy from a PNG-specific tool.' },
      { q: 'Does cropping reduce quality?', a: 'The pixels inside the crop stay the same. The output is re-encoded as JPEG, which applies a small loss. Using a small crop instead of a very large one keeps more detail visible.' },
    ]},
    { heading: 'Output', items: [
      { q: 'What format is the download?', a: 'The download is always a JPEG. This is the most widely accepted format for forms and websites.' },
      { q: 'What name does the download use?', a: 'The original name with cropped appended before the .jpg extension, for example photo-cropped.jpg. Your original file stays untouched.' },
      { q: 'Can I crop the same image twice?', a: 'Yes, but start from the original each time. Cropping a cropped copy stacks the JPEG loss and can soften the image.' },
    ]},
    { heading: 'Privacy and troubleshooting', items: [
      { q: 'Is my image uploaded?', a: 'No. The image is loaded and cropped in your browser. It is never sent to a server and never stored by this site.' },
      { q: 'Why does the crop box snap back when I pick a ratio?', a: 'The tool adjusts the box to fit the chosen ratio without leaving the image. This is expected, and you can still drag it afterwards.' },
      { q: 'What is the maximum file size?', a: 'Files up to 25 MB work. Very large photos may load more slowly on older devices, but the crop itself is fast.' },
      { q: 'Why does the download button wait a moment?', a: 'The tool prepares the cropped image at full resolution before the download starts. The 900 millisecond pause shows the result is ready.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to crop an image online</h2>
      <ol>
        <li>Tap the box and choose an image.</li>
        <li>Click and drag on the preview to draw the area you want to keep. Pick a preset ratio for a square or a banner.</li>
        <li>Press Download. The tool cuts the selected area from the full-resolution original and downloads a JPEG.</li>
      </ol>

      <h2>Why use this image cropper</h2>
      <h3>Full-resolution crop</h3>
      <p>The selection is a preview. The actual crop happens on the full-resolution image stored in the browser, so the downloaded file has the same sharpness as the area you selected in the original.</p>
      <h3>Ratio presets</h3>
      <p>For profile pictures, forms and banners, the required shape is usually fixed. The ratio buttons keep the crop in that shape without trial and error.</p>
      <h3>Processed in your browser</h3>
      <p>No upload, no round trip. The image never leaves your device, and the tool works offline after the page loads.</p>

      <h2>About cropping</h2>
      <p>Cropping removes the parts of an image you do not want, keeping the rest at full size. It is different from resizing, which changes the pixel dimensions of the whole image. A good workflow is to crop first, then resize to the final pixel size the destination needs.</p>
      <p>For a profile photo, the face is usually near the centre, so a 1:1 crop from the middle looks balanced. For a wide banner, pick 16:9 and drag the box so the subject stays inside the frame. For a form that requires a specific shape, choose the closest preset and drag to the subject.</p>

      <h2>Common mistakes</h2>
      <ul>
        <li>Cropping a very small area and expecting a sharp print. Use the full-resolution crop the tool produces.</li>
        <li>Cropping an already-cropped copy, which compounds JPEG loss.</li>
        <li>Forgetting that JPEG does not support transparency.</li>
        <li>Choosing a ratio that does not match the destination, then cropping again later.</li>
      </ul>

      <h2>Privacy and data</h2>
      <p>The image is read and cut in your browser. It is never uploaded, never stored, and the temporary file in memory is cleared when you close the tab. Keep a copy of the original if you want to crop again later.</p>
    </>
  )

  return (
    <ToolShell
      title="Image Cropper Online Free | PPM Creator"
      description="Crop JPG, PNG and WebP images online for free. Drag a box or pick a ratio, then download a full-resolution JPEG. Files stay in your browser."
      path="/image-crop"
      crumb={[{ label: 'Image Tools', to: '/image-tools' }]}
      h1="Image Cropper: Crop Photos Online"
      lead="Upload an image, drag a box or pick a ratio, and download just the selected area at full resolution."
      faqGroups={faqGroups}
      related={[
        { name: 'Image Compressor', href: '/image-compress', blurb: 'Reduce file size at a chosen quality' },
        { name: 'Image Resizer', href: '/image-resize', blurb: 'Change width and height in pixels' },
        { name: 'Image Converter', href: '/image-convert', blurb: 'Change JPG, PNG and WebP formats' },
        { name: 'Image Rotate', href: '/image-rotate', blurb: 'Rotate or flip a photo' },
        { name: 'Passport Photo', href: '/passport-photo', blurb: 'Make a portrait photo for a form' },
        { name: 'Favicon Generator', href: '/favicon-generator', blurb: 'Make favicons from one image' },
      ]}
      guides={[
        { title: 'Cropping photos for profile pictures' },
        { title: 'Crop, then resize: the right order' },
        { title: 'Common aspect ratios and when to use them' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        {!file && <UploadBox accept="image/*" maxMB={25} hint="JPG, PNG or WebP - up to 25 MB - nothing is uploaded" onFile={handleFile} />}

        {file && (
          <div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {RATIOS.map((r) => (
                <button key={r.label} type="button" onClick={() => onRatioClick(r.value)} style={{ padding: '8px 14px', borderRadius: 10, border: '1px solid ' + (ratio === r.value ? '#F97316' : '#e7e5e4'), background: ratio === r.value ? '#FFF7ED' : '#fff', color: ratio === r.value ? '#F97316' : '#1c1917', fontWeight: 500, cursor: 'pointer', fontSize: 13 }}>{r.label}</button>
              ))}
            </div>

            <div ref={containerRef} onMouseDown={onDown} style={{ position: 'relative', display: 'inline-block', maxWidth: '100%', cursor: 'crosshair', userSelect: 'none' }}>
              <img src={previewUrl} alt="Crop preview" style={{ display: 'block', maxWidth: '100%', maxHeight: 420, borderRadius: 10 }} draggable={false} />
              <div style={{ position: 'absolute', left: crop.x + '%', top: crop.y + '%', width: crop.w + '%', height: crop.h + '%', border: '2px solid #F97316', boxShadow: '0 0 0 9999px rgba(0,0,0,0.4)', pointerEvents: 'none' }} />
            </div>

            <div style={{ fontSize: 13, color: '#6b7280', marginTop: 10 }}>
              Original: {origW} x {origH} px - {kb(origBytes)}
            </div>
            <div style={{ fontSize: 13, color: '#6b7280' }}>
              Crop area: {Math.round((crop.w / 100) * origW)} x {Math.round((crop.h / 100) * origH)} px
              {newBytes != null ? ' - ' + kb(newBytes) : ''}
            </div>

            <div style={{ marginTop: 16 }}>
              <DownloadButton getBlob={async () => { const b = await doCrop(); return b }} filename={filename} label="Download cropped image" />
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