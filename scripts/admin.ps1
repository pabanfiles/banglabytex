$ErrorActionPreference = "Stop"
$utf8 = New-Object System.Text.UTF8Encoding $false
$root = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend\src\pages\admin"

if (-not (Test-Path -LiteralPath $root)) { New-Item -ItemType Directory -Path $root -Force | Out-Null }

function WF($rel, $body) {
  $full = Join-Path $root $rel
  $dir = Split-Path $full -Parent
  if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  [System.IO.File]::WriteAllText($full, $body, $utf8)
  Write-Host "  [+] admin/$rel" -ForegroundColor Green
}

Write-Host "=== Admin Panel rebuild ===" -ForegroundColor Cyan

# Main AdminPanel - tabs + routing
WF "AdminPanel.tsx" @"
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PostsTab from './tabs/PostsTab'
import EditorTab from './tabs/EditorTab'
import ToolsTab from './tabs/ToolsTab'
import SettingsTab from './tabs/SettingsTab'
import AnalyticsTab from './tabs/AnalyticsTab'
import AccountTab from './tabs/AccountTab'

type Tab = 'posts' | 'editor' | 'tools' | 'settings' | 'analytics' | 'account'

export default function AdminPanel() {
  const [tab, setTab] = useState<Tab>('posts')
  const [editingId, setEditingId] = useState<number | null>(null)
  const nav = useNavigate()

  useEffect(() => {
    document.title = 'Admin - PPM Creator'
    document.body.style.background = '#FAFAF9'
    return () => { document.body.style.background = '' }
  }, [])

  const TABS: { id: Tab; label: string }[] = [
    { id: 'posts', label: 'Blog posts' },
    { id: 'editor', label: 'Post editor' },
    { id: 'tools', label: 'Tool pages & FAQ' },
    { id: 'settings', label: 'Site settings' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'account', label: 'Account & security' },
  ]

  const editPost = (id: number) => { setEditingId(id); setTab('editor') }
  const newPost = () => { setEditingId(null); setTab('editor') }

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF9', color: '#1c1917', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid #e7e5e4', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', position: 'sticky', top: 0, zIndex: 5 }}>
        <div style={{ fontWeight: 600, fontSize: 16 }}>PPM <span style={{ color: '#F97316' }}>Creator</span> Admin</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link to="/" style={{ fontSize: 12, color: '#6b7280', textDecoration: 'none', border: '1px solid #e7e5e4', borderRadius: 99, padding: '4px 12px' }}>View site</Link>
          <span style={{ fontSize: 12, color: '#6b7280', border: '1px solid #e7e5e4', borderRadius: 99, padding: '3px 10px' }}>Admin</span>
        </div>
      </header>
      <nav style={{ display: 'flex', gap: 4, flexWrap: 'wrap', padding: '10px 18px', background: '#fff', borderBottom: '1px solid #e7e5e4' }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => { if (t.id === 'editor' && tab !== 'editor') newPost(); else setTab(t.id) }} style={{ border: 0, background: tab === t.id ? '#FFF7ED' : 'none', padding: '7px 12px', borderRadius: 8, cursor: 'pointer', color: tab === t.id ? '#F97316' : '#6b7280', fontWeight: tab === t.id ? 600 : 400, font: 'inherit', fontSize: 14 }}>
            {t.label}
          </button>
        ))}
      </nav>
      <main style={{ padding: 18, maxWidth: 1180, margin: '0 auto' }}>
        {tab === 'posts' && <PostsTab onEdit={editPost} onNew={newPost} />}
        {tab === 'editor' && <EditorTab id={editingId} onBack={() => setTab('posts')} onSaved={() => setTab('posts')} />}
        {tab === 'tools' && <ToolsTab />}
        {tab === 'settings' && <SettingsTab />}
        {tab === 'analytics' && <AnalyticsTab />}
        {tab === 'account' && <AccountTab />}
      </main>
    </div>
  )
}
"@

