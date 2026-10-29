import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

export default function Header() {
  const [user, setUser] = useState<{ email: string; avatar_url: string | null; name: string | null } | null>(null)
  useEffect(() => {
    fetch('/api/auth/profile', { credentials: 'include' }).then((r) => r.ok ? r.json() : null).then((d) => { if (d && d.email) setUser(d) }).catch(() => {})
  }, [])
  return (
    <header style={{ background: '#fff', borderBottom: '1px solid #e7e5e4', position: 'sticky', top: 0, zIndex: 20 }}>
      <div style={{ maxWidth: 1180, margin: '0 auto', padding: '0 14px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56, gap: 8, flexWrap: 'nowrap' }}>
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#1c1917', fontWeight: 600, fontSize: 16, whiteSpace: 'nowrap', flexShrink: 0 }}>
          <svg width="26" height="26" viewBox="0 0 64 64" aria-hidden="true" style={{ flexShrink: 0 }}><rect width="64" height="64" rx="14" fill="#F97316"/><rect x="14" y="16" width="6" height="32" rx="2" fill="#fff"/><polygon points="26,16 26,48 50,32" fill="#fff"/></svg>
          <span style={{ display: 'inline-flex' }}>PPM <span style={{ color: '#F97316', marginLeft: 4 }}>Creator</span></span>
        </Link>
        <nav style={{ display: 'flex', gap: 2, alignItems: 'center', flexWrap: 'nowrap', overflowX: 'auto', flex: '1 1 auto', justifyContent: 'flex-end', scrollbarWidth: 'none' }}>
          <Link to="/image-tools" style={{ padding: '6px 8px', color: '#6b7280', textDecoration: 'none', fontSize: 13, whiteSpace: 'nowrap' }}>Image</Link>
          <Link to="/pdf-tools" style={{ padding: '6px 8px', color: '#6b7280', textDecoration: 'none', fontSize: 13, whiteSpace: 'nowrap' }}>PDF</Link>
          <Link to="/calculators" style={{ padding: '6px 8px', color: '#6b7280', textDecoration: 'none', fontSize: 13, whiteSpace: 'nowrap' }}>Calculators</Link>
          <Link to="/blog" style={{ padding: '6px 8px', color: '#6b7280', textDecoration: 'none', fontSize: 13, whiteSpace: 'nowrap' }}>Blog</Link>
          {user ? (
            <Link to="/profile" aria-label="Profile" style={{ marginLeft: 4, display: 'flex', alignItems: 'center', flexShrink: 0 }}>
              {user.avatar_url ? <img src={user.avatar_url} alt="" style={{ width: 30, height: 30, borderRadius: '50%', border: '2px solid #F97316' }} /> : <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#FFF7ED', color: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, border: '2px solid #F97316', fontSize: 13 }}>{(user.name || user.email || '?').slice(0, 1).toUpperCase()}</div>}
            </Link>
          ) : (
            <Link to="/login" style={{ marginLeft: 4, padding: '7px 12px', background: '#F97316', color: '#fff', borderRadius: 99, textDecoration: 'none', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap', flexShrink: 0 }}>Sign in</Link>
          )}
        </nav>
      </div>
    </header>
  )
}