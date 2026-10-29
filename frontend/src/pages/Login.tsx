import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Seo from '../components/Seo'

type Mode = 'password' | 'otp' | 'google'

export default function Login() {
  const nav = useNavigate()
  const [mode, setMode] = useState<Mode>('password')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [profile, setProfile] = useState<any>(null)
  const [otpStep, setOtpStep] = useState<'email' | 'code'>('email')
  const [otp, setOtp] = useState('')

  useEffect(() => {
    fetch('/api/auth/profile', { credentials: 'include' }).then((r) => r.ok ? r.json() : null).then((d) => { if (d && d.email) setProfile(d) }).catch(() => {})
  }, [])

  const loginPassword = async () => {
    setError(''); setBusy(true)
    try {
      const r = await fetch('/api/auth/login-password', { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) })
      const d = await r.json()
      if (!r.ok) { setError(d.error || 'Login failed.'); return }
      nav('/profile')
    } catch { setError('Could not reach the server.') } finally { setBusy(false) }
  }

  const sendOtp = async () => {
    setError(''); setBusy(true)
    try {
      const r = await fetch('/api/auth/email/send', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) { setError(d.error || 'Could not send code.'); return }
      setOtpStep('code')
    } catch { setError('Could not reach the server.') } finally { setBusy(false) }
  }
  const verifyOtp = async () => {
    setError(''); setBusy(true)
    try {
      const r = await fetch('/api/auth/email/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, code: otp }) })
      const d = await r.json()
      if (!r.ok) { setError(d.error || 'Invalid code.'); return }
      nav('/profile')
    } catch { setError('Could not reach the server.') } finally { setBusy(false) }
  }

  if (profile) {
    return (
      <>
        <Seo title="Signed in | PPM Creator" description="You are signed in to PPM Creator." path="/login" />
        <main style={{ maxWidth: 500, margin: '48px auto', padding: '0 18px' }}>
          <div style={card}>
            <div style={{ textAlign: 'center' }}>
              {profile.avatar_url ? <img src={profile.avatar_url} alt="" style={avatar} /> : <div style={{ ...avatarBox }}>{(profile.name || profile.email || '?').slice(0, 1).toUpperCase()}</div>}
              <h1 style={{ fontSize: 20, margin: '0 0 4px' }}>{profile.name || 'Signed in'}</h1>
              <div style={{ color: '#6b7280', fontSize: 13, marginBottom: 20 }}>{profile.email}</div>
            </div>
            <Link to="/profile" style={{ ...btnP, display: 'block', textAlign: 'center', textDecoration: 'none' }}>Open profile</Link>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Seo title="Sign in | PPM Creator" description="Sign in to PPM Creator with email and password, Google, or a one-time code." path="/login" />
      <main style={{ maxWidth: 440, margin: '48px auto', padding: '0 18px' }}>
        <div style={card}>
          <div style={{ textAlign: 'center', marginBottom: 22 }}>
            <svg width="48" height="48" viewBox="0 0 64 64" style={{ marginBottom: 8 }}><rect width="64" height="64" rx="14" fill="#F97316"/><rect x="14" y="16" width="6" height="32" rx="2" fill="#fff"/><polygon points="26,16 26,48 50,32" fill="#fff"/></svg>
            <h1 style={{ fontSize: 22, margin: 0, fontWeight: 700 }}>Welcome back</h1>
            <p style={{ color: '#6b7280', fontSize: 13, margin: '4px 0 0' }}>Sign in to save your favourites</p>
          </div>

          <div style={tabs}>
            <button onClick={() => setMode('password')} style={{ ...tab, ...(mode === 'password' ? tabOn : {}) }}>Password</button>
            <button onClick={() => setMode('otp')} style={{ ...tab, ...(mode === 'otp' ? tabOn : {}) }}>Code</button>
            <button onClick={() => setMode('google')} style={{ ...tab, ...(mode === 'google' ? tabOn : {}) }}>Google</button>
          </div>

          {mode === 'password' && (
            <div>
              <label style={lbl}>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" placeholder="you@example.com" style={inp} /></label>
              <label style={lbl}>Password
                <div style={{ position: 'relative' }}>
                  <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" placeholder="Your password" style={{ ...inp, paddingRight: 60 }} />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', border: 0, background: 'transparent', color: '#6b7280', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>{showPw ? 'Hide' : 'Show'}</button>
                </div>
              </label>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: -4, marginBottom: 12 }}>
                <Link to="/forgot-password" style={{ fontSize: 12, color: '#F97316', textDecoration: 'none', fontWeight: 500 }}>Forgot password?</Link>
              </div>
              {error && <p style={errStyle}>{error}</p>}
              <button onClick={loginPassword} disabled={busy || !email || !password} style={{ ...btnP, width: '100%' }}>{busy ? 'Signing in...' : 'Sign in'}</button>
            </div>
          )}

          {mode === 'otp' && otpStep === 'email' && (
            <div>
              <label style={lbl}>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={inp} /></label>
              {error && <p style={errStyle}>{error}</p>}
              <button onClick={sendOtp} disabled={busy || !email} style={{ ...btnP, width: '100%' }}>{busy ? 'Sending...' : 'Send sign-in code'}</button>
              <p style={{ ...hint }}>No password needed. We will email you a 6-digit code.</p>
            </div>
          )}

          {mode === 'otp' && otpStep === 'code' && (
            <div>
              <p style={{ fontSize: 13, color: '#6b7280', marginBottom: 12 }}>Code sent to <b>{email}</b></p>
              <label style={lbl}>6-digit code<input value={otp} onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} placeholder="123456" style={{ ...inp, fontSize: 20, letterSpacing: 6, textAlign: 'center', fontFamily: 'monospace' }} /></label>
              {error && <p style={errStyle}>{error}</p>}
              <button onClick={verifyOtp} disabled={busy || otp.length !== 6} style={{ ...btnP, width: '100%' }}>{busy ? 'Verifying...' : 'Verify code'}</button>
              <button onClick={() => { setOtpStep('email'); setOtp(''); setError('') }} style={{ ...btnG, width: '100%', marginTop: 8 }}>Use a different email</button>
            </div>
          )}

          {mode === 'google' && (
            <div>
              <button onClick={() => window.location.href = '/api/auth/google'} style={{ ...googleBtn }}>
                <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
                Continue with Google
              </button>
              <p style={hint}>Only verified Google accounts work. We never see your password.</p>
            </div>
          )}

          <p style={{ fontSize: 13, color: '#6b7280', textAlign: 'center', marginTop: 20 }}>
            New here? <Link to="/register" style={{ color: '#F97316', fontWeight: 600 }}>Create an account</Link>
          </p>
        </div>
      </main>
    </>
  )
}

