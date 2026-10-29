$ErrorActionPreference = "Stop"
$utf8 = New-Object System.Text.UTF8Encoding $false
$pages = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend\src\pages"
$components = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend\src\components"
function WF($rel, $body, $root) {
  $full = Join-Path $root $rel
  $dir = Split-Path $full -Parent
  if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  [System.IO.File]::WriteAllText($full, $body, $utf8)
  Write-Host "  [+] $rel" -ForegroundColor Green
}
function BK($rel, $root) { $f = Join-Path $root $rel; if (Test-Path -LiteralPath $f) { Copy-Item -LiteralPath $f -Destination "$f.bak" -Force } }

Write-Host "=== Login page ===" -ForegroundColor Cyan
BK "Login.tsx" $pages
WF "Login.tsx" @"
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Seo from '../components/Seo'

export default function Login() {
  const nav = useNavigate()
  const [mode, setMode] = useState<'google' | 'email'>('google')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [step, setStep] = useState<'email' | 'otp'>('email')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    fetch('/api/auth/profile').then((r) => r.ok ? r.json() : null).then((d) => { if (d && d.email) setProfile(d) }).catch(() => {})
  }, [])

  const google = () => { window.location.href = '/api/auth/google' }

  const sendOtp = async () => {
    setError(''); setBusy(true)
    try {
      const r = await fetch('/api/auth/email/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) { setError(d.error || 'Could not send code.'); return }
      setStep('otp')
    } catch { setError('Could not reach the server.') } finally { setBusy(false) }
  }

  const verifyOtp = async () => {
    setError(''); setBusy(true)
    try {
      const r = await fetch('/api/auth/email/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, code: otp }) })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) { setError(d.error || 'Invalid code.'); return }
      nav('/profile')
    } catch { setError('Could not reach the server.') } finally { setBusy(false) }
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    setProfile(null)
    document.cookie = 'user_email=; Path=/; Max-Age=0'
    nav('/')
  }

  if (profile) {
    return (
      <>
        <Seo title="You are signed in | PPM Creator" description="Manage your PPM Creator account." path="/login" />
        <main style={{ maxWidth: 500, margin: '48px auto', padding: '0 18px' }}>
          <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 24, textAlign: 'center' }}>
            {profile.avatar_url ? <img src={profile.avatar_url} alt="" style={{ width: 72, height: 72, borderRadius: '50%', marginBottom: 12 }} /> : <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#FFF7ED', color: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 28, margin: '0 auto 12px' }}>{(profile.name || profile.email || '?').slice(0, 1).toUpperCase()}</div>}
            <h1 style={{ fontSize: 20, margin: '0 0 4px' }}>{profile.name || 'Signed in'}</h1>
            <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 16 }}>{profile.email}</div>
            <Link to="/profile" style={{ display: 'inline-block', padding: '10px 16px', background: '#F97316', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 600, marginRight: 8 }}>Open profile</Link>
            <button onClick={logout} style={{ padding: '10px 16px', border: '1px solid #e7e5e4', background: 'transparent', color: '#B91C1C', borderRadius: 10, cursor: 'pointer', fontWeight: 500 }}>Sign out</button>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Seo title="Sign in | PPM Creator" description="Sign in to save your favourites and access your PPM Creator account." path="/login" />
      <main style={{ maxWidth: 460, margin: '48px auto', padding: '0 18px' }}>
        <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 24 }}>
          <h1 style={{ fontSize: 22, margin: '0 0 4px' }}>Sign in to PPM Creator</h1>
          <p style={{ color: '#6b7280', fontSize: 13, margin: '0 0 20px' }}>Save your favourites and access your account on any device.</p>

          <div style={{ display: 'flex', gap: 4, background: '#fafaf9', padding: 4, borderRadius: 10, marginBottom: 18 }}>
            <button onClick={() => setMode('google')} style={{ flex: 1, padding: 9, border: 0, borderRadius: 8, background: mode === 'google' ? '#fff' : 'transparent', cursor: 'pointer', fontWeight: mode === 'google' ? 600 : 400, color: mode === 'google' ? '#1c1917' : '#6b7280', boxShadow: mode === 'google' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}>Google</button>
            <button onClick={() => setMode('email')} style={{ flex: 1, padding: 9, border: 0, borderRadius: 8, background: mode === 'email' ? '#fff' : 'transparent', cursor: 'pointer', fontWeight: mode === 'email' ? 600 : 400, color: mode === 'email' ? '#1c1917' : '#6b7280', boxShadow: mode === 'email' ? '0 1px 3px rgba(0,0,0,0.08)' : 'none' }}>Email code</button>
          </div>

          {mode === 'google' && (
            <button onClick={google} style={{ width: '100%', padding: '12px 20px', border: '1px solid #e7e5e4', borderRadius: 10, background: '#fff', cursor: 'pointer', fontWeight: 500, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
              <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
              Continue with Google
            </button>
          )}

          {mode === 'email' && step === 'email' && (
            <div>
              <label style={{ display: 'block', fontSize: 13, color: '#6b7280', marginBottom: 12 }}>Email address<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 4, fontSize: 14 }} /></label>
              {error && <p style={{ color: '#B91C1C', fontSize: 13 }}>{error}</p>}
              <button onClick={sendOtp} disabled={busy || !email} style={{ width: '100%', padding: '12px 20px', border: 0, borderRadius: 10, background: '#F97316', color: '#fff', fontWeight: 600, cursor: busy ? 'wait' : 'pointer', opacity: !email ? 0.6 : 1 }}>{busy ? 'Sending...' : 'Send code'}</button>
            </div>
          )}

          {mode === 'email' && step === 'otp' && (
            <div>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>We sent a code to <b>{email}</b>. Check your inbox.</p>
              <label style={{ display: 'block', fontSize: 13, color: '#6b7280', marginBottom: 12 }}>6-digit code<input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="123456" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 4, fontSize: 18, letterSpacing: 4, textAlign: 'center', fontFamily: 'monospace' }} /></label>
              {error && <p style={{ color: '#B91C1C', fontSize: 13 }}>{error}</p>}
              <button onClick={verifyOtp} disabled={busy || otp.length !== 6} style={{ width: '100%', padding: '12px 20px', border: 0, borderRadius: 10, background: '#F97316', color: '#fff', fontWeight: 600, cursor: busy ? 'wait' : 'pointer', opacity: otp.length !== 6 ? 0.6 : 1 }}>{busy ? 'Verifying...' : 'Verify code'}</button>
              <button onClick={() => { setStep('email'); setOtp(''); setError('') }} style={{ marginTop: 8, width: '100%', padding: '10px 20px', border: '1px solid #e7e5e4', borderRadius: 10, background: 'transparent', color: '#6b7280', cursor: 'pointer' }}>Use a different email</button>
            </div>
          )}

          <p style={{ fontSize: 12, color: '#6b7280', marginTop: 20, textAlign: 'center' }}>No password needed. By signing in you agree to our <Link to="/terms" style={{ color: '#F97316' }}>Terms</Link> and <Link to="/privacy-policy" style={{ color: '#F97316' }}>Privacy</Link>.</p>
        </div>
      </main>
    </>
  )
}
"@

