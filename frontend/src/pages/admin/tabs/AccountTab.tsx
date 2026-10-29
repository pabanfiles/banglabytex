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
          <div style={note}>{rules.map((r, i) => (<div key={i}>{r[1] ? 'âœ“ ' : 'âœ— '}{r[0]}</div>))}</div>
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