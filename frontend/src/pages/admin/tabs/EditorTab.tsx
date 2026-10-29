import { useEffect, useRef, useState } from 'react'
import { card, h2, btn, btnP, btnSm, input, label, note, scoreColour } from '../ui'
import { DEMO_POST_DETAIL } from '../demoData'

type C = { id: string; t: string; s: 'PASS' | 'WARN' | 'FAIL'; f: string; fix?: 'yes' | 'outline' | 'faq' | 'none' }

function calc(p: { title: string; slug: string; body: string; kw: string; mt: string; md: string }): { list: C[]; score: number } {
  const words = (p.body.match(/[A-Za-z0-9']+/g) || []).length
  const k = p.kw.trim().toLowerCase()
  const first = p.body.split(/\s+/).slice(0, 100).join(' ').toLowerCase()
  const h2s = p.body.match(/^## .+$/gm) || []
  const links = (p.body.match(/\]\(\/[^)]*\)/g) || []).length
  const ext = (p.body.match(/\]\(https?:\/\/[^)]*\)/g) || []).length
  const faqN = (p.body.match(/^Q: .+$/gm) || []).length
  const sent = p.body.split(/[.!?]/).filter((s) => s.trim()).length || 1
  const avg = Math.round(words / sent)
  const list: C[] = [
    { id: 'kw-title', t: 'Keyword is in the title', s: k && p.title.toLowerCase().includes(k) ? 'PASS' : 'FAIL', f: 'Add the keyword to the title.', fix: 'yes' },
    { id: 'kw-mt', t: 'Keyword is in the meta title', s: k && p.mt.toLowerCase().includes(k) ? 'PASS' : 'FAIL', f: 'Add the keyword to the meta title.', fix: 'yes' },
    { id: 'mt-len', t: 'Meta title 60 chars or less', s: p.mt.length <= 60 && p.mt.length > 0 ? 'PASS' : p.mt ? 'WARN' : 'FAIL', f: 'Set a meta title of 60 chars or less (' + p.mt.length + ' now).', fix: 'yes' },
    { id: 'kw-md', t: 'Keyword is in meta description', s: k && p.md.toLowerCase().includes(k) ? 'PASS' : 'FAIL', f: 'Add the keyword to the meta description.', fix: 'yes' },
    { id: 'md-len', t: 'Meta description 70-155 chars', s: p.md.length >= 70 && p.md.length <= 155 ? 'PASS' : p.md ? 'WARN' : 'FAIL', f: 'Use 70 to 155 chars (' + p.md.length + ' now).', fix: 'yes' },
    { id: 'slug', t: 'Keyword is in the URL slug', s: k && p.slug.includes(k.replace(/\s+/g, '-')) ? 'PASS' : 'WARN', f: 'Make the slug from the keyword.', fix: 'yes' },
    { id: 'first', t: 'Keyword is in the first 100 words', s: k && first.includes(k) ? 'PASS' : 'FAIL', f: 'Add a sentence with the keyword to the opening.', fix: 'yes' },
    { id: 'h2', t: 'Keyword is in an H2 heading', s: k && h2s.some((h) => h.toLowerCase().includes(k)) ? 'PASS' : 'WARN', f: 'Add an H2 heading with the keyword.', fix: 'yes' },
    { id: 'words', t: 'Body is 600 words or more', s: words >= 600 ? 'PASS' : words >= 300 ? 'WARN' : 'FAIL', f: 'Currently ' + words + ' words. Write more. Auto-fix adds section outlines only.', fix: 'outline' },
    { id: 'int', t: 'At least 2 internal links', s: links >= 2 ? 'PASS' : links >= 1 ? 'WARN' : 'FAIL', f: 'Currently ' + links + '. Add links to tools or posts.', fix: 'yes' },
    { id: 'ext', t: 'At least 1 trusted external link', s: ext >= 1 ? 'PASS' : 'WARN', f: 'Add a link to an official or trusted source.', fix: 'none' },
    { id: 'faq', t: 'At least 3 FAQ questions', s: faqN >= 3 ? 'PASS' : faqN >= 1 ? 'WARN' : 'FAIL', f: 'Currently ' + faqN + '. Auto-fix adds 3 question prompts.', fix: 'faq' },
    { id: 'sent', t: 'Average sentence under 20 words', s: avg < 20 ? 'PASS' : 'WARN', f: 'Average ' + avg + ' words. Shorten long sentences.', fix: 'none' },
  ]
  const pts = list.reduce((a, x) => a + (x.s === 'PASS' ? 1 : x.s === 'WARN' ? 0.5 : 0), 0)
  return { list, score: Math.round((pts / list.length) * 100) }
}

function fileToDataUrl(f: File): Promise<string> {
  return new Promise((res, rej) => { const r = new FileReader(); r.onload = () => res(String(r.result || '')); r.onerror = rej; r.readAsDataURL(f) })
}

