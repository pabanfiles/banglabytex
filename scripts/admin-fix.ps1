$ErrorActionPreference = "Stop"
$utf8 = New-Object System.Text.UTF8Encoding $false
$fe = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend"
$api = "$fe\functions\api"
$admin = "$fe\src\pages\admin"

function WF($rel, $body, $rootDir = $admin) {
  $full = Join-Path $rootDir $rel
  $dir = Split-Path $full -Parent
  if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  [System.IO.File]::WriteAllText($full, $body, $utf8)
  Write-Host "  [+] $rel" -ForegroundColor Green
}

Write-Host "=== Admin fix + Login gate ===" -ForegroundColor Cyan

# ---------- BACKEND: posts.js with DELETE + full fields ----------
WF "posts.js" @"
export async function onRequestGet(context) {
  const { env, request } = context;
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (id) {
      const row = await env.DB.prepare('SELECT * FROM posts WHERE id = ?').bind(id).first();
      return new Response(JSON.stringify(row || {}), { headers: { 'Content-Type': 'application/json' } });
    }
    const admin = url.searchParams.get('admin');
    const q = admin
      ? 'SELECT id, title, slug, status, updated_at, thumbnail, meta_title, meta_description, length(content) AS content_len FROM posts ORDER BY updated_at DESC'
      : \"SELECT id, title, slug, excerpt, meta_title, meta_description, content, thumbnail, status, created_at FROM posts WHERE status = 'published' ORDER BY created_at DESC\";
    const { results } = await env.DB.prepare(q).all();
    return new Response(JSON.stringify(results || []), { headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const b = await request.json();
    if (!b.title || !b.slug) return new Response(JSON.stringify({ error: 'title and slug are required' }), { status: 400 });
    if (b.id) {
      await env.DB.prepare(
        'UPDATE posts SET title=?, slug=?, content=?, excerpt=?, thumbnail=?, meta_title=?, meta_description=?, status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?'
      ).bind(b.title, b.slug, b.content || '', b.excerpt || '', b.thumbnail || '', b.meta_title || '', b.meta_description || '', b.status || 'draft', b.id).run();
    } else {
      await env.DB.prepare(
        'INSERT INTO posts (title, slug, content, excerpt, thumbnail, meta_title, meta_description, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
      ).bind(b.title, b.slug, b.content || '', b.excerpt || '', b.thumbnail || '', b.meta_title || '', b.meta_description || '', b.status || 'draft').run();
    }
    return new Response(JSON.stringify({ success: true }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}

export async function onRequestDelete(context) {
  const { env, request } = context;
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');
    if (!id) return new Response(JSON.stringify({ error: 'id required' }), { status: 400 });
    await env.DB.prepare('DELETE FROM posts WHERE id = ?').bind(id).run();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
"@ $api

# ---------- BACKEND: upload.js (base64 image storage in D1) ----------
WF "upload.js" @"
export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const b = await request.json();
    if (!b.data_url || !b.data_url.startsWith('data:image/')) {
      return new Response(JSON.stringify({ error: 'data_url must be a data:image URL' }), { status: 400 });
    }
    if (b.data_url.length > 3 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'Image too large (max 2 MB after base64)' }), { status: 413 });
    }
    // Store as a post_images row, keyed by random id
    const id = crypto.randomUUID();
    await env.DB.prepare(
      'CREATE TABLE IF NOT EXISTS post_images (id TEXT PRIMARY KEY, data_url TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)'
    ).run();
    await env.DB.prepare('INSERT INTO post_images (id, data_url) VALUES (?, ?)').bind(id, b.data_url).run();
    return new Response(JSON.stringify({ url: b.data_url, id }), { status: 201, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
"@ $api

# ---------- BACKEND: session.js - who am I ----------
WF "session.js" @"
export async function onRequestGet(context) {
  const { request } = context;
  const cookie = request.headers.get('Cookie') || '';
  const authed = cookie.includes('admin_session=authenticated');
  return new Response(JSON.stringify({ authed }), { headers: { 'Content-Type': 'application/json' } });
}

export async function onRequestPost(context) {
  // logout
  const headers = new Headers();
  headers.set('Set-Cookie', 'admin_session=; Path=/; Max-Age=0');
  return new Response(JSON.stringify({ success: true }), { headers, status: 200 });
}
"@ $api

Write-Host "  backend endpoints updated" -ForegroundColor Green

# ---------- FRONTEND: LoginGate in AdminPanel ----------
WF "AdminPanel.tsx" @"
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PostsTab from './tabs/PostsTab'
import EditorTab from './tabs/EditorTab'
import ToolsTab from './tabs/ToolsTab'
import SettingsTab from './tabs/SettingsTab'
import AnalyticsTab from './tabs/AnalyticsTab'
import AccountTab from './tabs/AccountTab'
import { card, h2, btnP, input, label } from './ui'

type Tab = 'posts' | 'editor' | 'tools' | 'settings' | 'analytics' | 'account'

export default function AdminPanel() {
  const [authed, setAuthed] = useState<boolean | null>(null)
  const [tab, setTab] = useState<Tab>('posts')
  const [editingId, setEditingId] = useState<number | null>(null)

  const check = async () => {
    try {
      const r = await fetch('/api/session', { credentials: 'include' })
      const d = await r.json()
      setAuthed(!!d.authed)
    } catch { setAuthed(false) }
  }

  useEffect(() => { check(); document.title = 'Admin - PPM Creator' }, [])

  if (authed === null) return <div style={{ padding: 40, textAlign: 'center', color: '#6b7280' }}>Checking session...</div>
  if (!authed) return <LoginForm onSuccess={() => { setAuthed(true) }} />

  const editPost = (id: number) => { setEditingId(id); setTab('editor') }
  const newPost = () => { setEditingId(null); setTab('editor') }
  const logout = async () => {
    await fetch('/api/session', { method: 'POST', credentials: 'include' }).catch(() => {})
    setAuthed(false)
  }

  const TABS: { id: Tab; label: string }[] = [
    { id: 'posts', label: 'Blog posts' }, { id: 'editor', label: 'Post editor' },
    { id: 'tools', label: 'Tool pages & FAQ' }, { id: 'settings', label: 'Site settings' },
    { id: 'analytics', label: 'Analytics' }, { id: 'account', label: 'Account & security' },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF9', color: '#1c1917', fontFamily: 'system-ui, sans-serif' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid #e7e5e4', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', position: 'sticky', top: 0, zIndex: 5 }}>
        <div style={{ fontWeight: 600, fontSize: 16 }}>PPM <span style={{ color: '#F97316' }}>Creator</span> Admin</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link to="/" style={{ fontSize: 12, color: '#6b7280', textDecoration: 'none', border: '1px solid #e7e5e4', borderRadius: 99, padding: '4px 12px' }}>View site</Link>
          <button onClick={logout} style={{ fontSize: 12, color: '#B91C1C', border: '1px solid #e7e5e4', background: 'transparent', borderRadius: 99, padding: '4px 12px', cursor: 'pointer' }}>Logout</button>
        </div>
      </header>
      <nav style={{ display: 'flex', gap: 4, flexWrap: 'wrap', padding: '10px 18px', background: '#fff', borderBottom: '1px solid #e7e5e4' }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => { if (t.id === 'editor' && tab !== 'editor') newPost(); else setTab(t.id) }} style={{ border: 0, background: tab === t.id ? '#FFF7ED' : 'none', padding: '7px 12px', borderRadius: 8, cursor: 'pointer', color: tab === t.id ? '#F97316' : '#6b7280', fontWeight: tab === t.id ? 600 : 400, font: 'inherit', fontSize: 14 }}>{t.label}</button>
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

function LoginForm({ onSuccess }: { onSuccess: () => void }) {
  const [u, setU] = useState('')
  const [p, setP] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'creds' | 'otp'>('creds')
  const [err, setErr] = useState('')
  const [busy, setBusy] = useState(false)

  const submit = async () => {
    setBusy(true); setErr('')
    try {
      const r = await fetch('/api/login', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ username: u, password: p, totpCode: otp }) })
      const d = await r.json()
      if (!r.ok) { setErr(d.error || 'Login failed'); return }
      onSuccess()
    } catch { setErr('Could not reach the server.') } finally { setBusy(false) }
  }

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF9', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: 'system-ui, sans-serif', padding: 20 }}>
      <div style={{ ...card, maxWidth: 400, width: '100%' }}>
        <h2 style={{ ...h2 }}>Admin login</h2>
        <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 14 }}>This page is private. Enter credentials to continue.</p>
        <label style={label}>Username<input value={u} onChange={(e) => setU(e.target.value)} autoComplete="username" style={input} /></label>
        <label style={label}>Password<input type="password" value={p} onChange={(e) => setP(e.target.value)} autoComplete="current-password" style={input} /></label>
        <label style={label}>2FA code (optional)<input value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="123456" style={input} /></label>
        {err && <p style={{ color: '#B91C1C', fontSize: 13 }}>{err}</p>}
        <button onClick={submit} disabled={busy || !u || !p} style={{ ...btnP, width: '100%', marginTop: 6 }}>{busy ? 'Signing in...' : 'Sign in'}</button>
      </div>
    </div>
  )
}
"@

Write-Host "  [+] AdminPanel with login gate" -ForegroundColor Green

Write-Host "=== Now add remaining tabs with fixes ===" -ForegroundColor Yellow