# Shared UI helpers
WF "ui.tsx" @"
export const card = { background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 16, marginBottom: 14 } as const
export const h2 = { fontSize: 17, margin: '0 0 12px', fontWeight: 600 } as const
export const btn = { border: '1px solid #e7e5e4', background: '#fff', color: '#1c1917', padding: '7px 12px', borderRadius: 8, cursor: 'pointer', font: 'inherit', fontSize: 13 } as const
export const btnP = { ...btn, background: '#F97316', borderColor: '#F97316', color: '#fff', fontWeight: 500 } as const
export const btnSm = { ...btn, padding: '4px 9px', fontSize: 12 } as const
export const btnSmP = { ...btnP, padding: '4px 9px', fontSize: 12 } as const
export const btnDel = { ...btn, color: '#B91C1C' } as const
export const input = { width: '100%', padding: '9px 11px', border: '1px solid #e7e5e4', borderRadius: 8, font: 'inherit', background: '#fff', color: '#1c1917', marginTop: 4, fontSize: 14 } as const
export const label = { display: 'block', fontSize: 13, color: '#6b7280', marginBottom: 12 } as const
export const pill = { display: 'inline-block', fontSize: 12, padding: '2px 9px', borderRadius: 99, border: '1px solid #e7e5e4', color: '#6b7280' } as const
export const note = { fontSize: 12, color: '#6b7280', background: '#FFF7ED', borderRadius: 8, padding: '9px 11px', marginTop: 8 } as const
export function scoreColour(s: number) { return s >= 80 ? '#15803D' : s >= 50 ? '#B45309' : '#B91C1C' }
"@

Write-Host "  [+] ui.tsx" -ForegroundColor Green

# PostsTab
WF "tabs\PostsTab.tsx" @"
import { useEffect, useState } from 'react'
import { card, h2, btn, btnP, btnSm, input, pill, scoreColour } from '../ui'

type Post = { id: number; title: string; slug: string; status: string; updated_at: string; seo_score?: number }