Write-Host "=== Profile page ===" -ForegroundColor Cyan
BK "Profile.tsx" $pages
WF "Profile.tsx" @"
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Seo from '../components/Seo'

type Profile = { name: string | null; email: string; provider: string; avatar_url: string | null; created_at: string }

const FAVOURITES_KEY = 'ppm_favourites'

const TOOL_OPTIONS = [
  { slug: 'image-compress', name: 'Image Compressor' }, { slug: 'image-resize', name: 'Image Resizer' },
  { slug: 'image-convert', name: 'Image Converter' }, { slug: 'pdf-merge', name: 'Merge PDF' },
  { slug: 'pdf-split', name: 'Split PDF' }, { slug: 'pdf-compress', name: 'Compress PDF' },
  { slug: 'age-calculator', name: 'Age Calculator' }, { slug: 'percentage-calc', name: 'Percentage Calculator' },
  { slug: 'word-counter', name: 'Word Counter' }, { slug: 'qr-code-gen', name: 'QR Generator' },
]

export default function Profile() {
  const nav = useNavigate()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [favourites, setFavourites] = useState<string[]>([])

  useEffect(() => {
    fetch('/api/auth/profile').then((r) => r.ok ? r.json() : null).then((d) => setProfile(d && d.email ? d : null)).catch(() => {}).finally(() => setLoading(false))
    try { setFavourites(JSON.parse(localStorage.getItem(FAVOURITES_KEY) || '[]')) } catch {}
  }, [])

  const toggle = (slug: string) => {
    const next = favourites.includes(slug) ? favourites.filter((s) => s !== slug) : [...favourites, slug]
    setFavourites(next)
    try { localStorage.setItem(FAVOURITES_KEY, JSON.stringify(next)) } catch {}
  }

  const logout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
    document.cookie = 'user_email=; Path=/; Max-Age=0'
    nav('/')
  }

  if (loading) return <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 18px', color: '#6b7280' }}>Loading...</div>

  if (!profile) {
    return (
      <>
        <Seo title="Profile | PPM Creator" description="Sign in to see your profile." path="/profile" />
        <main style={{ maxWidth: 500, margin: '48px auto', padding: '0 18px', textAlign: 'center' }}>
          <h1 style={{ fontSize: 22 }}>Not signed in</h1>
          <p style={{ color: '#6b7280', marginBottom: 20 }}>Sign in to save your favourites and access your profile.</p>
          <Link to="/login" style={{ padding: '12px 20px', background: '#F97316', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
        </main>
      </>
    )
  }

  return (
    <>
      <Seo title="Profile | PPM Creator" description="Your PPM Creator account and favourites." path="/profile" />
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '32px 18px' }}>
        <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 24, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          {profile.avatar_url ? <img src={profile.avatar_url} alt="" style={{ width: 72, height: 72, borderRadius: '50%' }} /> : <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#FFF7ED', color: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 28 }}>{(profile.name || profile.email || '?').slice(0, 1).toUpperCase()}</div>}
          <div style={{ flex: 1, minWidth: 200 }}>
            <h1 style={{ fontSize: 20, margin: '0 0 4px' }}>{profile.name || 'Signed in'}</h1>
            <div style={{ color: '#6b7280', fontSize: 13 }}>{profile.email}</div>
            <div style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>Signed in with {profile.provider || 'account'} · {profile.created_at?.slice(0, 10)}</div>
          </div>
          <button onClick={logout} style={{ padding: '10px 16px', border: '1px solid #e7e5e4', background: 'transparent', color: '#B91C1C', borderRadius: 10, cursor: 'pointer', fontWeight: 500 }}>Sign out</button>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 24, marginTop: 14 }}>
          <h2 style={{ fontSize: 17, margin: '0 0 4px' }}>Favourites</h2>
          <p style={{ color: '#6b7280', fontSize: 13, margin: '0 0 14px' }}>Tap a tool to add it. Favourites are saved on this device only.</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 8 }}>
            {TOOL_OPTIONS.map((t) => (
              <label key={t.slug} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: 10, border: '1px solid ' + (favourites.includes(t.slug) ? '#F97316' : '#e7e5e4'), borderRadius: 10, cursor: 'pointer', background: favourites.includes(t.slug) ? '#FFF7ED' : '#fff' }}>
                <input type="checkbox" checked={favourites.includes(t.slug)} onChange={() => toggle(t.slug)} />
                <span style={{ fontSize: 13 }}>{t.name}</span>
              </label>
            ))}
          </div>
        </div>

        <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 24, marginTop: 14 }}>
          <h2 style={{ fontSize: 17, margin: '0 0 10px' }}>Quick access</h2>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {favourites.map((slug) => {
              const t = TOOL_OPTIONS.find((x) => x.slug === slug)
              if (!t) return null
              return <Link key={slug} to={'/' + slug} style={{ padding: '10px 14px', border: '1px solid #e7e5e4', borderRadius: 10, textDecoration: 'none', color: '#1c1917', fontSize: 13 }}>{t.name}</Link>
            })}
            {favourites.length === 0 && <p style={{ color: '#6b7280', fontSize: 13 }}>No favourites yet. Add some above.</p>}
          </div>
        </div>
      </main>
    </>
  )
}
"@

