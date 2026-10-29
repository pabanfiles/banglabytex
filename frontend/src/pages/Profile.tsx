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
    fetch('/api/auth/profile', { credentials: 'include' }).then((r) => r.ok ? r.json() : null).then((d) => setProfile(d && d.email ? d : null)).catch(() => {}).finally(() => setLoading(false))
    try { setFavourites(JSON.parse(localStorage.getItem(FAVOURITES_KEY) || '[]')) } catch {}
  }, [])

  const toggle = (slug: string) => {
    const next = favourites.includes(slug) ? favourites.filter((s) => s !== slug) : [...favourites, slug]
    setFavourites(next)
    try { localStorage.setItem(FAVOURITES_KEY, JSON.stringify(next)) } catch {}
  }

  const logout = async () => { await fetch('/api/auth/logout', { method: 'POST' }).catch(() => {}); nav('/') }

  if (loading) return <div style={{ maxWidth: 800, margin: '40px auto', padding: '0 18px', color: '#6b7280' }}>Loading...</div>
  if (!profile) return (
    <>
      <Seo title="Profile | PPM Creator" description="Sign in to see your profile." path="/profile" />
      <main style={{ maxWidth: 500, margin: '48px auto', padding: '0 18px', textAlign: 'center' }}>
        <h1 style={{ fontSize: 22 }}>Not signed in</h1>
        <p style={{ color: '#6b7280', marginBottom: 20 }}>Sign in to save your favourites and access your profile.</p>
        <Link to="/login" style={{ padding: '12px 20px', background: '#F97316', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 600 }}>Sign in</Link>
      </main>
    </>
  )

  return (
    <>
      <Seo title="Profile | PPM Creator" description="Your PPM Creator account and favourites." path="/profile" />
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '32px 18px' }}>
        <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 24, display: 'flex', gap: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          {profile.avatar_url ? <img src={profile.avatar_url} alt="" style={{ width: 72, height: 72, borderRadius: '50%' }} /> : <div style={{ width: 72, height: 72, borderRadius: '50%', background: '#FFF7ED', color: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 28 }}>{(profile.name || profile.email || '?').slice(0, 1).toUpperCase()}</div>}
          <div style={{ flex: 1, minWidth: 200 }}>
            <h1 style={{ fontSize: 20, margin: '0 0 4px' }}>{profile.name || 'Signed in'}</h1>
            <div style={{ color: '#6b7280', fontSize: 13 }}>{profile.email}</div>
            <div style={{ color: '#6b7280', fontSize: 12, marginTop: 2 }}>Signed in with {profile.provider || 'account'}</div>
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