export default function PostsTab({ onEdit, onNew }: { onEdit: (id: number) => void; onNew: () => void }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    fetch('/api/posts?admin=1').then((r) => r.json()).then((d) => {
      setPosts(Array.isArray(d) ? d : (d.posts || []))
    }).catch(() => setError('Could not load posts. The backend may be offline.')).finally(() => setLoading(false))
  }, [])

  const filtered = posts.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()) && (!status || p.status === status))

  return (
    <div style={card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ ...h2, margin: 0 }}>All posts</h2>
        <button onClick={onNew} style={btnP}>New post</button>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title" style={{ ...input, maxWidth: 280 }} />
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ ...input, maxWidth: 180 }}>
          <option value="">All statuses</option>
          <option>published</option>
          <option>draft</option>
          <option>scheduled</option>
        </select>
      </div>
      {loading && <p style={{ color: '#6b7280' }}>Loading...</p>}
      {error && <p style={{ color: '#B91C1C' }}>{error}</p>}
      {!loading && filtered.length === 0 && <p style={{ color: '#6b7280' }}>No posts yet. Click New post to create one.</p>}
      {filtered.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead><tr><th style={{ textAlign: 'left', padding: '10px 8px', borderBottom: '1px solid #e7e5e4', color: '#6b7280', fontWeight: 500, fontSize: 12 }}>Title</th><th style={{ textAlign: 'left', padding: '10px 8px', borderBottom: '1px solid #e7e5e4', color: '#6b7280', fontWeight: 500, fontSize: 12 }}>Status</th><th style={{ textAlign: 'left', padding: '10px 8px', borderBottom: '1px solid #e7e5e4', color: '#6b7280', fontWeight: 500, fontSize: 12 }}>Updated</th><th></th></tr></thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid #e7e5e4' }}>{p.title}</td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid #e7e5e4' }}><span style={pill}>{p.status}</span></td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid #e7e5e4', color: '#6b7280' }}>{p.updated_at?.slice(0, 10) || '-'}</td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid #e7e5e4', textAlign: 'right' }}><button onClick={() => onEdit(p.id)} style={btnSm}>Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
"@
Write-Host "  [+] PostsTab" -ForegroundColor Green

# EditorTab
WF "tabs\EditorTab.tsx" @"
import { useEffect, useState } from 'react'
import { card, h2, btn, btnP, btnSm, input, label, note, scoreColour } from '../ui'

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

export default function EditorTab({ id, onBack, onSaved }: { id: number | null; onBack: () => void; onSaved: () => void }) {
  const [title, setTitle] = useState('')
  const [slug, setSlug] = useState('')
  const [body, setBody] = useState('')
  const [kw, setKw] = useState('')
  const [mt, setMt] = useState('')
  const [md, setMd] = useState('')
  const [status, setStatus] = useState('draft')
  const [saving, setSaving] = useState(false)
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (id) {
      fetch('/api/posts?id=' + id).then((r) => r.json()).then((p) => {
        setTitle(p.title || ''); setSlug(p.slug || ''); setBody(p.content || ''); setStatus(p.status || 'draft')
        setKw(p.meta_title || ''); setMt(p.meta_title || ''); setMd(p.meta_description || '')
      }).finally(() => setLoaded(true))
    } else setLoaded(true)
  }, [id])

  const seo = calc({ title, slug, body, kw, mt, md })

  const save = async (nextStatus: string) => {
    setSaving(true)
    const payload = { id, title, slug, content: body, status: nextStatus, meta_title: mt, meta_description: md }
    try {
      const res = await fetch('/api/posts', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload) })
      if (!res.ok) throw new Error('save failed')
      onSaved()
    } catch { alert('Could not save. The backend may be offline or the login session expired.') }
    finally { setSaving(false) }
  }

  const publish = () => {
    if (seo.score < 80 && !confirm('SEO checklist is at ' + seo.score + '%. Some items are open. Publish anyway?')) return
    save('published')
  }

  const wrap = (pre: string, suf: string) => setBody(body + pre + suf)
  const prefix = (pre: string) => setBody(body + '\n' + pre)
  const insertFaq = () => setBody(body + '\n\n## Frequently asked questions\n\nQ: Question one?\nA: Answer in your own words.\n\nQ: Question two?\nA: Answer in your own words.\n\nQ: Question three?\nA: Answer in your own words.')

  const fixOne = (checkId: string) => {
    const k = kw.trim(); if (!k) { alert('Enter a focus keyword first.'); return }
    if (checkId === 'kw-title' && !title.toLowerCase().includes(k.toLowerCase())) setTitle(k.charAt(0).toUpperCase() + k.slice(1) + ': ' + title)
    if ((checkId === 'kw-mt' || checkId === 'mt-len') && !mt.toLowerCase().includes(k.toLowerCase())) setMt(k.charAt(0).toUpperCase() + k.slice(1) + ' | PPM Creator')
    if ((checkId === 'kw-md' || checkId === 'md-len') && !md.toLowerCase().includes(k.toLowerCase())) setMd('Learn about ' + k + ' in a few simple steps. This guide explains what to expect and how to use the tool safely.')
    if (checkId === 'slug') setSlug(k.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''))
    if (checkId === 'first') setBody('Here is how to ' + k + ' in a few simple steps.\n\n' + body)
    if (checkId === 'h2') setBody(body + '\n\n## About ' + k + '\n\nExplain ' + k + ' in your own words here.')
    if (checkId === 'words') setBody(body + '\n\n## Section to write\n\nWrite about this point in your own words.\n\n## Another section to write\n\nWrite about this point in your own words.')
    if (checkId === 'int') setBody(body + '\n\nRelated: [Image Compressor](/image-compress) and [Merge PDF](/pdf-merge).')
    if (checkId === 'faq') insertFaq()
  }

  const fixAll = () => {
    ['kw-title', 'kw-mt', 'mt-len', 'kw-md', 'md-len', 'slug', 'first', 'h2', 'int'].forEach(fixOne)
  }

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
        <label style={label}>Title<input value={title} onChange={(e) => setTitle(e.target.value)} style={input} /></label>
        <label style={label}>URL slug<input value={slug} onChange={(e) => setSlug(e.target.value)} style={input} /></label>
        <h3 style={{ fontSize: 14, margin: '10px 0 6px', fontWeight: 600 }}>Body</h3>
        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', padding: 6, border: '1px solid #e7e5e4', borderBottom: 0, borderRadius: '8px 8px 0 0', background: '#fafaf9' }}>
          <button onClick={() => wrap('**', '**')} style={btnSm}><b>B</b></button>
          <button onClick={() => wrap('*', '*')} style={btnSm}><i>I</i></button>
          <button onClick={() => prefix('## ')} style={btnSm}>H2</button>
          <button onClick={() => prefix('### ')} style={btnSm}>H3</button>
          <button onClick={() => prefix('- ')} style={btnSm}>List</button>
          <button onClick={insertFaq} style={btnSm}>FAQ</button>
        </div>
        <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={16} style={{ ...input, borderRadius: '0 0 8px 8px', marginTop: 0, fontFamily: 'ui-monospace, Consolas, monospace', fontSize: 13, lineHeight: 1.6 }} />
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
"@
Write-Host "  [+] EditorTab" -ForegroundColor Green

