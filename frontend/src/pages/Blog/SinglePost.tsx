import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Seo from '../../components/Seo'
import ShareButtons from '../../components/ShareButtons'
import RelatedTools from '../../components/RelatedTools'

type Post = { id: number; title: string; slug: string; content: string; excerpt: string | null; thumbnail: string | null; meta_title: string | null; meta_description: string | null; created_at: string }

function renderMarkdown(md: string): JSX.Element[] {
  const lines = md.split('\n')
  const out: JSX.Element[] = []
  let key = 0
  let i = 0
  while (i < lines.length) {
    const line = lines[i]
    if (!line.trim()) { i++; continue }
    if (line.startsWith('## ')) {
      out.push(<h2 key={key++} style={{ fontSize: 22, margin: '28px 0 12px', fontWeight: 600 }}>{line.slice(3)}</h2>)
      i++; continue
    }
    if (line.startsWith('### ')) {
      out.push(<h3 key={key++} style={{ fontSize: 17, margin: '20px 0 8px', fontWeight: 600 }}>{line.slice(4)}</h3>)
      i++; continue
    }
    if (line.startsWith('- ')) {
      const items: string[] = []
      while (i < lines.length && lines[i].startsWith('- ')) { items.push(lines[i].slice(2)); i++ }
      out.push(<ul key={key++} style={{ paddingLeft: 22, color: '#374151' }}>{items.map((t, j) => <li key={j} style={{ marginBottom: 4 }}>{inline(t)}</li>)}</ul>)
      continue
    }
    if (line.startsWith('![')) {
      const m = line.match(/!\[([^\]]*)\]\(([^)]+)\)/)
      if (m) { out.push(<img key={key++} src={m[2]} alt={m[1]} style={{ maxWidth: '100%', borderRadius: 10, margin: '12px 0' }} />); i++; continue }
    }
    out.push(<p key={key++} style={{ margin: '0 0 12px', lineHeight: 1.7 }}>{inline(line)}</p>)
    i++
  }
  return out
}

function inline(text: string): (string | JSX.Element)[] {
  const parts: (string | JSX.Element)[] = []
  const re = /(\*\*[^*]+\*\*|\*[^*]+\*|\[[^\]]+\]\([^)]+\))/g
  let last = 0, m: RegExpExecArray | null, k = 0
  while ((m = re.exec(text)) !== null) {
    if (m.index > last) parts.push(text.slice(last, m.index))
    const token = m[0]
    if (token.startsWith('**')) parts.push(<b key={k++}>{token.slice(2, -2)}</b>)
    else if (token.startsWith('*')) parts.push(<i key={k++}>{token.slice(1, -1)}</i>)
    else {
      const mm = token.match(/\[([^\]]+)\]\(([^)]+)\)/)
      if (mm) parts.push(<Link key={k++} to={mm[2]} style={{ color: '#F97316', textDecoration: 'underline' }}>{mm[1]}</Link>)
    }
    last = m.index + m[0].length
  }
  if (last < text.length) parts.push(text.slice(last))
  return parts
}

export default function SinglePost() {
  const { slug } = useParams()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    setLoading(true)
    fetch('/api/posts').then((r) => r.json()).then((d) => {
      const list = Array.isArray(d) ? d : []
      const found = list.find((p: Post) => p.slug === slug)
      if (!found) { setNotFound(true); return }
      fetch('/api/posts?id=' + found.id).then((r2) => r2.json()).then((full) => setPost(full))
    }).catch(() => setNotFound(true)).finally(() => setLoading(false))
  }, [slug])

  if (loading) return <div style={{ maxWidth: 820, margin: '40px auto', padding: '0 18px', color: '#6b7280' }}>Loading...</div>
  if (notFound || !post) return <div style={{ maxWidth: 820, margin: '40px auto', padding: '0 18px' }}>Post not found. <Link to="/blog">Back to blog</Link></div>

  return (
    <>
      <Seo title={(post.meta_title || post.title) + ' | PPM Creator'} description={post.meta_description || post.excerpt || ''} path={'/blog/' + post.slug} type="article" ogImage={post.thumbnail || undefined} />
      <article style={{ maxWidth: 820, margin: '0 auto', padding: '32px 18px' }}>
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 6 }}><Link to="/" style={{ color: '#6b7280' }}>Home</Link> / <Link to="/blog" style={{ color: '#6b7280' }}>Blog</Link></div>
        <h1 style={{ fontSize: 30, lineHeight: 1.25, margin: '6px 0 10px', color: '#1c1917' }}>{post.title}</h1>
        <div style={{ fontSize: 13, color: '#6b7280', marginBottom: 20 }}>{(post.created_at || '').slice(0, 10)}</div>
        {post.thumbnail && <img src={post.thumbnail} alt={post.title} style={{ width: '100%', borderRadius: 12, marginBottom: 20 }} />}
        <div>{renderMarkdown(post.content || '')}</div>
        <hr style={{ border: 0, borderTop: '1px solid #e7e5e4', margin: '28px 0' }} />
        <ShareButtons path={'/blog/' + post.slug} title={post.title} />
        <RelatedTools items={[
          { name: 'Image Compressor', href: '/image-compress', blurb: 'Reduce file size at a chosen quality' },
          { name: 'Merge PDF', href: '/pdf-merge', blurb: 'Combine multiple PDFs into one' },
          { name: 'Word Counter', href: '/word-counter', blurb: 'Count words and characters' },
          { name: 'Age Calculator', href: '/age-calculator', blurb: 'Calculate exact age' },
        ]} />
      </article>
    </>
  )
}