Write-Host "=== Header: user icon ===" -ForegroundColor Cyan
BK "Header.tsx" $components
WF "Header.tsx" @"
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  const [user, setUser] = useState<{ email: string; avatar_url: string | null; name: string | null } | null>(null)

  useEffect(() => {
    fetch('/api/auth/profile').then((r) => r.ok ? r.json() : null).then((d) => { if (d && d.email) setUser(d) }).catch(() => {})
  }, [])

  return (
    <header style={{ background: '#fff', borderBottom: '1px solid #e7e5e4', position: 'sticky', top: 0, zIndex: 20 }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 58, gap: 12 }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none', color: '#1c1917', fontWeight: 600, fontSize: 17 }}>
          <svg width="28" height="28" viewBox="0 0 64 64" aria-hidden="true"><rect width="64" height="64" rx="14" fill="#F97316"/><rect x="14" y="16" width="6" height="32" rx="2" fill="#fff"/><polygon points="26,16 26,48 50,32" fill="#fff"/></svg>
          <span>PPM <span style={{ color: '#F97316' }}>Creator</span></span>
        </Link>
        <nav style={{ display: 'flex', gap: 4, alignItems: 'center', flexWrap: 'wrap' }}>
          <Link to="/image-tools" style={{ padding: '6px 10px', color: '#6b7280', textDecoration: 'none', fontSize: 13 }}>Image</Link>
          <Link to="/pdf-tools" style={{ padding: '6px 10px', color: '#6b7280', textDecoration: 'none', fontSize: 13 }}>PDF</Link>
          <Link to="/calculators" style={{ padding: '6px 10px', color: '#6b7280', textDecoration: 'none', fontSize: 13 }}>Calculators</Link>
          <Link to="/blog" style={{ padding: '6px 10px', color: '#6b7280', textDecoration: 'none', fontSize: 13 }}>Blog</Link>
          {user ? (
            <Link to="/profile" aria-label="Profile" style={{ marginLeft: 6, display: 'flex', alignItems: 'center' }}>
              {user.avatar_url ? <img src={user.avatar_url} alt="" style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid #F97316' }} /> : <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#FFF7ED', color: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, border: '2px solid #F97316' }}>{(user.name || user.email || '?').slice(0, 1).toUpperCase()}</div>}
            </Link>
          ) : (
            <Link to="/login" style={{ marginLeft: 6, padding: '8px 14px', background: '#F97316', color: '#fff', borderRadius: 99, textDecoration: 'none', fontSize: 13, fontWeight: 500 }}>Sign in</Link>
          )}
        </nav>
      </div>
    </header>
  )
}
"@