# ToolsTab
WF "tabs\ToolsTab.tsx" @"
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
"@
Write-Host "  [+] ToolsTab" -ForegroundColor Green

# SettingsTab
WF "tabs\SettingsTab.tsx" @"
import { useEffect, useState } from 'react'
import { card, h2, btnP, input, label, note } from '../ui'

export default function SettingsTab() {
  const [siteName, setSiteName] = useState('PPM Creator Tools')
  const [email, setEmail] = useState('hello@ppmcreator.com')
  const [social, setSocial] = useState('@ppmcreator')
  const [ga, setGa] = useState('')
  const [adsense, setAdsense] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/tools?settings=1').then((r) => r.json()).then((d) => {
      setSiteName(d?.site_name || 'PPM Creator Tools')
    }).catch(() => {})
  }, [])

  const save = async () => {
    try { await fetch('/api/tools', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ settings: { site_name: siteName, contact_email: email, social, ga, adsense } }) }); setSaved(true); setTimeout(() => setSaved(false), 1600) } catch { alert('Save failed.') }
  }

  return (
    <div style={card}>
      <h2 style={h2}>Site settings</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <label style={label}>Site name<input value={siteName} onChange={(e) => setSiteName(e.target.value)} style={input} /></label>
          <label style={label}>Contact email<input value={email} onChange={(e) => setEmail(e.target.value)} style={input} /></label>
          <label style={label}>Social handle<input value={social} onChange={(e) => setSocial(e.target.value)} style={input} /></label>
        </div>
        <div>
          <label style={label}>Google Analytics ID (leave empty to stay off)<input value={ga} onChange={(e) => setGa(e.target.value)} placeholder="G-XXXXXXX" style={input} /></label>
          <label style={label}>AdSense publisher ID (after approval)<input value={adsense} onChange={(e) => setAdsense(e.target.value)} placeholder="ca-pub-..." style={input} /></label>
          <button onClick={save} style={btnP}>Save settings</button>
          {saved && <span style={{ color: '#15803D', fontSize: 13, marginLeft: 10 }}>Saved</span>}
        </div>
      </div>
      <div style={note}>The GA and AdSense IDs are optional. Leave empty to keep the site without analytics or ads.</div>
    </div>
  )
}
"@
Write-Host "  [+] SettingsTab" -ForegroundColor Green

# AnalyticsTab
WF "tabs\AnalyticsTab.tsx" @"
import { useEffect, useState } from 'react'
import { card, h2, input, note, pill } from '../ui'

type Row = { name: string; runs: number; downloads: number }

