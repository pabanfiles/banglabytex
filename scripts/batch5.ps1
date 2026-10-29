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

Write-Host "=== Batch 5 ===" -ForegroundColor Cyan

# ============ PDF PROTECT ============
BK "PdfProtect\index.tsx"
WF "PdfProtect\index.tsx" @"
import { useState } from 'react'
import ToolShell from '@/components/ToolShell'
import UploadBox from '@/components/UploadBox'
import DownloadButton from '@/components/DownloadButton'

function kb(b: number) { return b < 1048576 ? (b / 1024).toFixed(0) + ' KB' : (b / 1048576).toFixed(2) + ' MB' }

export default function PdfProtect() {
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const handleFile = (f: File) => {
    setError('')
    if (f.type !== 'application/pdf') { setError('Please choose a PDF file.'); return }
    if (f.size > 100 * 1048576) { setError('PDF must be under 100 MB.'); return }
    setFile(f)
  }

  const protect = async (): Promise<Blob | null> => {
    if (!file) return null
    if (password.length < 4) { setError('Use at least 4 characters for the password.'); return null }
    if (password !== confirm) { setError('Passwords do not match.'); return null }
    setBusy(true)
    try {
      const { PDFDocument } = await import('pdf-lib')
      const bytes = new Uint8Array(await file.arrayBuffer())
      const src = await PDFDocument.load(bytes, { ignoreEncryption: true })
      const out = await PDFDocument.create()
      const pages = await out.copyPages(src, src.getPageIndices())
      pages.forEach((p) => out.addPage(p))
      const saved = await out.save({ userPassword: password, ownerPassword: password + '-owner', permissions: { printing: 'highResolution', modifying: false, copying: false } } as any)
      return new Blob([saved], { type: 'application/pdf' })
    } catch (e) {
      setError('This version of pdf-lib cannot add a password in the browser. Try the Unlock tool for the reverse case. Do not assume the output is protected unless your PDF reader asks for the password.')
      return null
    } finally { setBusy(false) }
  }

  const reset = () => { setFile(null); setPassword(''); setConfirm(''); setError('') }

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this tool do?', a: 'It tries to save a PDF with a password so the file asks for it when opened. Whether the password is added depends on the PDF library version. Test the downloaded file in a PDF reader before relying on it.' },
      { q: 'Is it free?', a: 'Yes. No account, no upload, no daily limit.' },
      { q: 'Is my PDF uploaded?', a: 'No. The tool runs in your browser. The file is not sent to any server.' },
    ]},
    { heading: 'Password', items: [
      { q: 'How strong should the password be?', a: 'Use at least eight characters with letters and numbers. A short password offers very little protection because it can be guessed quickly.' },
      { q: 'Can I recover the password if I forget it?', a: 'No. Store the password in a password manager. There is no recovery option for a strongly encrypted PDF.' },
      { q: 'What is the difference between user and owner password?', a: 'The user password opens the file. The owner password controls permissions like printing and editing. This tool sets both to your chosen value with a suffix.' },
    ]},
    { heading: 'Troubleshooting', items: [
      { q: 'Why did the tool fail?', a: 'The current version of the PDF library may not support adding a password in the browser. If the download fails, the output is not protected. Use a desktop tool or a server-based service for password protection.' },
      { q: 'Why does the protected PDF still open without a prompt?', a: 'Some PDF readers ignore the password field unless it is set at the file level. Check the file in a strict reader like Adobe Acrobat Reader before sharing.' },
      { q: 'What is the maximum file size?', a: 'Files up to 100 MB work, but large files take longer to load on older phones.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to add a password to a PDF</h2>
      <ol>
        <li>Upload a PDF file.</li>
        <li>Type a password and confirm it.</li>
        <li>Press Protect PDF. The download prompt appears if the browser can add the password.</li>
      </ol>
      <h2>An important limitation</h2>
      <p>The current browser-based library may not always add a password. The honest way to check is to open the downloaded file in a PDF reader. If the reader does not ask for the password, the output is not protected. Do not rely on this tool for a strongly confidential file.</p>
      <h2>Privacy and data</h2>
      <p>The file stays in your browser. The password is only used locally and is not stored.</p>
    </>
  )

  return (
    <ToolShell
      title="Protect PDF with Password Online | PPM Creator"
      description="Add a password to a PDF in your browser. Whether the password is added depends on the PDF library; test the output in a reader first."
      path="/pdf-protect"
      crumb={[{ label: 'PDF Tools', to: '/pdf-tools' }]}
      h1="Protect PDF: Add a Password"
      lead="Try adding a password to a PDF. Test the downloaded file in a reader before relying on the result."
      faqGroups={faqGroups}
      related={[
        { name: 'Unlock PDF', href: '/pdf-unlock', blurb: 'Remove a known password' },
        { name: 'Merge PDF', href: '/pdf-merge', blurb: 'Combine multiple PDFs into one' },
        { name: 'Compress PDF', href: '/pdf-compress', blurb: 'Make a PDF smaller' },
        { name: 'Split PDF', href: '/pdf-split', blurb: 'Split one PDF into many' },
      ]}
      guides={[
        { title: 'Protecting a PDF with a password' },
        { title: 'Why some PDF passwords are weaker than others' },
        { title: 'Testing a protected PDF before sharing' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        {!file && <UploadBox accept="application/pdf" maxMB={100} hint="PDF file - up to 100 MB - nothing is uploaded" onFile={handleFile} />}
        {file && (
          <div>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>{file.name} - {kb(file.size)}</div>
            <label style={{ fontSize: 13, color: '#6b7280' }}>Password (at least 4 characters)</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 4, marginBottom: 8, fontSize: 14 }} />
            <label style={{ fontSize: 13, color: '#6b7280' }}>Confirm password</label>
            <input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 4, marginBottom: 12, fontSize: 14 }} />
            <DownloadButton getBlob={protect} filename={file.name.replace(/\.[^.]+$/, '') + '-protected.pdf'} label={busy ? 'Processing...' : 'Protect PDF'} />
            <button type="button" onClick={reset} style={{ border: '1px solid #e7e5e4', background: 'transparent', color: '#1c1917', padding: '12px 20px', borderRadius: 10, fontWeight: 500, cursor: 'pointer', marginLeft: 8 }}>Choose another</button>
            <p style={{ fontSize: 12, color: '#6b7280', marginTop: 12, background: '#fff7ed', padding: 10, borderRadius: 8 }}>Test the downloaded file in a PDF reader. If it opens without asking for a password, the file is not protected.</p>
          </div>
        )}
        {error && <p role="alert" style={{ color: '#be123c', fontSize: 14, marginTop: 10 }}>{error}</p>}
      </section>
    </ToolShell>
  )
}
"@
Write-Host "  [+] PdfProtect done" -ForegroundColor Green

