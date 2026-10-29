import { useState } from 'react'
import ToolShell from '@/components/ToolShell'
import UploadBox from '@/components/UploadBox'

function kb(b: number) { return b < 1048576 ? (b / 1024).toFixed(0) + ' KB' : (b / 1048576).toFixed(2) + ' MB' }

export default function ImageToBase64() {
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [b64, setB64] = useState('')
  const [origBytes, setOrigBytes] = useState(0)
  const [copied, setCopied] = useState(false)
  const [error, setError] = useState('')

  const handleFile = (f: File) => {
    setError(''); setB64(''); setCopied(false)
    if (!f.type.startsWith('image/')) { setError('Please choose an image file.'); return }
    if (f.size > 5 * 1048576) { setError('For best results, keep the file under 5 MB.'); return }
    setOrigBytes(f.size)
    if (previewUrl) URL.revokeObjectURL(previewUrl)
    setPreviewUrl(URL.createObjectURL(f))
    const reader = new FileReader()
    reader.onload = () => { setB64(String(reader.result || '')); setFile(f) }
    reader.onerror = () => setError('Could not read the file.')
    reader.readAsDataURL(f)
  }

  const copy = async () => {
    try { await navigator.clipboard.writeText(b64); setCopied(true); setTimeout(() => setCopied(false), 1600) } catch {}
  }

  const reset = () => {
    setFile(null); setPreviewUrl(''); setB64(''); setOrigBytes(0); setError('')
    if (previewUrl) URL.revokeObjectURL(previewUrl)
  }

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What is Base64?', a: 'Base64 is a way to represent binary data as text using only letters, numbers, and a few symbols. It is used when a system needs to carry a file inside text, such as inside HTML, CSS, or JSON.' },
      { q: 'What does this tool do?', a: 'It reads an image file and outputs a Base64 data URL string. You can copy that string and paste it into CSS, HTML, or JSON without needing a separate image file.' },
      { q: 'Is it free?', a: 'Yes. No account is needed. The file is read in your browser and nothing is uploaded.' },
    ]},
    { heading: 'Using the output', items: [
      { q: 'Where can I use the string?', a: 'The most common place is in CSS for small icons and backgrounds, or inside HTML for inline images. It also fits in JSON payloads where a URL is not possible.' },
      { q: 'Why is the string bigger than the file?', a: 'Base64 uses about 4 characters to store 3 bytes, so the string is roughly 33 percent larger than the original file. This is fine for small images and expensive for large ones.' },
      { q: 'Can I decode the string back to an image?', a: 'Yes. The data URL starts with data:image/... and can be pasted into any browser address bar to view the image, or written to a file with the correct extension.' },
      { q: 'What size should I keep?', a: 'For CSS and inline use, keep the image under 100 KB. Larger images make pages heavy and slow to parse. For a payload you can go higher, but check the receiver size limit.' },
    ]},
    { heading: 'Privacy and troubleshooting', items: [
      { q: 'Is my image uploaded?', a: 'No. The image is read locally by your browser. It is never sent to a server.' },
      { q: 'Why is the copy button not working?', a: 'Some browsers block clipboard access on insecure pages. Use localhost or HTTPS, or select the text manually and copy it.' },
      { q: 'What format is the string?', a: 'It is a data URL such as data:image/png;base64,.... The prefix tells the browser how to display the image.' },
      { q: 'Can I convert the string back to a file?', a: 'Yes. Paste the data URL into a browser tab to view it, or use any Base64 decoder to save it as a file.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to convert an image to Base64</h2>
      <ol>
        <li>Tap the box and choose an image.</li>
        <li>The tool reads the file and shows the Base64 string.</li>
        <li>Copy the string and paste it into your CSS, HTML, or JSON.</li>
      </ol>
      <h2>Why use Base64</h2>
      <p>Base64 lets you carry a file inside text. It is useful when a system cannot load an external URL, or when you want a single file to contain everything it needs. Small icons in CSS are a common example.</p>
      <h2>Limits and trade-offs</h2>
      <p>Base64 makes the data about 33 percent larger, so use it for small assets. For large images, a normal file URL is smaller and caches better.</p>
      <h2>Privacy and data</h2>
      <p>The file is read in your browser. Nothing is uploaded. When you close the tab, the string and the file are gone.</p>
    </>
  )

  return (
    <ToolShell
      title="Image to Base64 Converter Online Free | PPM Creator"
      description="Convert an image file to a Base64 data URL online for free. Copy the string for CSS, HTML, or JSON. Files stay in your browser."
      path="/image-to-base64"
      crumb={[{ label: 'Image Tools', to: '/image-tools' }]}
      h1="Image to Base64: Turn an Image into Text"
      lead="Upload an image and copy the Base64 string. Useful for CSS icons and inline data."
      faqGroups={faqGroups}
      related={[
        { name: 'Image Compressor', href: '/image-compress', blurb: 'Reduce file size at a chosen quality' },
        { name: 'Image Converter', href: '/image-convert', blurb: 'Change JPG, PNG and WebP formats' },
        { name: 'Favicon Generator', href: '/favicon-generator', blurb: 'Make favicons from one image' },
        { name: 'QR Code Generator', href: '/qr-code-gen', blurb: 'Create a QR code from a link' },
      ]}
      guides={[
        { title: 'When to use Base64 in CSS' },
        { title: 'Base64 size overhead explained' },
        { title: 'Decoding a data URL to a file' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        {!file && <UploadBox accept="image/*" maxMB={5} hint="Image file - up to 5 MB - nothing is uploaded" onFile={handleFile} />}
        {file && (
          <div>
            <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12 }}>
              <img src={previewUrl} alt="Preview" style={{ width: 88, height: 88, objectFit: 'cover', borderRadius: 10, border: '1px solid #e7e5e4' }} />
              <div>
                <b>{file.name}</b>
                <div style={{ fontSize: 13, color: '#6b7280' }}>{kb(origBytes)}</div>
              </div>
            </div>
            <textarea readOnly value={b64} rows={10} style={{ width: '100%', fontFamily: 'monospace', fontSize: 12, padding: 12, border: '1px solid #e7e5e4', borderRadius: 10, background: '#fff', wordBreak: 'break-all' }} />
            <div style={{ marginTop: 10 }}>
              <button type="button" onClick={copy} style={{ border: 0, padding: '12px 20px', borderRadius: 10, background: '#F97316', color: '#fff', fontWeight: 600, cursor: 'pointer', marginRight: 8 }}>{copied ? 'Copied' : 'Copy Base64'}</button>
              <button type="button" onClick={reset} style={{ border: '1px solid #e7e5e4', padding: '12px 20px', borderRadius: 10, background: 'transparent', color: '#1c1917', fontWeight: 500, cursor: 'pointer' }}>Choose another</button>
            </div>
          </div>
        )}
        {error && <p role="alert" style={{ color: '#be123c', fontSize: 14, marginTop: 10 }}>{error}</p>}
      </section>
    </ToolShell>
  )
}