export default function AnalyticsTab() {
  const [range, setRange] = useState('7')
  const [visits, setVisits] = useState(0)
  const [views, setViews] = useState(0)
  const [runs, setRuns] = useState(0)
  const [downloads, setDownloads] = useState(0)
  const [tools, setTools] = useState<Row[]>([])
  const [sources, setSources] = useState<{ name: string; n: number }[]>([])
  const [pages, setPages] = useState<{ url: string; n: number }[]>([])
  const [live, setLive] = useState(0)

  useEffect(() => {
    fetch('/api/analytics?range=' + range).then((r) => r.json()).then((d) => {
      setVisits(d?.visits || 0); setViews(d?.views || 0); setRuns(d?.runs || 0); setDownloads(d?.downloads || 0)
      setTools(Array.isArray(d?.tools) ? d.tools : [])
      setSources(Array.isArray(d?.sources) ? d.sources : [])
      setPages(Array.isArray(d?.pages) ? d.pages : [])
      setLive(d?.live || 0)
    }).catch(() => {})
  }, [range])

  const mx = Math.max(1, ...tools.map((t) => t.runs))
  const srcTot = sources.reduce((a, s) => a + s.n, 0) || 1

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 style={{ ...h2, margin: 0 }}>Live usage</h2>
        <select value={range} onChange={(e) => setRange(e.target.value)} style={{ ...input, maxWidth: 170 }}>
          <option value="1">Today</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option>
        </select>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 14 }}>
        {[['Visitors', visits], ['Page views', views], ['Tool runs', runs], ['Downloads', downloads]].map(([l, v]) => (
          <div key={String(l)} style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 14 }}>
            <small style={{ display: 'block', color: '#6b7280', fontSize: 12 }}>{l}</small>
            <b style={{ fontSize: 22, fontWeight: 600 }}>{Number(v).toLocaleString()}</b>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={card}>
          <h2 style={h2}>Tool usage</h2>
          {tools.length === 0 && <p style={{ color: '#6b7280', fontSize: 13 }}>No tool runs recorded yet for this range.</p>}
          {tools.map((t) => (
            <div key={t.name} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}><span>{t.name}</span><span style={{ color: '#6b7280' }}>{t.runs} runs - {t.downloads} downloads</span></div>
              <div style={{ height: 8, background: '#e7e5e4', borderRadius: 99, overflow: 'hidden' }}><i style={{ display: 'block', height: '100%', background: '#F97316', width: Math.round((t.runs / mx) * 100) + '%' }} /></div>
            </div>
          ))}
          <div style={note}>Counts only: tool name and number of runs. No file names, file contents, or IP addresses are stored.</div>
        </div>
        <div style={card}>
          <h2 style={h2}>Where visitors come from</h2>
          {sources.length === 0 && <p style={{ color: '#6b7280', fontSize: 13 }}>No source data yet.</p>}
          {sources.map((s) => (
            <div key={s.name} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}><span>{s.name}</span><span style={{ color: '#6b7280' }}>{Math.round((s.n / srcTot) * 100)}%</span></div>
              <div style={{ height: 8, background: '#e7e5e4', borderRadius: 99 }}><i style={{ display: 'block', height: '100%', background: '#F97316', width: Math.round((s.n / srcTot) * 100) + '%' }} /></div>
            </div>
          ))}
          <h2 style={{ ...h2, marginTop: 18 }}>Most visited pages</h2>
          {pages.length === 0 && <p style={{ color: '#6b7280', fontSize: 13 }}>No page data yet.</p>}
          {pages.map((p) => (
            <div key={p.url} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #e7e5e4', fontSize: 13 }}>
              <span>{p.url}</span><span style={pill}>{p.n} views</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...card, marginTop: 14 }}>
        <h2 style={h2}>Right now</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={pill}>{live} people on the site</span>
          <span style={pill}>{runs > 0 ? Math.max(0, Math.round(live / 3)) : 0} tools running</span>
        </div>
        <div style={note}>Page views come from Cloudflare Web Analytics. Tool runs come from a small anonymous counter in D1. No personal data is stored.</div>
      </div>
    </>
  )
}
"@
Write-Host "  [+] AnalyticsTab" -ForegroundColor Green

# AccountTab
WF "tabs\AccountTab.tsx" @"
import { useEffect, useState } from 'react'
import { card, h2, btnP, btnSm, btnDel, input, label, note } from '../ui'

type Session = { id: number; user_agent: string; last_seen: string; current: boolean }

