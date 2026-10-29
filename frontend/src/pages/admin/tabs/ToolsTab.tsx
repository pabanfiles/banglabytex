import { useEffect, useState } from 'react'
import { card, h2, btn, btnP, btnSm, input, label, note, pill } from '../ui'

type Tool = { slug: string; name: string; url: string }

const TOOLS: Tool[] = [
  { slug: 'image-compress', name: 'Image Compressor', url: '/image-compress' },
  { slug: 'image-resize', name: 'Image Resizer', url: '/image-resize' },
  { slug: 'image-convert', name: 'Image Converter', url: '/image-convert' },
  { slug: 'image-crop', name: 'Image Cropper', url: '/image-crop' },
  { slug: 'qr-code-gen', name: 'QR Generator', url: '/qr-code-gen' },
  { slug: 'pdf-merge', name: 'Merge PDF', url: '/pdf-merge' },
  { slug: 'pdf-split', name: 'Split PDF', url: '/pdf-split' },
  { slug: 'pdf-compress', name: 'Compress PDF', url: '/pdf-compress' },
  { slug: 'age-calculator', name: 'Age Calculator', url: '/age-calculator' },
  { slug: 'percentage-calc', name: 'Percentage Calculator', url: '/percentage-calc' },
  { slug: 'code-runner', name: 'Code Runner', url: '/code-runner' },
]

export default function ToolsTab() {
  const [current, setCurrent] = useState<Tool>(TOOLS[0])
  const [title, setTitle] = useState('')
  const [meta, setMeta] = useState('')
  const [faqs, setFaqs] = useState<{ q: string; a: string }[]>([])
  const [loaded, setLoaded] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setLoaded(false); setSaved(false)
    fetch('/api/tools?slug=' + current.slug).then((r) => r.json()).then((d) => {
      setTitle(d?.h1_title || current.name)
      setMeta(d?.meta_desc || '')
      setFaqs(Array.isArray(d?.faq_json) ? d.faq_json : (typeof d?.faq_json === 'string' ? JSON.parse(d.faq_json) : []))
    }).catch(() => {
      setTitle(current.name); setMeta(''); setFaqs([])
    }).finally(() => setLoaded(true))
  }, [current])

  const addFaq = () => setFaqs([...faqs, { q: 'New question?', a: '' }])
  const editFaq = (i: number) => {
    const q = prompt('Question:', faqs[i].q); if (q === null) return
    const a = prompt('Answer (40 to 100 words):', faqs[i].a); if (a === null) return
    const copy = [...faqs]; copy[i] = { q, a }; setFaqs(copy)
  }
  const delFaq = (i: number) => setFaqs(faqs.filter((_, k) => k !== i))
  const move = (i: number, d: -1 | 1) => {
    const j = i + d; if (j < 0 || j >= faqs.length) return
    const copy = [...faqs]; const t = copy[i]; copy[i] = copy[j]; copy[j] = t; setFaqs(copy)
  }

  const save = async () => {
    try {
      const res = await fetch('/api/tools', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ slug: current.slug, h1_title: title, meta_desc: meta, faq_json: faqs }) })
      if (!res.ok) throw new Error()
      setSaved(true); setTimeout(() => setSaved(false), 1600)
    } catch { alert('Could not save. The backend may be offline.') }
  }

  if (!loaded) return <div style={card}>Loading...</div>

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: 14 }}>
      <div style={card}>
        <h2 style={h2}>Tool page: {current.name}</h2>
        <label style={label}>Select tool
          <select value={current.slug} onChange={(e) => { const t = TOOLS.find((x) => x.slug === e.target.value); if (t) setCurrent(t) }} style={input}>
            {TOOLS.map((t) => <option key={t.slug} value={t.slug}>{t.name}</option>)}
          </select>
        </label>
        <label style={label}>H1 title<input value={title} onChange={(e) => setTitle(e.target.value)} style={input} /></label>
        <label style={label}>Meta description<input value={meta} onChange={(e) => setMeta(e.target.value)} style={input} /></label>
        <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
          <button onClick={save} style={btnP}>Save</button>
          {saved && <span style={{ color: '#15803D', fontSize: 13, padding: '8px 0' }}>Saved</span>}
          <a href={current.url} target="_blank" rel="noopener noreferrer" style={{ ...btn, textDecoration: 'none', display: 'inline-block' }}>Preview page</a>
        </div>
        <div style={note}>Each tool needs 15 to 20 unique FAQs, each answer 40 to 100 words. Auto-fix does not invent FAQ text.</div>
      </div>
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <h2 style={{ ...h2, margin: 0 }}>FAQs <span style={pill}>{faqs.length}</span></h2>
          <button onClick={addFaq} style={btnP}>Add question</button>
        </div>
        {faqs.length === 0 && <p style={{ color: '#6b7280', fontSize: 13 }}>No FAQs yet. Click Add question.</p>}
        {faqs.map((f, i) => (
          <div key={i} style={{ padding: 10, borderBottom: '1px dashed #e7e5e4' }}>
            <b style={{ display: 'block', fontSize: 13 }}>{i + 1}. {f.q}</b>
            <div style={{ color: '#6b7280', fontSize: 13, margin: '4px 0 8px' }}>{f.a}</div>
            <div style={{ display: 'flex', gap: 6 }}>
              <button onClick={() => move(i, -1)} style={btnSm}>Up</button>
              <button onClick={() => move(i, 1)} style={btnSm}>Down</button>
              <button onClick={() => editFaq(i)} style={btnSm}>Edit</button>
              <button onClick={() => delFaq(i)} style={{ ...btnSm, color: '#B91C1C' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}