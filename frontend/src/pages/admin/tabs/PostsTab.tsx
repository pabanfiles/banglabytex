import { useEffect, useState } from 'react'
import { card, h2, btnP, btnSm, btnDel, input, pill, scoreColour } from '../ui'
import { DEMO_POSTS } from '../demoData'

type Post = { id: number; title: string; slug: string; status: string; updated_at: string; content_len?: number; meta_title?: string; meta_description?: string }

function seoScore(p: Post): number {
  let pts = 0, tot = 6
  if (p.meta_title && p.meta_title.length > 0) pts++
  if (p.meta_title && p.meta_title.length <= 60) pts++
  if (p.meta_description && p.meta_description.length >= 70) pts++
  if (p.meta_description && p.meta_description.length <= 155) pts++
  if (p.content_len && p.content_len >= 900) pts++
  if (p.slug && p.slug.length > 0 && p.slug.length <= 60) pts++
  return Math.round((pts / tot) * 100)
}

export default function PostsTab({ onEdit, onNew }: { onEdit: (id: number) => void; onNew: () => void }) {
  const [posts, setPosts] = useState<Post[]>([])
  const [q, setQ] = useState('')
  const [status, setStatus] = useState('')
  const [loading, setLoading] = useState(true)
  const [demo, setDemo] = useState(false)
  const [deleting, setDeleting] = useState<number | null>(null)

  const load = () => {
    setLoading(true)
    fetch('/api/posts?admin=1', { credentials: 'include' }).then((r) => r.json()).then((d) => {
      const list = Array.isArray(d) ? d : (d?.posts || [])
      if (list.length === 0) { setPosts(DEMO_POSTS as Post[]); setDemo(true) }
      else setPosts(list)
    }).catch(() => { setPosts(DEMO_POSTS as Post[]); setDemo(true) }).finally(() => setLoading(false))
  }
  useEffect(load, [])

  const del = async (id: number, title: string) => {
    if (!confirm('Delete "' + title + '"? This cannot be undone.')) return
    setDeleting(id)
    try {
      const r = await fetch('/api/posts?id=' + id, { method: 'DELETE', credentials: 'include' })
      if (!r.ok) throw new Error()
      setPosts(posts.filter((p) => p.id !== id))
    } catch { alert('Could not delete. The server rejected the request.') } finally { setDeleting(null) }
  }

  const filtered = posts.filter((p) => p.title.toLowerCase().includes(q.toLowerCase()) && (!status || p.status === status))

  return (
    <div style={card}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <h2 style={{ ...h2, margin: 0 }}>All posts</h2>
        <button onClick={onNew} style={btnP}>New post</button>
      </div>
      {demo && <div style={{ background: '#FFF7ED', borderRadius: 8, padding: '8px 11px', fontSize: 12, color: '#B45309', marginBottom: 12 }}>Showing sample data â€” the backend returned no posts. Real posts appear when the D1 database is connected.</div>}
      <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title" style={{ ...input, maxWidth: 280 }} />
        <select value={status} onChange={(e) => setStatus(e.target.value)} style={{ ...input, maxWidth: 180 }}>
          <option value="">All statuses</option><option>published</option><option>draft</option><option>scheduled</option>
        </select>
      </div>
      {loading && <p style={{ color: '#6b7280' }}>Loading...</p>}
      {filtered.length > 0 && (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
          <thead><tr>
            <th style={{ textAlign: 'left', padding: '10px 8px', borderBottom: '1px solid #e7e5e4', color: '#6b7280', fontWeight: 500, fontSize: 12 }}>Title</th>
            <th style={{ textAlign: 'left', padding: '10px 8px', borderBottom: '1px solid #e7e5e4', color: '#6b7280', fontWeight: 500, fontSize: 12 }}>Status</th>
            <th style={{ textAlign: 'left', padding: '10px 8px', borderBottom: '1px solid #e7e5e4', color: '#6b7280', fontWeight: 500, fontSize: 12 }}>SEO</th>
            <th style={{ textAlign: 'left', padding: '10px 8px', borderBottom: '1px solid #e7e5e4', color: '#6b7280', fontWeight: 500, fontSize: 12 }}>Updated</th>
            <th></th>
          </tr></thead>
          <tbody>
            {filtered.map((p) => {
              const s = seoScore(p)
              return (
                <tr key={p.id}>
                  <td style={{ padding: '10px 8px', borderBottom: '1px solid #e7e5e4' }}>{p.title}</td>
                  <td style={{ padding: '10px 8px', borderBottom: '1px solid #e7e5e4' }}><span style={pill}>{p.status}</span></td>
                  <td style={{ padding: '10px 8px', borderBottom: '1px solid #e7e5e4' }}><span style={{ display: 'inline-block', fontWeight: 600, fontSize: 12, padding: '2px 9px', borderRadius: 99, color: '#fff', background: scoreColour(s) }}>{s}%</span></td>
                  <td style={{ padding: '10px 8px', borderBottom: '1px solid #e7e5e4', color: '#6b7280' }}>{p.updated_at?.slice(0, 10) || '-'}</td>
                  <td style={{ padding: '10px 8px', borderBottom: '1px solid #e7e5e4', textAlign: 'right', whiteSpace: 'nowrap' }}>
                    <button onClick={() => onEdit(p.id)} style={btnSm}>Edit</button>
                    <button onClick={() => del(p.id, p.title)} disabled={deleting === p.id} style={{ ...btnDel, padding: '4px 9px', fontSize: 12, marginLeft: 6 }}>{deleting === p.id ? '...' : 'Delete'}</button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      )}
    </div>
  )
}