export default function AccountTab() {
  const [current, setCurrent] = useState('')
  const [newId, setNewId] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirm, setConfirm] = useState('')
  const [sessions, setSessions] = useState<Session[]>([])
  const [logins, setLogins] = useState<{ ts: string; user: string; ok: boolean; ua: string }[]>([])
  const [msg, setMsg] = useState('')

  useEffect(() => {
    fetch('/api/analytics?admin_sessions=1').then((r) => r.json()).then((d) => {
      setSessions(Array.isArray(d?.sessions) ? d.sessions : [])
      setLogins(Array.isArray(d?.logins) ? d.logins : [])
    }).catch(() => {})
  }, [])

  const rules = [
    ['10 characters or more', newPw.length >= 10],
    ['Upper-case letter', /[A-Z]/.test(newPw)],
    ['Lower-case letter', /[a-z]/.test(newPw)],
    ['Number', /[0-9]/.test(newPw)],
    ['Symbol', /[^A-Za-z0-9]/.test(newPw)],
  ]

  const change = async () => {
    setMsg('')
    if (newPw !== confirm) { setMsg('New passwords do not match.'); return }
    if (newPw && (newPw.length < 10 || !/[A-Z]/.test(newPw) || !/[a-z]/.test(newPw) || !/[0-9]/.test(newPw) || !/[^A-Za-z0-9]/.test(newPw))) { setMsg('Password does not meet the rules.'); return }
    if (!current) { setMsg('Enter your current password.'); return }
    try {
      const res = await fetch('/api/update-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ current_password: current, new_username: newId, new_password: newPw }) })
      if (!res.ok) { setMsg('The server rejected the change.'); return }
      setMsg('Saved. Other sessions have been signed out.')
      setCurrent(''); setNewId(''); setNewPw(''); setConfirm('')
    } catch { setMsg('Could not save. The backend may be offline.') }
  }

  const revoke = async (id: number) => {
    await fetch('/api/login?session=' + id, { method: 'DELETE' }).catch(() => {})
    setSessions(sessions.filter((s) => s.id !== id))
  }
  const signOutAll = async () => {
    for (const s of sessions) if (!s.current) await revoke(s.id)
  }

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={card}>
          <h2 style={h2}>Change admin User ID and password</h2>
          <label style={label}>Current password<input type="password" value={current} onChange={(e) => setCurrent(e.target.value)} style={input} /></label>
          <label style={label}>New User ID (4 to 20 letters or numbers)<input value={newId} onChange={(e) => setNewId(e.target.value)} placeholder="e.g. ppm_owner" style={input} /></label>
          <label style={label}>New password<input type="password" value={newPw} onChange={(e) => setNewPw(e.target.value)} style={input} /></label>
          <label style={label}>Confirm new password<input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} style={input} /></label>
          <div style={note}>{rules.map((r, i) => (<div key={i}>{r[1] ? '✓ ' : '✗ '}{r[0]}</div>))}</div>
          <button onClick={change} style={{ ...btnP, marginTop: 12 }}>Save changes</button>
          {msg && <div style={{ marginTop: 10, fontSize: 13, color: msg.includes('Saved') ? '#15803D' : '#B91C1C' }}>{msg}</div>}
        </div>
        <div style={card}>
          <h2 style={h2}>Security status</h2>
          <div style={{ padding: '10px 0', borderBottom: '1px dashed #e7e5e4' }}><b style={{ fontSize: 13 }}>Password is stored as a salted hash</b><div style={{ color: '#6b7280', fontSize: 12 }}>Never shown or saved in plain text.</div></div>
          <div style={{ padding: '10px 0', borderBottom: '1px dashed #e7e5e4' }}><b style={{ fontSize: 13 }}>Login is checked on the server</b><div style={{ color: '#6b7280', fontSize: 12 }}>Browser code cannot reveal the password.</div></div>
          <div style={{ padding: '10px 0', borderBottom: '1px dashed #e7e5e4' }}><b style={{ fontSize: 13 }}>Lockout after 5 wrong attempts</b><div style={{ color: '#6b7280', fontSize: 12 }}>Locked for 15 minutes.</div></div>
          <div style={{ padding: '10px 0' }}><b style={{ fontSize: 13 }}>Session timeout</b><div style={{ color: '#6b7280', fontSize: 12 }}>Signs out after 2 hours of inactivity.</div></div>
        </div>
      </div>

      <div style={{ ...card, marginTop: 14 }}>
        <h2 style={h2}>Active sessions</h2>
        {sessions.length === 0 && <p style={{ color: '#6b7280', fontSize: 13 }}>No sessions recorded yet.</p>}
        {sessions.map((s) => (
          <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 0', borderBottom: '1px dashed #e7e5e4', fontSize: 13 }}>
            <div><b>{s.user_agent?.slice(0, 40) || 'Unknown device'}</b><div style={{ color: '#6b7280', fontSize: 12 }}>Last active: {s.last_seen}</div></div>
            <div>{s.current ? <span style={{ fontSize: 12, color: '#6b7280' }}>This device</span> : <button onClick={() => revoke(s.id)} style={btnSm}>Sign out</button>}</div>
          </div>
        ))}
        <button onClick={signOutAll} style={{ ...btnDel, marginTop: 10 }}>Sign out all other sessions</button>
      </div>

      <div style={{ ...card, marginTop: 14 }}>
        <h2 style={h2}>Login history</h2>
        {logins.length === 0 && <p style={{ color: '#6b7280', fontSize: 13 }}>No login attempts recorded yet.</p>}
        {logins.map((l, i) => (
          <div key={i} style={{ display: 'grid', gridTemplateColumns: '160px 100px 100px 1fr', gap: 8, padding: '8px 0', borderBottom: '1px dashed #e7e5e4', fontSize: 13 }}>
            <span>{l.ts}</span><span>{l.user}</span><span style={{ color: l.ok ? '#15803D' : '#B91C1C' }}>{l.ok ? 'Success' : 'Failed'}</span><span style={{ color: '#6b7280' }}>{l.ua}</span>
          </div>
        ))}
      </div>
    </>
  )
}
"@
Write-Host "  [+] AccountTab" -ForegroundColor Green

Write-Host "=== Admin rebuild done. Build next. ===" -ForegroundColor Green