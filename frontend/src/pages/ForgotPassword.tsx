import { useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../components/Seo'

export default function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const submit = async () => {
    setError(''); setBusy(true)
    try {
      const r = await fetch('/api/auth/forgot-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) })
      const d = await r.json()
      if (!r.ok) { setError(d.error || 'Could not send reset email.'); return }
      setSent(true)
    } catch { setError('Could not reach the server.') } finally { setBusy(false) }
  }

  return (
    <>
      <Seo title="Forgot password | PPM Creator" description="Reset your PPM Creator password." path="/forgot-password" />
      <main style={{ maxWidth: 440, margin: '48px auto', padding: '0 18px' }}>
        <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 16, padding: 28 }}>
          {sent ? (
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: 20, marginBottom: 8 }}>Check your inbox</h1>
              <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 20 }}>If an account exists for <b>{email}</b>, a reset link is on its way. It expires in 30 minutes.</p>
              <Link to="/login" style={{ display: 'inline-block', padding: '12px 20px', background: '#F97316', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 600 }}>Back to sign in</Link>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: 22, margin: '0 0 4px' }}>Forgot password?</h1>
              <p style={{ color: '#6b7280', fontSize: 13, margin: '0 0 20px' }}>Enter your email and we will send a reset link.</p>
              <label style={lbl}>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" style={inp} /></label>
              {error && <p style={errStyle}>{error}</p>}
              <button onClick={submit} disabled={busy || !email} style={{ width: '100%', padding: '12px 20px', border: 0, borderRadius: 10, background: '#F97316', color: '#fff', fontWeight: 600, cursor: 'pointer', opacity: !email ? 0.6 : 1 }}>{busy ? 'Sending...' : 'Send reset link'}</button>
              <p style={{ fontSize: 13, color: '#6b7280', textAlign: 'center', marginTop: 18 }}><Link to="/login" style={{ color: '#F97316' }}>Back to sign in</Link></p>
            </>
          )}
        </div>
      </main>
    </>
  )
}
const lbl: React.CSSProperties = { display: 'block', fontSize: 13, color: '#374151', marginBottom: 12, fontWeight: 500 }
const inp: React.CSSProperties = { width: '100%', padding: '11px 13px', border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 6, fontSize: 14, outline: 'none' }
const errStyle: React.CSSProperties = { color: '#B91C1C', fontSize: 13, margin: '0 0 12px', background: '#FEF2F2', padding: '10px 12px', borderRadius: 8 }