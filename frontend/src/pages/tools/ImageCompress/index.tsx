import { useEffect, useRef, useState } from 'react'
import ToolShell from '../../../components/ToolShell'
import UploadBox from '../../../components/UploadBox'
import LiveSizeSlider from '../../../components/LiveSizeSlider'
import DownloadButton from '../../../components/DownloadButton'

function kb(b: number): string {
  return b < 1048576 ? (b / 1024).toFixed(0) + ' KB' : (b / 1048576).toFixed(2) + ' MB'
}

type Result = { blob: Blob | null; original: boolean; short?: boolean }

export default function ImageCompress() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [dims, setDims] = useState<string>('')
  const [origBytes, setOrigBytes] = useState<number>(0)
  const [percent, setPercent] = useState<number>(70)
  const [newBytes, setNewBytes] = useState<number | null>(null)
  const [busy, setBusy] = useState<boolean>(false)
  const [status, setStatus] = useState<string>('')
  const [error, setError] = useState<string>('')

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const tokenRef = useRef<number>(0)
  const timerRef = useRef<number | null>(null)
  const lastResultRef = useRef<Result>({ blob: null, original: true })

  const encode = (q: number): Promise<Blob> => {
    return new Promise((res, rej) => {
      const cv = canvasRef.current
      if (!cv) return rej(new Error('no canvas'))
      cv.toBlob((b) => (b ? res(b) : rej(new Error('encode failed'))), 'image/jpeg', q)
    })
  }

  const bestFor = async (targetBytes: number): Promise<Result> => {
    let lo = 0.05, hi = 0.95
    let best: { b: Blob; q: number } | null = null
    for (let i = 0; i < 7; i++) {
      const mid = (lo + hi) / 2
      const b = await encode(mid)
      if (b.size <= targetBytes) { best = { b, q: mid }; lo = mid }
      else { hi = mid }
    }
    if (!best) {
      const b = await encode(0.05)
      return { blob: b, original: false, short: true }
    }
    return { blob: best.b, original: false, short: false }
  }

  const update = async () => {
    const my = ++tokenRef.current
    if (!origBytes) return
    if (percent >= 100) {
      setNewBytes(origBytes)
      setStatus('Original size kept.')
      lastResultRef.current = { blob: null, original: true }
      return
    }
    setBusy(true)
    setStatus('Calculating...')
    const target = (origBytes * percent) / 100
    try {
      const r = await bestFor(target)
      if (my !== tokenRef.current) return
      if (r.blob) setNewBytes(r.blob.size)
      setStatus(r.short ? 'Closest size possible for this photo.' : 'Ready. Target size reached.')
      lastResultRef.current = r
    } catch {
      if (my === tokenRef.current) setStatus('Could not compress this image.')
    } finally {
      if (my === tokenRef.current) setBusy(false)
    }
  }

  useEffect(() => {
    if (!origBytes) return
    if (timerRef.current) window.clearTimeout(timerRef.current)
    timerRef.current = window.setTimeout(() => { update() }, 200)
    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [percent, origBytes])

  const handleFile = (f: File) => {
    setError('')
    if (!f.type.startsWith('image/')) { setError('Please choose a JPG, PNG or WebP image.'); return }
    if (f.size > 25 * 1048576) { setError('This file is over 25 MB. Please choose a smaller image.'); return }

    const im = new Image()
    im.onload = () => {
      const cv = canvasRef.current
      if (!cv) return
      const s = Math.min(1, 2400 / Math.max(im.width, im.height))
      cv.width = Math.max(1, Math.round(im.width * s))
      cv.height = Math.max(1, Math.round(im.height * s))
      const ctx = cv.getContext('2d')
      if (ctx) {
        ctx.fillStyle = '#fff'
        ctx.fillRect(0, 0, cv.width, cv.height)
        ctx.drawImage(im, 0, 0, cv.width, cv.height)
      }
      setDims(im.width + ' x ' + im.height + ' px')
      setOrigBytes(f.size)
      setNewBytes(null)
      setPercent(70)
      setStatus('')
      setFile(f)
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      const u = URL.createObjectURL(f)
      setPreviewUrl(u)
    }
    im.onerror = () => { setError('This image could not be opened. Try a JPG, PNG or WebP file.') }
    im.src = URL.createObjectURL(f)
  }

  const reset = () => {
    setFile(null)
    setNewBytes(null)
    setOrigBytes(0)
    setDims('')
    setStatus('')
    setError('')
    setPercent(70)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl('')
  }

  const filename = (() => {
    if (!file) return 'ppm-creator-compressed.jpg'
    const base = file.name.replace(/\.[^.]+$/, '')
    return (base || 'image') + '-compressed.jpg'
  })()

  const getBlob = async (): Promise<Blob | null> => {
    if (percent >= 100 && file) return file
    return lastResultRef.current.blob
  }

  const faqGroups = [
    {
      heading: 'Basics',
      items: [
        { q: 'What does this image compressor do?', a: 'It reduces the file size of a JPG, PNG or WebP image by saving it as a JPEG at a quality level that meets the size you choose. The slider shows the new size before you download.' },
        { q: 'Is the tool free to use?', a: 'Yes. You can use it as many times as you like without creating an account. There is no signup step, and no advertising popup blocks the download button.' },
        { q: 'Do I need to install anything?', a: 'No. The compressor runs inside your browser. You only need a modern browser such as Chrome, Edge, Firefox or Safari on a phone or a computer.' },
        { q: 'Which devices does it work on?', a: 'It works on phones, tablets and desktop computers. On small screens the layout stacks into one column so the slider and download button stay easy to reach.' },
      ],
    },
    {
      heading: 'Quality and size',
      items: [
        { q: 'Does compressing reduce image quality?', a: 'Yes, a little. Keeping 70 to 90 percent of the original usually looks almost identical. Going much lower can make fine details look soft, so check the preview before downloading.' },
        { q: 'Why is my compressed image not exactly at the target size?', a: 'Some photos cannot shrink to every target without visible damage. In that case the tool shows the closest size it can reach for that photo, and you can choose a higher percentage.' },
        { q: 'How much can I reduce a photo before it looks bad?', a: 'Most photos look fine at 60 to 80 percent of the original size. Text-heavy screenshots and photos with sharp edges often need a higher percentage to stay readable.' },
        { q: 'What does 100 percent mean on the slider?', a: 'At 100 percent the tool keeps the original file unchanged. Anything below that re-encodes the image at a quality that gets closer to your chosen target.' },
        { q: 'What does 90 percent of the original mean?', a: 'It means the new file will try to be about 90 percent of the original bytes. The tool searches for the JPEG quality closest to that size and stops when it cannot get closer.' },
      ],
    },
    {
      heading: 'Formats and output',
      items: [
        { q: 'Which formats can I upload?', a: 'You can upload JPG, PNG and WebP images. The download is always a JPEG because it is the format that most forms and websites accept.' },
        { q: 'Can I keep a transparent background?', a: 'No. The output is a JPEG, and JPEG does not support transparency. Transparent areas become white. Use a PNG converter if you need transparency.' },
        { q: 'Will the downloaded file keep my original name?', a: 'The download appends the word compressed before the .jpg extension so it does not overwrite your original file. For example, photo.jpg becomes photo-compressed.jpg.' },
      ],
    },
    {
      heading: 'Privacy and troubleshooting',
      items: [
        { q: 'Is my photo uploaded to a server?', a: 'No. The image is loaded and compressed inside your browser. It is not sent to any server and it is not stored by this site.' },
        { q: 'Why does the download wait for a moment?', a: 'The tool makes the final version at your chosen size before the download starts. The short pause shows that processing has finished, and it stops the browser from downloading a stale result.' },
        { q: 'What is the largest file I can use?', a: 'Files up to 25 MB work. Very large photos from modern phones may take longer on older devices, and the tool might reduce the internal working size before compressing.' },
        { q: 'Why does the result look different from the preview?', a: 'The preview shows the original image. The download applies the compression to the same image, so details should match. If they differ, your browser may be showing a cached copy of the original; refresh and try again.' },
      ],
    },
  ]

  const article = (
    <>
      <h2>How to compress an image online</h2>
      <ol>
        <li>Tap the box and choose a photo from your phone or computer.</li>
        <li>Move the slider. 100% keeps the original size, 90% keeps 90% of it, and so on. The new size updates as you move it.</li>
        <li>Press Download compressed image. The file downloads after a short processing step.</li>
      </ol>

      <h2>Why use this image compressor</h2>
      <h3>Live size preview</h3>
      <p>You see the new file size before you download. The slider shows the target size and the current result, so you can stop at the point where the size fits and the details still look right.</p>
      <h3>Pick your own size</h3>
      <p>You can keep 90 percent, 50 percent, 20 percent or any value between 10 and 100. The tool searches for the JPEG quality that gets closest to your target and tells you when it cannot go further.</p>
      <h3>Processed in your browser</h3>
      <p>The photo stays on your device. No upload happens, so the tool works even when you are offline after the page has loaded once.</p>
      <h3>Free, no signup</h3>
      <p>There is no account and no daily limit. Open the page, compress the image, close the tab. Nothing is saved afterwards.</p>

      <h2>About compressing photos</h2>
      <p>Compressing a photo reduces the amount of detail the file stores. A small reduction, to around 80 to 90 percent of the original size, often looks the same to the eye. Pushing much lower can cause soft details or blocky patches, especially in smooth areas like sky or skin. The live preview helps you find the balance for each photo.</p>
      <p>Many forms and upload portals ask for a photo under a certain size. The exact limit differs by form, so check the official instructions for the form you are filling. Compressing once from the original photo gives better results than compressing an already compressed copy again.</p>

      <h2>Common mistakes</h2>
      <ul>
        <li>Compressing the same file over and over, which loses quality each time.</li>
        <li>Shrinking too far when a moderate reduction would be enough.</li>
        <li>Assuming a transparent PNG keeps its transparency. The download is always a JPEG.</li>
        <li>Downloading before the tool finishes its search. Wait for the Processing label to finish.</li>
      </ul>

      <h2>Choosing the right size</h2>
      <p>Think about where the photo will be used. A profile picture usually needs less detail than a printed page. A form that accepts files up to 1 MB will often be fine with a photo around 70 to 80 percent of the original size. A web page that shows the photo small on screen can usually take a much lower value.</p>
      <p>If the tool shows the closest size it can reach, that means the photo is already near the smallest size possible at any visible quality. Choose a higher percentage if you want more detail, or a lower one if you only need a thumbnail.</p>

      <h2>Privacy and data</h2>
      <p>Your image never leaves your device. The page does not send the file to a server, does not store the file name, and does not keep a copy. When you close the tab, the compressed blob is discarded by the browser.</p>
      <p>If you need to keep the original, keep a copy before you compress. The tool does not overwrite the original file, and the download always adds the word compressed to the name so both files can exist side by side.</p>
    </>
  )

  return (
    <ToolShell
      title="Image Compressor Online Free | PPM Creator"
      description="Compress JPG, PNG and WebP images online for free. See the new file size live and pick the exact size you need. Files stay in your browser."
      path="/image-compress"
      crumb={[{ label: 'Image Tools', to: '/image-tools' }]}
      h1="Image Compressor: Reduce Photo Size Online Free"
      lead="Upload a JPG, PNG or WebP image, pick the size you want, and download a smaller file. You see the new size before you download."
      faqGroups={faqGroups}
      related={[
        { name: 'Image Resizer', href: '/image-resize', blurb: 'Change width and height in pixels' },
        { name: 'Image Converter', href: '/image-convert', blurb: 'Change JPG, PNG and WebP formats' },
        { name: 'Image Cropper', href: '/image-crop', blurb: 'Crop to a square or custom size' },
        { name: 'Compress PDF', href: '/pdf-compress', blurb: 'Make a PDF smaller' },
        { name: 'Image to PDF', href: '/image-to-pdf', blurb: 'Turn photos into one PDF' },
        { name: 'QR Code Generator', href: '/qr-code-gen', blurb: 'Create a QR code from a link' },
      ]}
      guides={[
        { title: 'How to compress images without losing quality' },
        { title: 'JPG, PNG or WebP: which format should you use?' },
        { title: 'Checking a photo size before uploading to a form' },
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
                <b style={{ fontWeight: 600 }}>{dims}</b>
                <div style={{ fontSize: 13, color: '#6b7280', marginTop: 6 }}>{file.name}</div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, margin: '6px 0 16px' }}>
              <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 12 }}>
                <small style={{ display: 'block', color: '#6b7280', fontSize: 12 }}>Original size</small>
                <b style={{ fontSize: 20, fontWeight: 600 }}>{kb(origBytes)}</b>
              </div>
              <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 12 }}>
                <small style={{ display: 'block', color: '#6b7280', fontSize: 12 }}>New size</small>
                <b style={{ fontSize: 20, fontWeight: 600 }}>{newBytes != null ? kb(newBytes) : '...'}</b>
              </div>
            </div>

            <LiveSizeSlider value={percent} min={10} max={100} onChange={setPercent} originalBytes={origBytes} newBytes={newBytes} busy={busy} />

            {status && <p style={{ fontSize: 13, color: '#6b7280', marginTop: 8 }}>{status}</p>}

            <div style={{ marginTop: 16 }}>
              <DownloadButton getBlob={getBlob} filename={filename} label="Download compressed image" />
              <button type="button" onClick={reset} style={{ border: '1px solid #e7e5e4', background: 'transparent', color: '#1c1917', padding: '12px 20px', borderRadius: 10, fontWeight: 500, cursor: 'pointer', marginLeft: 8 }}>Choose another</button>
            </div>
          </div>
        )}

        {error && <p role="alert" style={{ color: '#be123c', fontSize: 14, marginTop: 10 }}>{error}</p>}
      </section>

      <p style={{ fontSize: 13, color: '#6b7280', background: '#fff7ed', borderRadius: 10, padding: '10px 12px' }}>
        Your image is processed inside your browser. It is never uploaded or stored. Processing time depends on your device and the image size.
      </p>
    </ToolShell>
  )
}