export default function EditorTab({ id, onBack, onSaved }: { id: number | null; onBack: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [body, setBody] = useState('')
  const [kw, setKw] = useState('')
  const [mt, setMt] = useState('')
  const [md, setMd] = useState('')
  const [excerpt, setExcerpt] = useState('')
  const [thumbnail, setThumbnail] = useState('')
  const [saving, setSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [demo, setDemo] = useState(false)
  const [uploading, setUploading] = useState(false)
  const coverRef = useRef<HTMLInputElement>(null)
  const bodyImgRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (id) {
      fetch('/api/posts?id=' + id, { credentials: 'include' }).then((r) => r.json()).then((p) => {
        if (!p || !p.title) throw new Error()
        setTitle(p.title || ''); setSlug(p.slug || ''); setBody(p.content || '')
        setKw(p.meta_title || ''); setMt(p.meta_title || ''); setMd(p.meta_description || '')
        setExcerpt(p.excerpt || ''); setThumbnail(p.thumbnail || '')
      }).catch(() => {
        setTitle(DEMO_POST_DETAIL.title); setSlug(DEMO_POST_DETAIL.slug); setBody(DEMO_POST_DETAIL.content); setKw(DEMO_POST_DETAIL.meta_title); setMt(DEMO_POST_DETAIL.meta_title); setMd(DEMO_POST_DETAIL.meta_description); setDemo(true)
      }).finally(() => setLoaded(true))
    } else setLoaded(true)
  }, [id])

  const seo = calc({ title, slug, body, kw, mt, md })

  const uploadImage = async (file: File): Promise<string> => {
    setUploading(true)
    try {
      const data_url = await fileToDataUrl(file)
      const r = await fetch('/api/upload', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ data_url }) })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'upload failed')
      return d.url
    } finally { setUploading(false) }
  }

  const onCover = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return
    if (f.size > 2 * 1024 * 1024) { alert('Cover image must be under 2 MB.'); return }
    try { const url = await uploadImage(f); setThumbnail(url) }
    catch { alert('Upload failed.') }
    if (coverRef.current) coverRef.current.value = ''
  }

  const onBodyImage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]; if (!f) return
    if (f.size > 2 * 1024 * 1024) { alert('Image must be under 2 MB.'); return }
    try { const url = await uploadImage(f); setBody(body + '\n\n![' + (f.name.split('.')[0] || 'image') + '](' + url + ')\n\n') }
    catch { alert('Upload failed.') }
    if (bodyImgRef.current) bodyImgRef.current.value = ''
  }

  const save = async (nextStatus: string) => {
    setSaving(true)
    try {
      const r = await fetch('/api/posts', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, title, slug, content: body, excerpt, thumbnail, status: nextStatus, meta_title: mt, meta_description: md }) })
      if (!r.ok) throw new Error()
      onSaved()
    } catch { alert('Save failed. Check that the backend is deployed.') }
    finally { setSaving(false) }
  }

  const publish = () => { if (seo.score < 80 && !confirm('SEO checklist is at ' + seo.score + '%. Publish anyway?')) return; save('published') }
  const insertFaq = () => setBody(body + '\n\n## Frequently asked questions\n\nQ: Question one?\nA: Answer in your own words.\n\nQ: Question two?\nA: Answer in your own words.\n\nQ: Question three?\nA: Answer in your own words.')

  const fixOne = (cid: string) => {
    const k = kw.trim(); if (!k) { alert('Enter a focus keyword first.'); return }
    if (cid === 'kw-title' && !title.toLowerCase().includes(k.toLowerCase())) setTitle(k.charAt(0).toUpperCase() + k.slice(1) + ': ' + title)
    if ((cid === 'kw-mt' || cid === 'mt-len') && !mt.toLowerCase().includes(k.toLowerCase())) setMt(k.charAt(0).toUpperCase() + k.slice(1) + ' | PPM Creator')
    if ((cid === 'kw-md' || cid === 'md-len') && !md.toLowerCase().includes(k.toLowerCase())) setMd('Learn about ' + k + ' in a few simple steps. This guide explains what to expect and how to use the tool safely.')
    if (cid === 'slug') setSlug(k.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
    if (cid === 'first') setBody('Here is how to ' + k + ' in a few simple steps.\n\n' + body)
    if (cid === 'h2') setBody(body + '\n\n## About ' + k + '\n\nExplain ' + k + ' in your own words here.')
    if (cid === 'words') setBody(body + '\n\n## Section to write\n\nWrite about this point in your own words.\n\n## Another section to write\n\nWrite about this point in your own words.')
    if (cid === 'int') setBody(body + '\n\nRelated: [Image Compressor](/image-compress) and [Merge PDF](/pdf-merge).')
    if (cid === 'faq') insertFaq()
  }
  const fixAll = () => { ['kw-title', 'kw-mt', 'mt-len', 'kw-md', 'md-len', 'slug', 'first', 'h2', 'int'].forEach(fixOne) }

  if (!loaded) return <div style={card}>Loading...</div>

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.5fr) minmax(0, 1fr)', gap: 14 }}>
      <div style={card}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <h2 style={{ ...h2, margin: 0 }}>{id ? 'Edit post' : 'New post'}</h2>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={onBack} style={btn}>Back</button>
            <button onClick={() => save('draft')} disabled={saving} style={btn}>Save draft</button>
            <button onClick={publish} disabled={saving} style={btnP}>Publish</button>
          </div>
        </div>
        {demo && <div style={{ background: '#FFF7ED', borderRadius: 8, padding: '8px 11px', fontSize: 12, color: '#B45309', marginBottom: 12 }}>Sample content â€” real post loads when the database is connected.</div>}
        <label style={label}>Title<input value={title} onChange={(e) => setTitle(e.target.value)} style={input} /></label>
        <label style={label}>URL slug<input value={slug} onChange={(e) => setSlug(e.target.value)} style={input} /></label>

        <h3 style={{ fontSize: 14, margin: '10px 0 6px', fontWeight: 600 }}>Cover image</h3>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 12 }}>
          <input ref={coverRef} type="file" accept="image/*" onChange={onCover} style={{ display: 'none' }} />
          <button onClick={() => coverRef.current?.click()} disabled={uploading} style={btn}>{uploading ? 'Uploading...' : 'Choose cover image'}</button>
          {thumbnail && <img src={thumbnail} alt="Cover" style={{ height: 48, borderRadius: 8, border: '1px solid #e7e5e4' }} />}
          {thumbnail && <button onClick={() => setThumbnail('')} style={{ ...btnSm, color: '#B91C1C' }}>Remove</button>}
        </div>
        <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 12 }}>Image is stored as base64 in D1 (max 2 MB).</div>

        <label style={label}>Short summary<input value={excerpt} onChange={(e) => setExcerpt(e.target.value)} placeholder="One line shown on the blog list" style={input} /></label>

        <h3 style={{ fontSize: 14, margin: '10px 0 6px', fontWeight: 600 }}>Body</h3>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', padding: 6, border: '1px solid #e7e5e4', borderBottom: 0, borderRadius: '8px 8px 0 0', background: '#fafaf9' }}>
          <button onClick={() => setBody(body + '**text**')} style={btnSm}><b>B</b></button>
          <button onClick={() => setBody(body + '*text*')} style={btnSm}><i>I</i></button>
          <button onClick={() => setBody(body + '\n## Heading')} style={btnSm}>H2</button>
          <button onClick={() => setBody(body + '\n### Sub')} style={btnSm}>H3</button>
          <button onClick={() => setBody(body + '\n- item')} style={btnSm}>List</button>
          <input ref={bodyImgRef} type="file" accept="image/*" onChange={onBodyImage} style={{ display: 'none' }} />
          <button onClick={() => bodyImgRef.current?.click()} disabled={uploading} style={btnSm}>Image</button>
          <button onClick={insertFaq} style={btnSm}>FAQ</button>
        </div>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={16} placeholder="Write your post here. Use the toolbar above." style={{ ...input, borderRadius: '0 0 8px 8px', marginTop: 0, fontFamily: 'ui-monospace, Consolas, monospace', fontSize: 13, lineHeight: 1.6 }} />
      </div>
      <div style={card}>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12 }}>
          <div style={{ width: 64, height: 64, borderRadius: '50%', background: scoreColour(seo.score), color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18, fontWeight: 700 }}>{seo.score}%</div>
          <div><h2 style={{ ...h2, margin: 0 }}>SEO checklist</h2><small style={{ color: '#6b7280' }}>A writing checklist, not a ranking guarantee.</small></div>
        </div>
        <label style={label}>Focus keyword<input value={kw} onChange={(e) => setKw(e.target.value)} placeholder="e.g. compress PDF" style={input} /></label>
        <label style={label}>Meta title (max 60)<input value={mt} onChange={(e) => setMt(e.target.value)} style={input} /></label>
        <label style={label}>Meta description (max 155)<input value={md} onChange={(e) => setMd(e.target.value)} style={input} /></label>
        <button onClick={fixAll} style={{ ...btnP, marginBottom: 10 }}>Apply all suggested fixes</button>
        <div style={note}>Auto-fix adds structure and prompts. It does not write real article content or pick real sources for you.</div>
        <div style={{ marginTop: 12 }}>
          {seo.list.map((c) => (
            <div key={c.id} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', padding: '10px 0', borderBottom: '1px dashed #e7e5e4' }}>
              <span style={{ flex: 'none', fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 6, minWidth: 58, textAlign: 'center', background: c.s === 'PASS' ? '#DCFCE7' : c.s === 'WARN' ? '#FEF3C7' : '#FEE2E2', color: c.s === 'PASS' ? '#14532D' : c.s === 'WARN' ? '#78350F' : '#7F1D1D' }}>{c.s === 'PASS' ? 'OK' : c.s === 'WARN' ? 'Check' : 'Fix'}</span>
              <div style={{ flex: 1 }}><div style={{ fontSize: 13, fontWeight: 500 }}>{c.t}</div><small style={{ color: '#6b7280' }}>{c.f}</small></div>
              {c.s !== 'PASS' && c.fix !== 'none' && <button onClick={() => fixOne(c.id)} style={btnSm}>{c.fix === 'outline' ? 'Add outline' : c.fix === 'faq' ? 'Add FAQ' : 'Fix'}</button>}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}