import { useEffect, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import Seo from '../components/Seo'

export default function VerifyEmail() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const nav = useNavigate()
  const [state, setState] = useState<'loading' | 'ok' | 'error'>('loading')
  const [msg, setMsg] = useState('')

  useEffect(() => {
    if (!token) { setState('error'); setMsg('Missing token.'); return }
    fetch('/api/auth/verify-link', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token }) })
      .then(async (r) => { const d = await r.json(); if (r.ok) { setState('ok'); setTimeout(() => nav('/profile'), 1500) } else { setState('error'); setMsg(d.error || 'Verification failed.') } })
      .catch(() => { setState('error'); setMsg('Could not reach the server.') })
  }, [token, nav])

  return (
    <>
      <Seo title="Verify email | PPM Creator" description="Verify your PPM Creator account." path="/verify-email" />
      <main style={{ maxWidth: 440, margin: '48px auto', padding: '0 18px' }}>
        <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 16, padding: 28, textAlign: 'center' }}>
          {state === 'loading' && <p style={{ color: '#6b7280' }}>Verifying your email...</p>}
          {state === 'ok' && (<><h1 style={{ fontSize: 20, color: '#15803D' }}>Email verified</h1><p style={{ color: '#6b7280', fontSize: 14 }}>Redirecting to your profile...</p></>)}
          {state === 'error' && (<><h1 style={{ fontSize: 20 }}>Verification failed</h1><p style={{ color: '#6b7280', fontSize: 14, marginBottom: 16 }}>{msg}</p><Link to="/login" style={{ color: '#F97316', fontWeight: 600 }}>Back to sign in</Link></>)}
        </div>
      </main>
    </>
  )
}