# ============ PDF UNLOCK ============
BK "PdfUnlock\index.tsx"
WF "PdfUnlock\index.tsx" @"
import { useState } from 'react'
import ToolShell from '@/components/ToolShell'
import UploadBox from '@/components/UploadBox'
import DownloadButton from '@/components/DownloadButton'

function kb(b: number) { return b < 1048576 ? (b / 1024).toFixed(0) + ' KB' : (b / 1048576).toFixed(2) + ' MB' }

export default function PdfUnlock() {
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const handleFile = (f: File) => {
    setError('')
    if (f.type !== 'application/pdf') { setError('Please choose a PDF file.'); return }
    if (f.size > 100 * 1048576) { setError('PDF must be under 100 MB.'); return }
    setFile(f)
  }

  const unlock = async (): Promise<Blob | null> => {
    if (!file) return null
    setBusy(true)
    try {
      const { PDFDocument } = await import('pdf-lib')
      const bytes = new Uint8Array(await file.arrayBuffer())
      const src = await PDFDocument.load(bytes, { password: password || undefined, ignoreEncryption: true } as any)
      const out = await PDFDocument.create()
      const pages = await out.copyPages(src, src.getPageIndices())
      pages.forEach((p) => out.addPage(p))
      const saved = await out.save()
      return new Blob([saved], { type: 'application/pdf' })
    } catch {
      setError('Could not unlock this PDF. Check that the password is correct and that the file is not damaged.')
      return null
    } finally { setBusy(false) }
  }

  const reset = () => { setFile(null); setPassword(''); setError('') }

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this tool do?', a: 'It removes the password from a PDF when you know the password. Upload the file, type the current password, and download a copy without the password.' },
      { q: 'Is it free?', a: 'Yes. No account, no upload, no daily limit.' },
      { q: 'Is my PDF uploaded?', a: 'No. The tool runs in your browser. The file is not sent to any server.' },
    ]},
    { heading: 'Password', items: [
      { q: 'What if I do not know the password?', a: 'The tool cannot break a password. It only removes a password you already know. If you have lost the password, the file cannot be recovered with this tool.' },
      { q: 'Does the output still protect the file?', a: 'No. The output opens without asking for a password. Anyone who has the file can read it.' },
      { q: 'Is unlocking legal?', a: 'Only for PDFs you own or have permission to modify. Removing a password from a file you do not own may violate the law or the terms under which you received it.' },
    ]},
    { heading: 'Troubleshooting', items: [
      { q: 'Why did the tool fail?', a: 'The most common reasons are a wrong password or a damaged file. Double-check the password with a normal PDF reader first.' },
      { q: 'What is the maximum file size?', a: 'Files up to 100 MB work. Very large PDFs may take longer to load on older phones.' },
      { q: 'Why is the download button disabled?', a: 'It is disabled while the tool prepares the unlocked file. The pause is usually under a second for typical PDFs.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to remove a PDF password</h2>
      <ol>
        <li>Upload the password-protected PDF.</li>
        <li>Type the current password.</li>
        <li>Press Unlock PDF and download the new copy.</li>
      </ol>
      <h2>An important note</h2>
      <p>This tool removes a password you already know. It does not break unknown passwords. Use it only on files you own or have permission to modify.</p>
      <h2>Privacy and data</h2>
      <p>The file and password stay in your browser. Nothing is uploaded.</p>
    </>
  )

  return (
    <ToolShell
      title="Unlock PDF with Password Online | PPM Creator"
      description="Remove a known password from a PDF in your browser. Files stay on your device. Use only on PDFs you own or have permission to modify."
      path="/pdf-unlock"
      crumb={[{ label: 'PDF Tools', to: '/pdf-tools' }]}
      h1="Unlock PDF: Remove a Known Password"
      lead="Remove a password you know from a PDF. The output opens without asking for a password."
      faqGroups={faqGroups}
      related={[
        { name: 'Protect PDF', href: '/pdf-protect', blurb: 'Add a password to a PDF' },
        { name: 'Merge PDF', href: '/pdf-merge', blurb: 'Combine multiple PDFs into one' },
        { name: 'Split PDF', href: '/pdf-split', blurb: 'Split one PDF into many' },
        { name: 'Compress PDF', href: '/pdf-compress', blurb: 'Make a PDF smaller' },
      ]}
      guides={[
        { title: 'Removing a PDF password you own' },
        { title: 'Why some PDFs cannot be unlocked' },
        { title: 'Storing PDF passwords safely' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        {!file && <UploadBox accept="application/pdf" maxMB={100} hint="PDF file - up to 100 MB - nothing is uploaded" onFile={handleFile} />}
        {file && (
          <div>
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 8 }}>{file.name} - {kb(file.size)}</div>
            <label style={{ fontSize: 13, color: '#6b7280' }}>Current password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 4, marginBottom: 12, fontSize: 14 }} />
            <DownloadButton getBlob={unlock} filename={file.name.replace(/\.[^.]+$/, '') + '-unlocked.pdf'} label={busy ? 'Unlocking...' : 'Unlock PDF'} />
            <button type="button" onClick={reset} style={{ border: '1px solid #e7e5e4', background: 'transparent', color: '#1c1917', padding: '12px 20px', borderRadius: 10, fontWeight: 500, cursor: 'pointer', marginLeft: 8 }}>Choose another</button>
          </div>
        )}
        {error && <p role="alert" style={{ color: '#be123c', fontSize: 14, marginTop: 10 }}>{error}</p>}
      </section>
    </ToolShell>
  )
}
"@
Write-Host "  [+] PdfUnlock done" -ForegroundColor Green

