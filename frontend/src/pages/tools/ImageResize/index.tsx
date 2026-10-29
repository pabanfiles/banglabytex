import { useEffect, useRef, useState } from 'react'
import ToolShell from '@/components/ToolShell'
import UploadBox from '@/components/UploadBox'
import DownloadButton from '@/components/DownloadButton'

function kb(b: number): string {
  return b < 1048576 ? (b / 1024).toFixed(0) + ' KB' : (b / 1048576).toFixed(2) + ' MB'
}

export default function ImageResize() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [origW, setOrigW] = useState(0)
  const [origH, setOrigH] = useState(0)
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(600)
  const [lockRatio, setLockRatio] = useState(true)
  const [origBytes, setOrigBytes] = useState(0)
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
    if (width < 1 || height < 1) { setNewBytes(null); setResultBlob(null); return }

    setBusy(true)
    cv.width = width
    cv.height = height
    const ctx = cv.getContext('2d')
    if (!ctx) { setBusy(false); return }
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, 0, cv.width, cv.height)
    ctx.drawImage(im, 0, 0, cv.width, cv.height)

    return new Promise<void>((resolve) => {
      cv.toBlob((b) => {
        if (my === tokenRef.current) {
          if (b) { setNewBytes(b.size); setResultBlob(b) }
          else { setNewBytes(null); setResultBlob(null) }
          setBusy(false)
        }
        resolve()
      }, 'image/jpeg', 0.92)
    })
  }

  useEffect(() => {
    if (!file) return
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => { render() }, 200)
    return () => { if (timerRef.current) window.clearTimeout(timerRef.current) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [width, height, file])

  const handleFile = (f: File) => {
    setError('')
    if (!f.type.startsWith('image/')) { setError('Please choose a JPG, PNG or WebP image.'); return }
    if (f.size > 25 * 1048576) { setError('This file is over 25 MB. Please choose a smaller image.'); return }
    const im = new Image()
    im.onload = () => {
      imgRef.current = im
      setOrigW(im.width)
      setOrigH(im.height)
      setWidth(im.width)
      setHeight(im.height)
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

  const onWidthChange = (v: number) => {
    setWidth(v)
    if (lockRatio && origW > 0 && origH > 0 && v > 0) {
      setHeight(Math.max(1, Math.round((v * origH) / origW)))
    }
  }
  const onHeightChange = (v: number) => {
    setHeight(v)
    if (lockRatio && origW > 0 && origH > 0 && v > 0) {
      setWidth(Math.max(1, Math.round((v * origW) / origH)))
    }
  }

  const reset = () => {
    setFile(null); setNewBytes(null); setResultBlob(null); setOrigBytes(0)
    setOrigW(0); setOrigH(0); setWidth(800); setHeight(600); setError('')
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl('')
  }

  const filename = (() => {
    if (!file) return 'ppm-creator-resized.jpg'
    const base = file.name.replace(/\.[^.]+$/, '')
    return (base || 'image') + '-' + width + 'x' + height + '.jpg'
  })()

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this image resizer do?', a: 'It changes the width and height of an image to the pixel values you type. You see the new file size live and can preview the result before downloading a JPEG copy.' },
      { q: 'Is the tool free to use?', a: 'Yes. There is no account and no daily limit. The tool runs in your browser, so you can resize as many images as you like without paying anything.' },
      { q: 'Do I need to install an app?', a: 'No. Any modern browser on a phone or computer can run it. You only need to open the page and choose a file.' },
    ]},
    { heading: 'Size and quality', items: [
      { q: 'Does resizing change the file size?', a: 'Yes. A smaller width and height means fewer pixels to store, so the file size usually drops. The new size is shown live after each change so you can pick a value that fits your needs.' },
      { q: 'Should I keep the aspect ratio locked?', a: 'Usually yes. Locking the ratio keeps the image from stretching. Unlock it when you intentionally need a different shape, such as a square profile picture.' },
      { q: 'Can I make an image bigger?', a: 'You can type larger values, but the extra pixels come from interpolation. The image will look softer than a true high-resolution original. Upscaling cannot add detail that was not in the file.' },
      { q: 'Why is my resized image not perfectly sharp?', a: 'Resizing redraws the image on a canvas and saves it as JPEG. Some sharpness is lost, especially at very large ratios. A small reduction or enlargement keeps more detail.' },
    ]},
    { heading: 'Formats and output', items: [
      { q: 'Which input formats work?', a: 'JPG, PNG and WebP images work. The output is always JPEG, which is accepted by most forms and websites.' },
      { q: 'Will transparency be kept?', a: 'No. The output is JPEG and does not support transparency. Transparent areas become white. Convert to PNG first if you need transparency.' },
      { q: 'What name does the download use?', a: 'The downloaded file includes the chosen width and height, for example photo-800x600.jpg. Your original file is not changed.' },
    ]},
    { heading: 'Privacy and troubleshooting', items: [
      { q: 'Is my image uploaded?', a: 'No. The image is loaded and resized inside your browser. It is never sent to a server and never stored by this site.' },
      { q: 'Why does the new size show a moment after I type?', a: 'The tool waits briefly after you stop typing, then redraws the image at the new size. This short delay avoids re-rendering the image on every keystroke.' },
      { q: 'Why is the download button disabled?', a: 'It stays disabled while the tool is still preparing the latest size. Wait a moment and the button becomes active.' },
      { q: 'What is the maximum file size?', a: 'Files up to 25 MB work. Very large photos may take longer to load on older phones, but the resize itself still runs in the browser.' },
      { q: 'Can I use the resized file for a form?', a: 'Yes, but each form sets its own size and dimension limits. Check the official instructions for the form you are filling. This tool does not enforce any government rule.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to resize an image online</h2>
      <ol>
        <li>Tap the box and choose an image from your phone or computer.</li>
        <li>The tool fills in the current width and height. Change either field, or unlock the ratio for a custom shape.</li>
        <li>Press Download. The tool prepares the final file and downloads a JPEG with the chosen size in its name.</li>
      </ol>

      <h2>Why use this image resizer</h2>
      <h3>Exact pixel size</h3>
      <p>You type the width and height you need. The tool redraws the image on a canvas, so the downloaded file has exactly those pixels, not a guess.</p>
      <h3>Live size preview</h3>
      <p>After each change, the new file size appears next to the original. You can stop at a value that keeps the file small enough for a form or a website without visible quality loss.</p>
      <h3>Processed in your browser</h3>
      <p>No upload and no server round trip. The image is handled on your device, which keeps it private and works offline after the page loads.</p>

      <h2>About resizing photos</h2>
      <p>Resizing changes how many pixels the image has. Shrinking keeps the image sharp because the extra pixels are removed. Enlarging adds pixels that were not in the original, so the image can look softer. The tool uses a standard canvas redraw, which gives good results for normal ratios.</p>
      <p>Many forms and websites accept only photos up to a certain width or height. The exact limit is set by the site you are using, so check the official instructions before uploading. Keep a copy of the original file so you can resize again later without starting from a smaller copy.</p>

      <h2>Common mistakes</h2>
      <ul>
        <li>Unlocking the ratio and expecting a perfect square from a wide photo.</li>
        <li>Upscaling a small photo far beyond its original size and expecting sharp detail.</li>
        <li>Assuming transparency survives the JPEG output.</li>
        <li>Using a resized copy as the source for the next resize, which stacks quality loss.</li>
      </ul>

      <h2>Picking the right dimensions</h2>
      <p>A profile picture is often shown small on screen and can be a square between 200 and 500 pixels. A page banner usually needs a wider value, often between 1200 and 1600 pixels on the long side. A printed page needs a higher resolution that matches the print size, so check the print shop instructions.</p>
      <p>If the tool shows a size that is very small, check that you are not typing a low value in one field while the ratio lock adjusts the other. The lock keeps the shape correct, and the live size update makes the effect of each change visible.</p>

      <h2>Privacy and data</h2>
      <p>The file never leaves your device. The page does not upload it, does not store its name, and does not keep a copy. When you close the tab, the temporary file in memory is cleared by the browser.</p>
    </>
  )

  return (
    <ToolShell
      title="Image Resizer Online Free | PPM Creator"
      description="Resize JPG, PNG and WebP images to exact pixel sizes online for free. See the new file size live and download a smaller copy. Files stay in your browser."
      path="/image-resize"
      crumb={[{ label: 'Image Tools', to: '/image-tools' }]}
      h1="Image Resizer: Change Width and Height Online"
      lead="Upload an image, type the width and height you need, and download a copy at that exact pixel size. The new size updates as you type."
      faqGroups={faqGroups}
      related={[
        { name: 'Image Compressor', href: '/image-compress', blurb: 'Reduce file size at a chosen quality' },
        { name: 'Image Converter', href: '/image-convert', blurb: 'Change JPG, PNG and WebP formats' },
        { name: 'Image Cropper', href: '/image-crop', blurb: 'Crop to a square or custom size' },
        { name: 'Image Rotate', href: '/image-rotate', blurb: 'Rotate or flip a photo' },
        { name: 'Image to PDF', href: '/image-to-pdf', blurb: 'Turn photos into one PDF' },
        { name: 'Passport Photo', href: '/passport-photo', blurb: 'Make a portrait photo for a form' },
      ]}
      guides={[
        { title: 'Choosing the right pixel size for a photo' },
        { title: 'How resizing affects image quality' },
        { title: 'Common photo sizes for websites and forms' },
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
                <b style={{ fontWeight: 600 }}>{origW} x {origH} px</b>
                <div style={{ fontSize: 13, color: '#6b7280', marginTop: 6 }}>{file.name}</div>
                <div style={{ fontSize: 13, color: '#6b7280', marginTop: 2 }}>Original size: {kb(origBytes)}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
              <div>
                <label style={{ fontSize: 13, color: '#6b7280' }}>Width (px)</label>
                <input type="number" min={1} value={width} onChange={(e) => onWidthChange(Number(e.target.value))} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 4, fontSize: 14 }} />
              </div>
              <div>
                <label style={{ fontSize: 13, color: '#6b7280' }}>Height (px)</label>
                <input type="number" min={1} value={height} onChange={(e) => onHeightChange(Number(e.target.value))} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 4, fontSize: 14 }} />
              </div>
            </div>

            <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13, color: '#1c1917', marginBottom: 14 }}>
              <input type="checkbox" checked={lockRatio} onChange={(e) => setLockRatio(e.target.checked)} />
              Keep the aspect ratio
            </label>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '6px 0 16px' }}>
              <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 12 }}>
                <small style={{ display: 'block', color: '#6b7280', fontSize: 12 }}>Original size</small>
                <b style={{ fontSize: 20, fontWeight: 600 }}>{kb(origBytes)}</b>
              </div>
              <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 12 }}>
                <small style={{ display: 'block', color: '#6b7280', fontSize: 12 }}>New size</small>
                <b style={{ fontSize: 20, fontWeight: 600 }}>{newBytes != null ? kb(newBytes) : (busy ? '...' : '-')}</b>
              </div>
            </div>

            <div style={{ marginTop: 8 }}>
              <DownloadButton getBlob={async () => resultBlob} filename={filename} label="Download resized image" />
              <button type="button" onClick={reset} style={{ border: '1px solid #e7e5e4', background: 'transparent', color: '#1c1917', padding: '12px 20px', borderRadius: 10, fontWeight: 500, cursor: 'pointer', marginLeft: 8 }}>Choose another</button>
            </div>
          </div>
        )}

        {error && <p role="alert" style={{ color: '#be123c', fontSize: 14, marginTop: 10 }}>{error}</p>}
      </section>

      <p style={{ fontSize: 13, color: '#6b7280', background: '#fff7ed', borderRadius: 10, padding: '10px 12px' }}>
        Your image is processed inside your browser. It is never uploaded or stored. The exact size limit for a form is set by that form, so check the official instructions.
      </p>
    </ToolShell>
  )
}