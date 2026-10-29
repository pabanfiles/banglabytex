import { useState } from 'react'
import Seo from '../../components/Seo'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name || !email || !message) { setError('Please fill in name, email and message.'); return }
    setBusy(true)
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) { setError(d.error || 'Could not send your message. Try again later.'); return }
      setSent(true)
      setName(''); setEmail(''); setSubject(''); setMessage('')
    } catch { setError('Could not reach the server. Check your connection.') }
    finally { setBusy(false) }
  }

  return (
    <>
      <Seo title="Contact | PPM Creator" description="Send a question, bug report or feature idea to PPM Creator." path="/contact" />
      <main style={{ maxWidth: 620, margin: '0 auto', padding: '48px 18px', lineHeight: 1.7, color: '#374151' }}>
        <h1 style={{ fontSize: 32, margin: '0 0 8px', color: '#1c1917' }}>Contact us</h1>
        <p style={{ color: '#6b7280', margin: '0 0 28px' }}>Send a question, a bug report or a feature idea. We read every message.</p>

        {sent ? (
          <div style={{ background: '#DCFCE7', border: '1px solid #86efac', borderRadius: 12, padding: 24, color: '#14532D' }}>
            <b style={{ display: 'block', marginBottom: 8 }}>Message sent</b>
            Thank you for writing. Your message reached our inbox. We usually reply within two working days.
            <div style={{ marginTop: 14 }}>
              <button type="button" onClick={() => setSent(false)} style={{ background: '#15803D', color: '#fff', border: 0, padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Send another message</button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 16, padding: 24 }}>
            <label style={lbl}>Your name<input value={name} onChange={(e) => setName(e.target.value)} required style={inp} /></label>
            <label style={lbl}>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" style={inp} /></label>
            <label style={lbl}>Subject (optional)<input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Bug in image compressor" style={inp} /></label>
            <label style={lbl}>Message<textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={6} placeholder="Describe your question or the problem you saw." style={{ ...inp, fontFamily: 'inherit', resize: 'vertical' }} /></label>
            {error && <p style={{ background: '#FEF2F2', color: '#B91C1C', fontSize: 13, padding: '10px 12px', borderRadius: 8, margin: '0 0 12px' }}>{error}</p>}
            <button type="submit" disabled={busy} style={{ width: '100%', padding: '12px 20px', background: busy ? '#fdba74' : '#F97316', color: '#fff', border: 0, borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: busy ? 'wait' : 'pointer' }}>
              {busy ? 'Sending...' : 'Send message'}
            </button>
            <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 12, textAlign: 'center' }}>Your message goes straight to our inbox. We never share your email.</p>
          </form>
        )}

        <h2 style={{ fontSize: 18, color: '#1c1917', marginTop: 40 }}>Other ways to reach us</h2>
        <p>Email: <a href="mailto:hello@ppmcreator.com" style={{ color: '#F97316' }}>hello@ppmcreator.com</a></p>
        <p>We usually reply within two working days.</p>
      </main>
    </>
  )
}

const lbl: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 14 }
const inp: React.CSSProperties = { width: '100%', padding: '11px 13px', border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 6, fontSize: 14, outline: 'none', boxSizing: 'border-box' }