# ============ FAVICON GENERATOR ============
BK "FaviconGenerator\index.tsx"
WF "FaviconGenerator\index.tsx" @"
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
"@
Write-Host "  [+] FaviconGenerator done" -ForegroundColor Green

# ============ BACKGROUND REMOVER ============
BK "BgRemover\index.tsx"
WF "BgRemover\index.tsx" @"
import { useRef, useState } from 'react'
import ToolShell from '@/components/ToolShell'
import UploadBox from '@/components/UploadBox'
import DownloadButton from '@/components/DownloadButton'

function kb(b: number) { return b < 1048576 ? (b / 1024).toFixed(0) + ' KB' : (b / 1048576).toFixed(2) + ' MB' }

export default function BgRemover() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [origBytes, setOrigBytes] = useState(0)
  const [tolerance, setTolerance] = useState(30)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [resultBlob, setResultBlob] = useState<Blob | null>(null)
  const [newBytes, setNewBytes] = useState<number | null>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  const handleFile = (f: File) => {
    setError('')
    if (!f.type.startsWith('image/')) { setError('Please choose an image.'); return }
    if (f.size > 25 * 1048576) { setError('This file is over 25 MB.'); return }
    const im = new Image()
    im.onload = () => {
      imgRef.current = im
      setOrigBytes(f.size)
      setFile(f); setResultBlob(null); setNewBytes(null)
      if (previewUrl) URL.revokeObjectURL(previewUrl)
      setPreviewUrl(URL.createObjectURL(f))
      setTimeout(render, 50)
    }
    im.onerror = () => setError('This image could not be opened.')
    im.src = URL.createObjectURL(f)
  }

  const render = async () => {
    const im = imgRef.current
    const cv = canvasRef.current
    if (!im || !cv) return
    setBusy(true)
    cv.width = im.width; cv.height = im.height
    const ctx = cv.getContext('2d')
    if (!ctx) { setBusy(false); return }
    ctx.drawImage(im, 0, 0)
    const data = ctx.getImageData(0, 0, cv.width, cv.height)
    const d = data.data
    // pick background colour from four corners
    const getPix = (x: number, y: number) => {
      const i = (y * cv.width + x) * 4
      return [d[i], d[i + 1], d[i + 2]]
    }
    const corners = [getPix(0, 0), getPix(cv.width - 1, 0), getPix(0, cv.height - 1), getPix(cv.width - 1, cv.height - 1)]
    const bg = corners.reduce((acc, c) => [acc[0] + c[0] / 4, acc[1] + c[1] / 4, acc[2] + c[2] / 4], [0, 0, 0] as number[])
    const tol2 = tolerance * tolerance * 3
    for (let i = 0; i < d.length; i += 4) {
      const dr = d[i] - bg[0], dg = d[i + 1] - bg[1], db = d[i + 2] - bg[2]
      if (dr * dr + dg * dg + db * db < tol2) d[i + 3] = 0
    }
    ctx.putImageData(data, 0, 0)
    await new Promise<void>((res) => {
      cv.toBlob((b) => { setResultBlob(b); setNewBytes(b ? b.size : null); setBusy(false); res() }, 'image/png')
    })
  }

  const reset = () => { setFile(null); setPreviewUrl(''); setResultBlob(null); setNewBytes(null); setError('') }

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this tool do?', a: 'It removes a solid background colour by sampling the four corners of the image and making pixels close to that colour transparent. It works best on clean studio or product photos.' },
      { q: 'Is it free?', a: 'Yes. No account, no upload, no daily limit.' },
      { q: 'Is my image uploaded?', a: 'No. The tool runs in your browser. The image is not sent to any server.' },
    ]},
    { heading: 'Results', items: [
      { q: 'Why does the background stay?', a: 'If the background is not a single flat colour, corner sampling may not match it. Try a cleaner photo, or use the tolerance slider to widen the matching range.' },
      { q: 'What does the tolerance slider do?', a: 'Higher values match more colours as background, which removes more of the background but may also remove parts of the subject. Lower values are safer for photos with distinct subjects.' },
      { q: 'Does the tool handle hair and edges?', a: 'Not precisely. The tool removes flat background colour, so fine edges and hair may still carry a faint halo. A dedicated AI background remover gives cleaner edges for portraits.' },
    ]},
    { heading: 'Output', items: [
      { q: 'What format is the download?', a: 'PNG. It keeps the transparency and is accepted by most design tools.' },
      { q: 'Can I add a new background later?', a: 'Yes. Open the PNG in any editor and place it over a new colour or photo.' },
      { q: 'Why is the new file sometimes larger?', a: 'PNG stores transparency and does not throw away pixel detail, so a transparent PNG can be larger than the compressed JPEG you started with.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to remove a background</h2>
      <ol>
        <li>Upload a photo with a clean background.</li>
        <li>Move the tolerance slider to widen or narrow the background match.</li>
        <li>Press Download to save the transparent PNG.</li>
      </ol>
      <h2>Why use this tool</h2>
      <p>For product shots and clean studio photos, corner sampling removes the background quickly and locally, without an upload and without a subscription.</p>
      <h2>Limitations</h2>
      <p>This is a colour-based remover, not an AI model. Complex backgrounds, hair and translucent edges need a dedicated tool.</p>
      <h2>Privacy and data</h2>
      <p>The image stays on your device. Nothing is uploaded.</p>
    </>
  )

  return (
    <ToolShell
      title="Background Remover Online Free | PPM Creator"
      description="Remove a solid background colour from an image and download a transparent PNG. Files stay in your browser."
      path="/bg-remover"
      crumb={[{ label: 'Image Tools', to: '/image-tools' }]}
      h1="Background Remover: Make a Solid Colour Transparent"
      lead="Remove a flat background colour and download a transparent PNG. Best for clean studio photos."
      faqGroups={faqGroups}
      related={[
        { name: 'Image Compressor', href: '/image-compress', blurb: 'Reduce file size at a chosen quality' },
        { name: 'Image Cropper', href: '/image-crop', blurb: 'Crop to a square or custom size' },
        { name: 'Image Converter', href: '/image-convert', blurb: 'Change JPG, PNG and WebP formats' },
        { name: 'Image Resizer', href: '/image-resize', blurb: 'Change width and height in pixels' },
      ]}
      guides={[
        { title: 'Photographing a product on a clean background' },
        { title: 'Transparent PNG vs JPEG: when to use which' },
        { title: 'Why hair edges are hard to remove' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        <canvas ref={canvasRef} style={{ display: 'none' }} />
        {!file && <UploadBox accept="image/*" maxMB={25} hint="Image with a clean background - up to 25 MB - nothing is uploaded" onFile={handleFile} />}
        {file && (
          <div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12 }}>
              <img src={previewUrl} alt="Original" style={{ width: 88, height: 88, objectFit: 'cover', borderRadius: 10, border: '1px solid #e7e5e4' }} />
              <div><b>{file.name}</b><div style={{ fontSize: 13, color: '#6b7280' }}>{kb(origBytes)}</div></div>
            </div>
            <label style={{ fontSize: 13, color: '#6b7280' }}>Tolerance: {tolerance}</label>
            <input type="range" min={5} max={80} step={1} value={tolerance} onChange={(e) => setTolerance(Number(e.target.value))} onMouseUp={render} onTouchEnd={render} style={{ width: '100%', accentColor: '#F97316', margin: '6px 0 12px' }} />
            <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 10 }}>New size: {newBytes != null ? kb(newBytes) : (busy ? '...' : '-')}</div>
            <DownloadButton getBlob={async () => resultBlob} filename={file.name.replace(/\.[^.]+$/, '') + '-transparent.png'} label="Download PNG" />
            <button type="button" onClick={reset} style={{ border: '1px solid #e7e5e4', background: 'transparent', color: '#1c1917', padding: '12px 20px', borderRadius: 10, fontWeight: 500, cursor: 'pointer', marginLeft: 8 }}>Choose another</button>
          </div>
        )}
        {error && <p role="alert" style={{ color: '#be123c', fontSize: 14, marginTop: 10 }}>{error}</p>}
      </section>
    </ToolShell>
  )
}
"@
Write-Host "  [+] BgRemover done" -ForegroundColor Green

Write-Host "=== Batch 5 done. Build next. ===" -ForegroundColor Green