const card: React.CSSProperties = { background: '#fff', border: '1px solid #e7e5e4', borderRadius: 16, padding: 28, boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }
const tabs: React.CSSProperties = { display: 'flex', gap: 4, background: '#fafaf9', padding: 4, borderRadius: 10, marginBottom: 18 }
const tab: React.CSSProperties = { flex: 1, padding: 8, border: 0, borderRadius: 8, background: 'transparent', cursor: 'pointer', color: '#6b7280', fontSize: 13, fontWeight: 500, transition: 'all .15s' }
const tabOn: React.CSSProperties = { background: '#fff', color: '#1c1917', boxShadow: '0 1px 3px rgba(0,0,0,0.08)', fontWeight: 600 }
const lbl: React.CSSProperties = { display: 'block', fontSize: 13, color: '#374151', marginBottom: 12, fontWeight: 500 }
const inp: React.CSSProperties = { width: '100%', padding: '11px 13px', border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 6, fontSize: 14, outline: 'none', transition: 'border .15s' }
const btnP: React.CSSProperties = { padding: '12px 20px', border: 0, borderRadius: 10, background: '#F97316', color: '#fff', fontWeight: 600, cursor: 'pointer', fontSize: 14, transition: 'opacity .15s' }
const btnG: React.CSSProperties = { padding: '12px 20px', border: '1px solid #e7e5e4', borderRadius: 10, background: 'transparent', color: '#6b7280', fontWeight: 500, cursor: 'pointer', fontSize: 13 }
const googleBtn: React.CSSProperties = { width: '100%', padding: '12px 20px', border: '1px solid #e7e5e4', borderRadius: 10, background: '#fff', cursor: 'pointer', fontWeight: 500, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }
const errStyle: React.CSSProperties = { color: '#B91C1C', fontSize: 13, margin: '0 0 12px', background: '#FEF2F2', padding: '10px 12px', borderRadius: 8 }
const hint: React.CSSProperties = { fontSize: 12, color: '#6b7280', marginTop: 12, textAlign: 'center' }
const avatar: React.CSSProperties = { width: 72, height: 72, borderRadius: '50%', marginBottom: 12 }
const avatarBox: React.CSSProperties = { width: 72, height: 72, borderRadius: '50%', background: '#FFF7ED', color: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 28, margin: '0 auto 12px' }