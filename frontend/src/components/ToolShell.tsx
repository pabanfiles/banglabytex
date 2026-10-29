import { Link } from 'react-router-dom'
import FaqSection, { buildFaqJsonLd } from './FaqSection'
import ShareButtons from './ShareButtons'
import RelatedTools from './RelatedTools'
import BlogTeasers from './BlogTeasers'
import Seo from './Seo'
export default function ToolShell(p) {
  const jsonLd = buildFaqJsonLd(p.faqGroups)
  return (
    <>
      <Seo title={p.title} description={p.description} path={p.path} jsonLd={jsonLd} />
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 18px' }}>
        <div style={{ fontSize: 13, color: '#6b7280', margin: '20px 0 4px' }}>
          <Link to="/" style={{ color: '#6b7280' }}>Home</Link>
          {p.crumb.map((c) => <span key={c.to}> / <Link to={c.to} style={{ color: '#6b7280' }}>{c.label}</Link></span>)}
        </div>
        <h1 style={{ fontSize: 28, lineHeight: 1.25, margin: '6px 0 10px', color: '#1c1917' }}>{p.h1}</h1>
        <p style={{ color: '#6b7280', fontSize: 16, margin: '0 0 12px' }}>{p.lead}</p>
        {p.children}
        <article style={{ marginTop: 28 }}>{p.article}</article>
        <FaqSection groups={p.faqGroups} />
        <BlogTeasers items={p.guides || []} />
        <ShareButtons path={p.path} title={p.title} />
        <RelatedTools items={p.related} />
      </div>
    </>
  )
}