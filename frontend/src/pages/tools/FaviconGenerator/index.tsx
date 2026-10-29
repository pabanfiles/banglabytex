import { useRef, useState } from 'react'
import ToolShell from '@/components/ToolShell'
import UploadBox from '@/components/UploadBox'

const SIZES = [16, 32, 48, 64, 128, 180, 192, 512]

export default function FaviconGenerator() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [error, setError] = useState('')
  const imgRef = useRef<HTMLImageElement | null>(null)

  const handleFile = (f: File) => {
    setError('')
    if (!f.type.startsWith('image/')) { setError('Please choose an image.'); return }
    if (f.size > 5 * 1048576) { setError('Keep the file under 5 MB.'); return }
    const im = new Image()
    im.onload = () => { imgRef.current = im; setFile(f); if (previewUrl) URL.revokeObjectURL(previewUrl); setPreviewUrl(URL.createObjectURL(f)) }
    im.onerror = () => setError('This image could not be opened.')
    im.src = URL.createObjectURL(f)
  }

  const download = async (size: number) => {
    const im = imgRef.current
    if (!im) return
    const cv = document.createElement('canvas')
    cv.width = size; cv.height = size
    const ctx = cv.getContext('2d')
    if (!ctx) return
    // fit: contain within square, white background
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, size, size)
    const scale = Math.min(size / im.width, size / im.height)
    const w = im.width * scale, h = im.height * scale
    ctx.drawImage(im, (size - w) / 2, (size - h) / 2, w, h)
    cv.toBlob((b) => {
      if (!b) return
      const url = URL.createObjectURL(b)
      const a = document.createElement('a')
      a.href = url; a.download = 'favicon-' + size + 'x' + size + '.png'
      document.body.appendChild(a); a.click(); a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 4000)
    }, 'image/png')
  }

  const reset = () => { setFile(null); setPreviewUrl(''); setError('') }

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What is a favicon?', a: 'A favicon is the small icon shown in the browser tab, in bookmarks, and on the home screen when a site is saved. It is a PNG or ICO image, usually 16x16 to 192x192 pixels.' },
      { q: 'What does this tool do?', a: 'It takes one image and produces PNG files at the common favicon sizes, so you can use them as the tab icon and the home-screen icon.' },
      { q: 'Is it free?', a: 'Yes. No account, no upload, no daily limit.' },
    ]},
    { heading: 'Sizes', items: [
      { q: 'Which size do I need?', a: 'Use 16x16 and 32x32 for the tab icon, 180x180 for the iOS home screen, and 192x192 for Android. Include 512x512 if you publish a PWA manifest.' },
      { q: 'Should the image be square?', a: 'Yes. A square image scales cleanly to every size. If your logo is wide, the tool centres it on a white background so nothing is cut off.' },
      { q: 'Do I need an ICO file?', a: 'Most modern browsers accept PNG favicons. Older browsers still look for favicon.ico, so including a 32x32 PNG usually works.' },
    ]},
    { heading: 'Privacy and output', items: [
      { q: 'Is my image uploaded?', a: 'No. The files are generated in your browser. The image is never sent to a server.' },
      { q: 'What format is the download?', a: 'PNG at each size. PNG keeps the icon sharp and has no visible compression artefacts.' },
      { q: 'What happens if I lose the file?', a: 'You can always regenerate it from the same source image. The tool does not keep a copy.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to make a favicon</h2>
      <ol>
        <li>Upload a square image, ideally at least 512x512 pixels.</li>
        <li>Download the sizes you need: 16, 32, 180, 192 and 512.</li>
        <li>Add the PNG files to your site and link the 32x32 one as the tab icon.</li>
      </ol>
      <h2>Why use this tool</h2>
      <p>One image, every common size, generated in your browser. No upload and no dependency on a server.</p>
      <h2>Privacy and data</h2>
      <p>The image stays on your device. Nothing is uploaded.</p>
    </>
  )

  return (
    <ToolShell
      title="Favicon Generator Online Free | PPM Creator"
      description="Create favicon PNGs at common sizes from one image. Files stay in your browser."
      path="/favicon-generator"
      crumb={[{ label: 'Image Tools', to: '/image-tools' }]}
      h1="Favicon Generator: Make Icons from One Image"
      lead="Upload a square image and download PNGs at 16, 32, 180, 192 and 512 pixels."
      faqGroups={faqGroups}
      related={[
        { name: 'Image Compressor', href: '/image-compress', blurb: 'Reduce file size at a chosen quality' },
        { name: 'Image Resizer', href: '/image-resize', blurb: 'Change width and height in pixels' },
        { name: 'Image Converter', href: '/image-convert', blurb: 'Change JPG, PNG and WebP formats' },
        { name: 'QR Code Generator', href: '/qr-code-gen', blurb: 'Create a QR code from a link' },
      ]}
      guides={[
        { title: 'Choosing a favicon for a website' },
        { title: 'Why a square source image matters' },
        { title: 'Favicon sizes and where they appear' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        {!file && <UploadBox accept="image/*" maxMB={5} hint="Square image - up to 5 MB - nothing is uploaded" onFile={handleFile} />}
        {file && (
          <div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 14 }}>
              <img src={previewUrl} alt="Preview" style={{ width: 88, height: 88, objectFit: 'contain', borderRadius: 10, border: '1px solid #e7e5e4', background: '#fff' }} />
              <div><b>{file.name}</b></div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {SIZES.map((s) => (
                <button key={s} type="button" onClick={() => download(s)} style={{ padding: '10px 14px', borderRadius: 10, border: '1px solid #e7e5e4', background: '#fff', color: '#1c1917', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Download {s}x{s}</button>
              ))}
            </div>
            <button type="button" onClick={reset} style={{ border: '1px solid #e7e5e4', background: 'transparent', color: '#1c1917', padding: '12px 20px', borderRadius: 10, fontWeight: 500, cursor: 'pointer' }}>Choose another</button>
          </div>
        )}
        {error && <p role="alert" style={{ color: '#be123c', fontSize: 14, marginTop: 10 }}>{error}</p>}
      </section>
    </ToolShell>
  )
}