import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Seo from '../../components/Seo'

type Post = { id: number; title: string; slug: string; excerpt: string | null; thumbnail: string | null; created_at: string; meta_description: string | null }

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/posts').then((r) => r.json()).then((d) => setPosts(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false))
  }, [])

  return (
    <>
      <Seo title="Blog | PPM Creator" description="Guides and how-tos about images, PDFs, calculators and text tools." path="/blog" />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 18px' }}>
        <h1 style={{ fontSize: 28, margin: '0 0 8px', color: '#1c1917' }}>Blog</h1>
        <p style={{ color: '#6b7280', margin: '0 0 24px' }}>Guides and how-tos about the tools on this site.</p>
        {loading && <p style={{ color: '#6b7280' }}>Loading...</p>}
        {!loading && posts.length === 0 && <p style={{ color: '#6b7280' }}>No posts yet.</p>}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 16 }}>
          {posts.map((p) => (
            <Link key={p.id} to={'/blog/' + p.slug} style={{ display: 'block', border: '1px solid #e7e5e4', borderRadius: 12, overflow: 'hidden', background: '#fff', textDecoration: 'none', color: '#1c1917' }}>
              {p.thumbnail ? (
                <img src={p.thumbnail} alt={p.title} style={{ width: '100%', height: 180, objectFit: 'cover', display: 'block' }} />
              ) : (
                <div style={{ width: '100%', height: 180, background: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 20 }}>
                  {(p.title || '?').slice(0, 1)}
                </div>
              )}
              <div style={{ padding: 16 }}>
                <small style={{ color: '#6b7280', fontSize: 12 }}>{(p.created_at || '').slice(0, 10)}</small>
                <h2 style={{ fontSize: 17, margin: '4px 0 6px', fontWeight: 600 }}>{p.title}</h2>
                {p.excerpt && <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>{p.excerpt}</p>}
                {!p.excerpt && p.meta_description && <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>{p.meta_description}</p>}
              </div>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}