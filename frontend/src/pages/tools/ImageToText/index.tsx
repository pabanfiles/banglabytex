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