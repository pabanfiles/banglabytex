import { Link } from 'react-router-dom'
export default function BlogTeasers({ items }) {
  const list = items && items.length ? items : [{ title: 'Guide coming soon' }, { title: 'Guide coming soon' }, { title: 'Guide coming soon' }]
  return (
    <section>
      <h2>Guides</h2>
      {list.slice(0, 3).map((it, i) => {
        if (!it.slug) {
          return (
            <div key={i} style={{ border: '1px dashed #e7e5e4', borderRadius: 12, padding: 14, background: '#fafaf9', marginBottom: 10 }}>
              <small style={{ color: '#6b7280', fontSize: 12 }}>Guide coming soon</small>
              <b style={{ display: 'block', fontWeight: 500 }}>{it.title}</b>
            </div>
          )
        }
        return (
          <Link key={it.slug} to={'/blog/' + it.slug} style={{ display: 'block', border: '1px solid #e7e5e4', borderRadius: 12, padding: 14, background: '#fafaf9', textDecoration: 'none', color: '#1c1917', marginBottom: 10 }}>
            <small style={{ color: '#6b7280', fontSize: 12 }}>Guide - {(it.readMin || 5)} min read</small>
            <b style={{ display: 'block', fontWeight: 500 }}>{it.title}</b>
          </Link>
        )
      })}
    </section>
  )
}