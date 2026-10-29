import { Link } from 'react-router-dom'
export default function RelatedTools({ items }) {
  return (
    <section>
      <h2>Related tools</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
        {items.slice(0, 6).map((it) => (
          <Link key={it.href} to={it.href} style={{ display: 'block', border: '1px solid #e7e5e4', borderRadius: 12, padding: 14, background: '#fafaf9', textDecoration: 'none', color: '#1c1917' }}>
            <b style={{ display: 'block', fontWeight: 600 }}>{it.name}</b>
            <span style={{ display: 'block', color: '#6b7280', fontSize: 13 }}>{it.blurb}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}