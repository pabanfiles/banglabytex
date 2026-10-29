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