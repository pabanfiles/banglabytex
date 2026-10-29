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