Write-Host "=== Backend: auth email + logout ===" -ForegroundColor Cyan
$api = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend\functions\api"
function WFA($rel, $body) { $full = Join-Path $api $rel; $dir = Split-Path $full -Parent; if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }; [System.IO.File]::WriteAllText($full, $body, $utf8); Write-Host "  [+] $rel" -ForegroundColor Green }

WFA "auth\email\send.js" @"
function genCode() {
  const n = Math.floor(Math.random() * 900000) + 100000;
  return String(n);
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    const email = (body.email || '').trim().toLowerCase();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Enter a valid email.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const code = genCode();
    const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    await env.DB.prepare('CREATE TABLE IF NOT EXISTS email_otps (email TEXT PRIMARY KEY, code TEXT NOT NULL, expires DATETIME NOT NULL, attempts INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)').run();
    await env.DB.prepare('INSERT INTO email_otps (email, code, expires, attempts) VALUES (?, ?, ?, 0) ON CONFLICT(email) DO UPDATE SET code = excluded.code, expires = excluded.expires, attempts = 0, created_at = CURRENT_TIMESTAMP').bind(email, code, expires).run();

    const RESEND = env.RESEND_API_KEY;
    if (!RESEND) {
      return new Response(JSON.stringify({ success: true, note: 'Email sending is disabled. Ask the admin to set RESEND_API_KEY. Code was stored but not emailed.' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
    }
    const from = env.RESEND_FROM || 'PPM Creator <noreply@ppmcreator.com>';
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + RESEND, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        from,
        to: [email],
        subject: 'Your PPM Creator sign-in code',
        html: '<p>Your sign-in code is <b style="font-size:20px;letter-spacing:4px">' + code + '</b></p><p>The code expires in 10 minutes. If you did not request it, ignore this email.</p>',
      }),
    });
    if (!res.ok) {
      return new Response(JSON.stringify({ error: 'Could not send the email. Try again later.' }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
"@

WFA "auth\email\verify.js" @"
export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    const email = (body.email || '').trim().toLowerCase();
    const code = (body.code || '').trim();
    if (!email || !code) return new Response(JSON.stringify({ error: 'Email and code are required.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    const row = await env.DB.prepare('SELECT code, expires, attempts FROM email_otps WHERE email = ?').bind(email).first();
    if (!row) return new Response(JSON.stringify({ error: 'No code was requested for this email.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    if (row.attempts >= 5) return new Response(JSON.stringify({ error: 'Too many attempts. Request a new code.' }), { status: 429, headers: { 'Content-Type': 'application/json' } });
    if (new Date(row.expires).getTime() < Date.now()) return new Response(JSON.stringify({ error: 'Code expired. Request a new one.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    if (row.code !== code) {
      await env.DB.prepare('UPDATE email_otps SET attempts = attempts + 1 WHERE email = ?').bind(email).run();
      return new Response(JSON.stringify({ error: 'Incorrect code.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }

    await env.DB.prepare('INSERT INTO users (email, provider, provider_id, name) VALUES (?, ?, ?, ?) ON CONFLICT(email) DO UPDATE SET provider = excluded.provider').bind(email, 'email', email, email.split('@')[0]).run();

    const headers = new Headers();
    headers.set('Set-Cookie', 'user_email=' + encodeURIComponent(email) + '; Path=/; SameSite=Lax; Max-Age=2592000');
    headers.set('Content-Type', 'application/json');
    await env.DB.prepare('DELETE FROM email_otps WHERE email = ?').bind(email).run();
    return new Response(JSON.stringify({ success: true }), { headers, status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
"@

WFA "auth\logout.js" @"
export async function onRequestPost() {
  const headers = new Headers();
  headers.set('Set-Cookie', 'user_email=; Path=/; Max-Age=0');
  return new Response(JSON.stringify({ success: true }), { headers, status: 200 });
}
"@

Write-Host "=== Done ===" -ForegroundColor Green