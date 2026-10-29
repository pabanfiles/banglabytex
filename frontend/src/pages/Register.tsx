import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Seo from '../components/Seo'

function pwStrength(pw: string) {
  let score = 0
  if (pw.length >= 8) score++
  if (pw.length >= 12) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  return score
}

export default function Register() {
  const nav = useNavigate()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const strength = pwStrength(password)
  const strengthLabel = ['Too weak', 'Weak', 'Fair', 'Good', 'Strong', 'Excellent'][strength]
  const strengthColor = ['#DC2626', '#DC2626', '#F59E0B', '#F59E0B', '#15803D', '#15803D'][strength]

  const submit = async () => {
    setError(''); setBusy(true)
    try {
      const r = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ name, email, password }) })
      const d = await r.json()
      if (!r.ok) { setError(d.error || 'Registration failed.'); return }
      setDone(true)
    } catch { setError('Could not reach the server.') } finally { setBusy(false) }
  }

  if (done) {
    return (
      <>
        <Seo title="Check your inbox | PPM Creator" description="Verify your email to finish signing up." path="/register" />
        <main style={{ maxWidth: 460, margin: '48px auto', padding: '0 18px' }}>
          <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 16, padding: 28, textAlign: 'center' }}>
            <div style={{ width: 60, height: 60, borderRadius: '50%', background: '#FFF7ED', color: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
            </div>
            <h1 style={{ fontSize: 20, marginBottom: 8 }}>Check your inbox</h1>
            <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>We sent a verification link to <b>{email}</b>. Tap it to finish setting up your account.</p>
            <Link to="/login" style={{ display: 'inline-block', padding: '12px 20px', background: '#F97316', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 600 }}>Back to sign in</Link>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <Seo title="Create account | PPM Creator" description="Create a free PPM Creator account." path="/register" />
      <main style={{ maxWidth: 440, margin: '48px auto', padding: '0 18px' }}>
        <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 16, padding: 28, boxShadow: '0 4px 24px rgba(0,0,0,0.04)' }}>
          <h1 style={{ fontSize: 22, margin: '0 0 4px', fontWeight: 700 }}>Create your account</h1>
          <p style={{ color: '#6b7280', fontSize: 13, margin: '0 0 20px' }}>Save your favourites across devices.</p>

          <label style={lbl}>Name (optional)<input value={name} onChange={(e) => setName(e.target.value)} placeholder="Your name" style={inp} /></label>
          <label style={lbl}>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" autoComplete="email" style={inp} /></label>
          <label style={lbl}>Password
            <div style={{ position: 'relative' }}>
              <input type={showPw ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="new-password" placeholder="At least 8 characters" style={{ ...inp, paddingRight: 60 }} />
              <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', border: 0, background: 'transparent', color: '#6b7280', fontSize: 12, cursor: 'pointer', fontWeight: 500 }}>{showPw ? 'Hide' : 'Show'}</button>
            </div>
          </label>
          {password && (
            <div style={{ marginTop: -4, marginBottom: 12 }}>
              <div style={{ display: 'flex', gap: 4, marginBottom: 4 }}>
                {[1, 2, 3, 4, 5].map((i) => (<div key={i} style={{ flex: 1, height: 4, borderRadius: 2, background: strength >= i ? strengthColor : '#e7e5e4', transition: 'background .2s' }} />))}
              </div>
              <div style={{ fontSize: 12, color: strengthColor, fontWeight: 500 }}>{strengthLabel}</div>
            </div>
          )}
          {error && <p style={errStyle}>{error}</p>}
          <button onClick={submit} disabled={busy || !email || password.length < 8} style={{ width: '100%', padding: '12px 20px', border: 0, borderRadius: 10, background: '#F97316', color: '#fff', fontWeight: 600, cursor: busy ? 'wait' : 'pointer', fontSize: 14, opacity: (!email || password.length < 8) ? 0.5 : 1 }}>{busy ? 'Creating account...' : 'Create account'}</button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 10, margin: '20px 0' }}>
            <div style={{ flex: 1, height: 1, background: '#e7e5e4' }} /><span style={{ fontSize: 12, color: '#9ca3af' }}>OR</span><div style={{ flex: 1, height: 1, background: '#e7e5e4' }} />
          </div>
          <button onClick={() => window.location.href = '/api/auth/google'} style={{ width: '100%', padding: '12px 20px', border: '1px solid #e7e5e4', borderRadius: 10, background: '#fff', cursor: 'pointer', fontWeight: 500, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10 }}>
            <svg width="18" height="18" viewBox="0 0 48 48"><path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/><path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/><path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/><path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/></svg>
            Sign up with Google
          </button>

          <p style={{ fontSize: 13, color: '#6b7280', textAlign: 'center', marginTop: 20 }}>
            Already have an account? <Link to="/login" style={{ color: '#F97316', fontWeight: 600 }}>Sign in</Link>
          </p>
        </div>
      </main>
    </>
  )
}

const lbl: React.CSSProperties = { display: 'block', fontSize: 13, color: '#374151', marginBottom: 12, fontWeight: 500 }
const inp: React.CSSProperties = { width: '100%', padding: '11px 13px', border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 6, fontSize: 14, outline: 'none' }
const errStyle: React.CSSProperties = { color: '#B91C1C', fontSize: 13, margin: '0 0 12px', background: '#FEF2F2', padding: '10px 12px', borderRadius: 8 }