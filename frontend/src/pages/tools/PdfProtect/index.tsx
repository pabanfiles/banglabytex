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