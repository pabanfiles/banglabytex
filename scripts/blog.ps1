$ErrorActionPreference = "Stop"
$utf8 = New-Object System.Text.UTF8Encoding $false
$pages = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend\src\pages"
function WF($rel, $body) {
  $full = Join-Path $pages $rel
  $dir = Split-Path $full -Parent
  if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  [System.IO.File]::WriteAllText($full, $body, $utf8)
  Write-Host "  [+] $rel" -ForegroundColor Green
}

Write-Host "=== Category hub ===" -ForegroundColor Cyan
WF "CategoryHub.tsx" @"
import { Link, useParams } from 'react-router-dom'
import Seo from '../components/Seo'

const CATS: Record<string, { title: string; blurb: string; items: { name: string; href: string; blurb: string }[] }> = {
  'image-tools': {
    title: 'Image Tools',
    blurb: 'Compress, resize, convert, crop and edit images in your browser.',
    items: [
      { name: 'Image Compressor', href: '/image-compress', blurb: 'Reduce file size at a chosen quality' },
      { name: 'Image Resizer', href: '/image-resize', blurb: 'Change width and height in pixels' },
      { name: 'Image Converter', href: '/image-convert', blurb: 'Convert between JPG, PNG and WebP' },
      { name: 'Image Cropper', href: '/image-crop', blurb: 'Crop to a square or custom size' },
      { name: 'Image Rotate', href: '/image-rotate', blurb: 'Rotate or flip a photo' },
      { name: 'Image to PDF', href: '/image-to-pdf', blurb: 'Turn photos into one PDF' },
      { name: 'Image to Base64', href: '/image-to-base64', blurb: 'Turn an image into text' },
      { name: 'Meme Generator', href: '/meme-generator', blurb: 'Add top and bottom text' },
      { name: 'Image to Text', href: '/image-to-text', blurb: 'OCR printed text' },
      { name: 'Passport Photo', href: '/passport-photo', blurb: 'Crop to a common size' },
      { name: 'Image Color Picker', href: '/image-color-picker', blurb: 'Pick a pixel colour' },
      { name: 'Image Watermark', href: '/image-watermark', blurb: 'Add a text watermark' },
      { name: 'Favicon Generator', href: '/favicon-generator', blurb: 'Make favicons' },
      { name: 'Background Remover', href: '/bg-remover', blurb: 'Remove a background colour' },
    ],
  },
  'pdf-tools': {
    title: 'PDF Tools',
    blurb: 'Merge, split, compress, protect and unlock PDFs in your browser.',
    items: [
      { name: 'Merge PDF', href: '/pdf-merge', blurb: 'Combine multiple PDFs' },
      { name: 'Split PDF', href: '/pdf-split', blurb: 'Split by page range' },
      { name: 'Compress PDF', href: '/pdf-compress', blurb: 'Make a PDF smaller' },
      { name: 'Protect PDF', href: '/pdf-protect', blurb: 'Add a password' },
      { name: 'Unlock PDF', href: '/pdf-unlock', blurb: 'Remove a known password' },
    ],
  },
  'calculators': {
    title: 'Calculators',
    blurb: 'Age, percentage, EMI, unit conversion and more.',
    items: [
      { name: 'Age Calculator', href: '/age-calculator', blurb: 'Exact age in years, months, days' },
      { name: 'Percentage Calculator', href: '/percentage-calc', blurb: 'Percentage of, change, is what %' },
      { name: 'EMI Calculator', href: '/emi-calculator', blurb: 'Loan EMI and total interest' },
      { name: 'Unit Converter', href: '/unit-converter', blurb: 'Length, weight, temperature' },
    ],
  },
  'text-tools': {
    title: 'Text Tools',
    blurb: 'Count, change case, convert CSV and HTML to text.',
    items: [
      { name: 'Word Counter', href: '/word-counter', blurb: 'Words, characters, read time' },
      { name: 'Text Case Converter', href: '/text-case-converter', blurb: 'Upper, lower, title, reverse' },
      { name: 'HTML to Text', href: '/html-to-text', blurb: 'Remove HTML tags' },
      { name: 'CSV to JSON', href: '/csv-to-json', blurb: 'Convert CSV to JSON' },
      { name: 'Password Generator', href: '/password-generator', blurb: 'Strong random password' },
    ],
  },
}

export default function CategoryHub() {
  const { slug } = useParams()
  const cat = CATS[slug || '']
  if (!cat) return <div style={{ padding: 40 }}>Category not found. <Link to="/">Go home</Link></div>
  return (
    <>
      <Seo title={cat.title + ' | PPM Creator'} description={cat.blurb} path={'/' + slug} />
      <main style={{ maxWidth: 900, margin: '0 auto', padding: '32px 18px' }}>
        <h1 style={{ fontSize: 28, margin: '0 0 8px', color: '#1c1917' }}>{cat.title}</h1>
        <p style={{ color: '#6b7280', margin: '0 0 24px' }}>{cat.blurb}</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          {cat.items.map((it) => (
            <Link key={it.href} to={it.href} style={{ display: 'block', padding: 16, border: '1px solid #e7e5e4', borderRadius: 12, background: '#fafaf9', textDecoration: 'none', color: '#1c1917' }}>
              <b style={{ display: 'block', fontWeight: 600 }}>{it.name}</b>
              <span style={{ display: 'block', color: '#6b7280', fontSize: 13, marginTop: 2 }}>{it.blurb}</span>
            </Link>
          ))}
        </div>
      </main>
    </>
  )
}
"@

Write-Host "=== Blog index ===" -ForegroundColor Cyan
WF "Blog\index.tsx" @"
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
"@

Write-Host "=== Blog single post ===" -ForegroundColor Cyan
WF "Blog\SinglePost.tsx" @"
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
"@

Write-Host "=== Router: category hub routes ===" -ForegroundColor Cyan
$routerPath = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend\src\router.tsx"
$rt = [System.IO.File]::ReadAllText($routerPath)
$before = $rt
if ($rt -notmatch "CategoryHub") {
  $rt = $rt.Replace("import PageLoader from './components/PageLoader'", "import PageLoader from './components/PageLoader'" + "`r`n" + "import CategoryHub from './pages/CategoryHub'")
}
if ($rt -notmatch "path: 'image-tools'") {
  $old = "      { path: 'about', element: <About /> },"
  $new = "      { path: 'image-tools', element: <CategoryHub /> },`r`n      { path: 'pdf-tools', element: <CategoryHub /> },`r`n      { path: 'calculators', element: <CategoryHub /> },`r`n      { path: 'text-tools', element: <CategoryHub /> },`r`n" + $old
  $rt = $rt.Replace($old, $new)
}
if ($rt -ne $before) {
  [System.IO.File]::WriteAllText($routerPath, $rt, $utf8)
  Write-Host "  [+] router.tsx updated" -ForegroundColor Green
}

Write-Host "=== Blog + Category hubs done. Now updating 10 posts with real articles ===" -ForegroundColor Yellow