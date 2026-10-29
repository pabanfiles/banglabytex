import { useEffect, useState } from 'react'
import { card, h2, btn, btnP, btnSm, input, pill, scoreColour } from '../ui'

type Post = { id: number; title: string; slug: string; status: string; updated_at: string; seo_score?: number }

export default function PostsTab({ onEdit, onNew }: { onEdit: (id: number) => void; onNew: () => void }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setLoading(true)
    fetch('/api/posts?admin=1').then((r) => r.json()).then((d) => {
      setPosts(Array.isArray(d) ? d : (d.posts || []))
    }).catch(() => setError('Could not load posts. The backend may be offline.')).finally(() => setLoading(false))
  }, [])

  const filtered = posts.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()) && (!status || p.status === status))

  return (
    <div style={card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ ...h2, margin: 0 }}>All posts</h2>
        <button onClick={onNew} style={btnP}>New post</button>
      </div>
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title" style={{ ...input, maxWidth: 280 }} />
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ ...input, maxWidth: 180 }}>
          <option value="">All statuses</option>
          <option>published</option>
          <option>draft</option>
          <option>scheduled</option>
        </select>
      </div>
      {loading && <p style={{ color: '#6b7280' }}>Loading...</p>}
      {error && <p style={{ color: '#B91C1C' }}>{error}</p>}
      {!loading && filtered.length === 0 && <p style={{ color: '#6b7280' }}>No posts yet. Click New post to create one.</p>}
      {filtered.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead><tr><th style={{ textAlign: 'left', padding: '10px 8px', borderBottom: '1px solid #e7e5e4', color: '#6b7280', fontWeight: 500, fontSize: 12 }}>Title</th><th style={{ textAlign: 'left', padding: '10px 8px', borderBottom: '1px solid #e7e5e4', color: '#6b7280', fontWeight: 500, fontSize: 12 }}>Status</th><th style={{ textAlign: 'left', padding: '10px 8px', borderBottom: '1px solid #e7e5e4', color: '#6b7280', fontWeight: 500, fontSize: 12 }}>Updated</th><th></th></tr></thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id}>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid #e7e5e4' }}>{p.title}</td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid #e7e5e4' }}><span style={pill}>{p.status}</span></td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid #e7e5e4', color: '#6b7280' }}>{p.updated_at?.slice(0, 10) || '-'}</td>
                <td style={{ padding: '10px 8px', borderBottom: '1px solid #e7e5e4', textAlign: 'right' }}><button onClick={() => onEdit(p.id)} style={btnSm}>Edit</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}