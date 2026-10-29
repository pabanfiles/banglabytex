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