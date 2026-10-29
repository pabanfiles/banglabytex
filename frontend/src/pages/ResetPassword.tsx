import { useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Seo from '../components/Seo'

export default function ResetPassword() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const nav = useNavigate()
  const [pw, setPw] = useState('')
  const [pw2, setPw2] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  const submit = async () => {
    setError('')
    if (pw.length < 8) { setError('Password must be at least 8 characters.'); return }
    if (pw !== pw2) { setError('Passwords do not match.'); return }
    setBusy(true)
    try {
      const r = await fetch('/api/auth/reset-password', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password: pw }) })
      const d = await r.json()
      if (!r.ok) { setError(d.error || 'Reset failed.'); return }
      setDone(true)
      setTimeout(() => nav('/login'), 1500)
    } catch { setError('Could not reach the server.') } finally { setBusy(false) }
  }

  if (!token) return <main style={{ maxWidth: 440, margin: '48px auto', padding: '0 18px' }}><div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 16, padding: 28, textAlign: 'center' }}><p>Missing reset token.</p><Link to="/forgot-password" style={{ color: '#F97316' }}>Request a new one</Link></div></main>

  return (
    <>
      <Seo title="Reset password | PPM Creator" description="Choose a new password." path="/reset-password" />
      <main style={{ maxWidth: 440, margin: '48px auto', padding: '0 18px' }}>
        <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 16, padding: 28 }}>
          {done ? (
            <div style={{ textAlign: 'center' }}>
              <h1 style={{ fontSize: 20 }}>Password updated</h1>
              <p style={{ color: '#6b7280', fontSize: 14 }}>Redirecting to sign in...</p>
            </div>
          ) : (
            <>
              <h1 style={{ fontSize: 22, margin: '0 0 4px' }}>Choose a new password</h1>
              <p style={{ color: '#6b7280', fontSize: 13, margin: '0 0 20px' }}>At least 8 characters.</p>
              <label style={lbl}>New password
                <div style={{ position: 'relative' }}>
                  <input type={showPw ? 'text' : 'password'} value={pw} onChange={(e) => setPw(e.target.value)} style={{ ...inp, paddingRight: 60 }} />
                  <button type="button" onClick={() => setShowPw(!showPw)} style={{ position: 'absolute', right: 8, top: '50%', transform: 'translateY(-50%)', border: 0, background: 'transparent', color: '#6b7280', fontSize: 12, cursor: 'pointer' }}>{showPw ? 'Hide' : 'Show'}</button>
                </div>
              </label>
              <label style={lbl}>Confirm new password<input type={showPw ? 'text' : 'password'} value={pw2} onChange={(e) => setPw2(e.target.value)} style={inp} /></label>
              {error && <p style={errStyle}>{error}</p>}
              <button onClick={submit} disabled={busy} style={{ width: '100%', padding: '12px 20px', border: 0, borderRadius: 10, background: '#F97316', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>{busy ? 'Saving...' : 'Update password'}</button>
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