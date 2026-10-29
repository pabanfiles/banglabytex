# ============================================================
# PPM Creator — Group 1 (Foundation) PowerShell Script
# Safe: does NOT delete your homepage body, video-downloader, or any existing tool
# ============================================================

$ErrorActionPreference = "Stop"
$root = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend"
$utf8 = New-Object System.Text.UTF8Encoding $false

function WriteFile($relativePath, $content) {
  $full = Join-Path $root $relativePath
  $dir = Split-Path $full -Parent
  if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  [System.IO.File]::WriteAllText($full, $content, $utf8)
  Write-Host "  [+] $relativePath" -ForegroundColor Green
}

Write-Host "`n=== Group 1: Foundation ===" -ForegroundColor Cyan

# ------------------------------------------------------------
# 1. frontend/public/site.json  (origin fix)
# ------------------------------------------------------------
$siteJson = @'
{
  "name": "PPM Creator",
  "origin": "https://ppmcreator.pages.dev",
  "accent": "#F97316",
  "contactEmail": "hello@ppmcreator.com",
  "social": "@ppmcreator",
  "description": "Free browser-based tools for images, PDFs and everyday calculations. Files stay on your device.",
  "lang": "en",
  "year": 2026,
  "nav": [
    { "label": "Image Tools", "to": "/image-tools" },
    { "label": "PDF Tools", "to": "/pdf-tools" },
    { "label": "Calculators", "to": "/calculators" },
    { "label": "Blog", "to": "/blog" }
  ]
}
'@
WriteFile "public/site.json" $siteJson

# ------------------------------------------------------------
# 2. frontend/public/robots.txt
# ------------------------------------------------------------
$robots = @'
User-agent: *
Allow: /
Disallow: /hellowsaipatit

Sitemap: https://ppmcreator.pages.dev/sitemap.xml
'@
WriteFile "public/robots.txt" $robots

# ------------------------------------------------------------
# 3. frontend/public/sitemap.xml  (placeholder, Group 6 regenerates)
# ------------------------------------------------------------
$sitemap = @'
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://ppmcreator.pages.dev/</loc><priority>1.0</priority></url>
  <url><loc>https://ppmcreator.pages.dev/about</loc><priority>0.5</priority></url>
  <url><loc>https://ppmcreator.pages.dev/contact</loc><priority>0.5</priority></url>
  <url><loc>https://ppmcreator.pages.dev/privacy-policy</loc><priority>0.5</priority></url>
  <url><loc>https://ppmcreator.pages.dev/terms</loc><priority>0.5</priority></url>
  <url><loc>https://ppmcreator.pages.dev/disclaimer</loc><priority>0.5</priority></url>
  <url><loc>https://ppmcreator.pages.dev/blog</loc><priority>0.7</priority></url>
</urlset>
'@
WriteFile "public/sitemap.xml" $sitemap

# ------------------------------------------------------------
# 4. frontend/src/lib/seo.ts
# ------------------------------------------------------------
$seo = @'
// SEO helper: reads site.json once, gives absolute URLs for canonical / OG / share.
let _site: any = null
export async function loadSite() {
  if (_site) return _site
  try {
    const res = await fetch('/site.json', { cache: 'force-cache' })
    _site = await res.json()
  } catch {
    _site = { name: 'PPM Creator', origin: 'https://ppmcreator.pages.dev' }
  }
  return _site
}
export function absUrl(path: string, origin = 'https://ppmcreator.pages.dev') {
  if (!path) return origin
  if (path.startsWith('http')) return path
  return origin.replace(/\/$/, '') + (path.startsWith('/') ? path : '/' + path)
}
'@
WriteFile "src/lib/seo.ts" $seo

# ------------------------------------------------------------
# 5. frontend/src/components/Seo.tsx
# ------------------------------------------------------------
$seoComponent = @'
import { useEffect } from 'react'
import { absUrl } from '../lib/seo'

type Props = {
  title: string
  description: string
  path: string
  ogImage?: string
  type?: 'website' | 'article'
  origin?: string
  jsonLd?: object | null
}

function setMeta(name: string, content: string, attr: 'name' | 'property' = 'name') {
  let el = document.head.querySelector(`meta[${attr}="${name}"]`) as HTMLMetaElement | null
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, name)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function setLink(rel: string, href: string) {
  let el = document.head.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement | null
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
}

export default function Seo({ title, description, path, ogImage, type = 'website', origin = 'https://ppmcreator.pages.dev', jsonLd }: Props) {
  useEffect(() => {
    document.title = title
    setMeta('description', description)
    setLink('canonical', absUrl(path, origin))
    setMeta('og:title', title, 'property')
    setMeta('og:description', description, 'property')
    setMeta('og:url', absUrl(path, origin), 'property')
    setMeta('og:type', type, 'property')
    if (ogImage) setMeta('og:image', absUrl(ogImage, origin), 'property')
    setMeta('twitter:card', 'summary_large_image')
    setMeta('twitter:title', title)
    setMeta('twitter:description', description)

    const prev = document.head.querySelector('script[data-seo-jsonld]')
    if (prev) prev.remove()
    if (jsonLd) {
      const s = document.createElement('script')
      s.type = 'application/ld+json'
      s.setAttribute('data-seo-jsonld', 'true')
      s.text = JSON.stringify(jsonLd)
      document.head.appendChild(s)
    }
  }, [title, description, path, ogImage, type, origin, jsonLd])
  return null
}
'@
WriteFile "src/components/Seo.tsx" $seoComponent

# ------------------------------------------------------------
# 6. frontend/src/components/UploadBox.tsx
#    Transparent full-size file input. NEVER display:none.
# ------------------------------------------------------------
$uploadBox = @'
import { useRef, useState, DragEvent, ChangeEvent } from 'react'

type Props = {
  accept?: string
  maxMB?: number
  hint?: string
  onFile: (file: File) => void
}

export default function UploadBox({ accept = 'image/*', maxMB = 25, hint, onFile }: Props) {
  const [drag, setDrag] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)

  const handle = (file: File | undefined | null) => {
    setError('')
    if (!file) return
    if (maxMB && file.size > maxMB * 1024 * 1024) {
      setError(`This file is over ${maxMB} MB. Please choose a smaller file.`)
      return
    }
    onFile(file)
  }

  const onChange = (e: ChangeEvent<HTMLInputElement>) => {
    handle(e.target.files?.[0])
    if (inputRef.current) inputRef.current.value = ''
  }

  const onDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setDrag(false)
    handle(e.dataTransfer.files?.[0])
  }

  return (
    <div style={{ position: 'relative' }}>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={onDrop}
        style={{
          border: `2px dashed ${drag ? '#F97316' : '#e7e5e4'}`,
          borderRadius: 14,
          padding: '34px 14px',
          textAlign: 'center',
          background: '#fff',
          transition: 'border-color .15s',
        }}
      >
        <b style={{ display: 'block', fontSize: 17, fontWeight: 600 }}>Choose a file or drop it here</b>
        <small style={{ color: '#6b7280' }}>{hint || `Up to ${maxMB} MB · nothing is uploaded`}</small>
      </div>
      {/* Transparent file input — full-size, over the dashed box. NEVER display:none. */}
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        aria-label="Choose a file"
        onChange={onChange}
        style={{
          position: 'absolute',
          left: 0,
          top: 0,
          width: '100%',
          height: '100%',
          opacity: 0,
          cursor: 'pointer',
          fontSize: 0,
        }}
      />
      {error && (
        <p role="alert" style={{ color: '#be123c', fontSize: 14, marginTop: 10 }}>{error}</p>
      )}
    </div>
  )
}
'@
WriteFile "src/components/UploadBox.tsx" $uploadBox

# ------------------------------------------------------------
# 7. frontend/src/components/LiveSizeSlider.tsx
#    100% = original size. 90% = 90% of original bytes.
# ------------------------------------------------------------
$slider = @'
type Props = {
  value: number
  min?: number
  max?: number
  onChange: (v: number) => void
  originalBytes: number
  newBytes: number | null
  busy?: boolean
}

function kb(b: number) {
  if (b < 1048576) return (b / 1024).toFixed(0) + ' KB'
  return (b / 1048576).toFixed(2) + ' MB'
}

export default function LiveSizeSlider({
  value, min = 10, max = 100, onChange, originalBytes, newBytes, busy,
}: Props) {
  const targetBytes = Math.round((originalBytes * value) / 100)
  const saved = newBytes != null && originalBytes > 0
    ? Math.max(0, Math.round((1 - newBytes / originalBytes) * 100))
    : null

  return (
    <div>
      <label style={{ fontSize: 14, fontWeight: 500 }}>
        Target size: how much of the original to keep
      </label>
      <input
        type="range"
        min={min}
        max={max}
        step={1}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        style={{ width: '100%', accentColor: '#F97316', margin: '8px 0 2px' }}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280' }}>
        <span>
          {value}% of original = {kb(targetBytes)}
        </span>
        <span>
          {busy ? 'Calculating…' : saved != null ? `Saved ${saved}%` : ''}
        </span>
      </div>
    </div>
  )
}
'@
WriteFile "src/components/LiveSizeSlider.tsx" $slider

# ------------------------------------------------------------
# 8. frontend/src/components/DownloadButton.tsx
#    900ms "Processing…" gate + real download.
# ------------------------------------------------------------
$dl = @'
import { useState } from 'react'

type Props = {
  getBlob: () => Promise<Blob | null>
  filename: string
  label?: string
}

export default function DownloadButton({ getBlob, filename, label = 'Download' }: Props) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  const onClick = async () => {
    setBusy(true)
    setError('')
    try {
      const [blob] = await Promise.all([
        getBlob(),
        new Promise((r) => setTimeout(r, 900)),
      ])
      if (!blob) { setError('Nothing to download yet.'); return }
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      document.body.appendChild(a)
      a.click()
      a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 4000)
    } catch (e) {
      setError('Something went wrong. Please try again.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={onClick}
        disabled={busy}
        style={{
          border: 0,
          borderRadius: 10,
          padding: '12px 20px',
          fontWeight: 600,
          color: '#fff',
          background: '#F97316',
          cursor: busy ? 'wait' : 'pointer',
          opacity: busy ? 0.6 : 1,
          marginRight: 8,
        }}
      >
        {busy ? 'Processing…' : label}
      </button>
      {error && <p role="alert" style={{ color: '#be123c', fontSize: 14 }}>{error}</p>}
    </div>
  )
}
'@
WriteFile "src/components/DownloadButton.tsx" $dl

# ------------------------------------------------------------
# 9. frontend/src/components/FaqSection.tsx
#    details/summary + FAQPage JSON-LD matching the visible text.
# ------------------------------------------------------------
$faq = @'
type Faq = { q: string; a: string }
type Group = { heading: string; items: Faq[] }

export function buildFaqJsonLd(groups: Group[]) {
  const all = groups.flatMap((g) => g.items)
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: all.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export default function FaqSection({ groups }: { groups: Group[] }) {
  return (
    <section>
      <h2>Frequently asked questions</h2>
      {groups.map((g) => (
        <div key={g.heading}>
          <h3>{g.heading}</h3>
          {g.items.map((f) => (
            <details key={f.q} style={{ borderBottom: '1px solid #e7e5e4', padding: '12px 0' }}>
              <summary style={{ cursor: 'pointer', fontWeight: 600 }}>{f.q}</summary>
              <p style={{ margin: '8px 0 0', color: '#6b7280' }}>{f.a}</p>
            </details>
          ))}
        </div>
      ))}
    </section>
  )
}
'@
WriteFile "src/components/FaqSection.tsx" $faq

# ------------------------------------------------------------
# 10. frontend/src/components/ShareButtons.tsx
#     8 share buttons, neutral with orange hover.
# ------------------------------------------------------------
$share = @'
import { useState } from 'react'

export default function ShareButtons({ path, title = 'PPM Creator' }: { path: string; title?: string }) {
  const [copied, setCopied] = useState(false)
  const origin = (typeof window !== 'undefined' ? window.location.origin : 'https://ppmcreator.pages.dev')
  const url = origin + path
  const e = encodeURIComponent(url)
  const t = encodeURIComponent(title)

  const links = [
    { label: 'WhatsApp', href: `https://wa.me/?text=${t}%20${e}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${e}` },
    { label: 'X', href: `https://twitter.com/intent/tweet?url=${e}&text=${t}` },
    { label: 'Telegram', href: `https://t.me/share/url?url=${e}&text=${t}` },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${e}` },
    { label: 'Pinterest', href: `https://pinterest.com/pin/create/button/?url=${e}` },
    { label: 'Email', href: `mailto:?subject=${t}&body=${e}` },
  ]

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch { /* ignore */ }
  }

  const style = {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 38,
    padding: '0 16px',
    borderRadius: 99,
    border: '1px solid #e7e5e4',
    fontSize: 13,
    fontWeight: 500,
    color: '#1c1917',
    background: '#fff',
    textDecoration: 'none',
    cursor: 'pointer',
    marginRight: 8,
    marginBottom: 8,
  } as const

  return (
    <div>
      <h2>Share this tool</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {links.map((l) => (
          <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" style={style}>
            {l.label}
          </a>
        ))}
        <button type="button" onClick={copy} style={style}>
          {copied ? 'Copied' : 'Copy link'}
        </button>
      </div>
    </div>
  )
}
'@
WriteFile "src/components/ShareButtons.tsx" $share

# ------------------------------------------------------------
# 11. frontend/src/components/RelatedTools.tsx
# ------------------------------------------------------------
$rel = @'
import { Link } from 'react-router-dom'

type Item = { name: string; href: string; blurb: string }

export default function RelatedTools({ items }: { items: Item[] }) {
  return (
    <section>
      <h2>Related tools</h2>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 10 }}>
        {items.slice(0, 6).map((it) => (
          <Link
            key={it.href}
            to={it.href}
            style={{
              display: 'block',
              border: '1px solid #e7e5e4',
              borderRadius: 12,
              padding: 14,
              background: '#fafaf9',
              textDecoration: 'none',
              color: '#1c1917',
            }}
          >
            <b style={{ display: 'block', fontWeight: 600 }}>{it.name}</b>
            <span style={{ display: 'block', color: '#6b7280', fontSize: 13 }}>{it.blurb}</span>
          </Link>
        ))}
      </div>
    </section>
  )
}
'@
WriteFile "src/components/RelatedTools.tsx" $rel

# ------------------------------------------------------------
# 12. frontend/src/components/BlogTeasers.tsx
# ------------------------------------------------------------
$teaser = @'
import { Link } from 'react-router-dom'

type Item = { slug?: string; title: string; blurb?: string; readMin?: number }

export default function BlogTeasers({ items }: { items: Item[] }) {
  const list = items && items.length ? items : [
    { title: 'Guide coming soon' },
    { title: 'Guide coming soon' },
    { title: 'Guide coming soon' },
  ]
  return (
    <section>
      <h2>Guides</h2>
      {list.slice(0, 3).map((it, i) => {
        if (!it.slug) {
          return (
            <div
              key={i}
              style={{ border: '1px dashed #e7e5e4', borderRadius: 12, padding: 14, background: '#fafaf9', marginBottom: 10 }}
            >
              <small style={{ color: '#6b7280', fontSize: 12 }}>Guide coming soon</small>
              <b style={{ display: 'block', fontWeight: 500 }}>{it.title}</b>
            </div>
          )
        }
        return (
          <Link
            key={it.slug}
            to={`/blog/${it.slug}`}
            style={{ display: 'block', border: '1px solid #e7e5e4', borderRadius: 12, padding: 14, background: '#fafaf9', textDecoration: 'none', color: '#1c1917', marginBottom: 10 }}
          >
            <small style={{ color: '#6b7280', fontSize: 12 }}>Guide · {it.readMin || 5} min read</small>
            <b style={{ display: 'block', fontWeight: 500 }}>{it.title}</b>
            {it.blurb && <span style={{ color: '#6b7280', fontSize: 13 }}>{it.blurb}</span>}
          </Link>
        )
      })}
    </section>
  )
}
'@
WriteFile "src/components/BlogTeasers.tsx" $teaser

# ------------------------------------------------------------
# 13. frontend/src/components/ToolShell.tsx
#     Shared wrapper: breadcrumb, H1, article, FAQs, share, related, blog.
# ------------------------------------------------------------
$shell = @'
import { ReactNode } from 'react'
import { Link } from 'react-router-dom'
import FaqSection, { buildFaqJsonLd } from './FaqSection'
import ShareButtons from './ShareButtons'
import RelatedTools from './RelatedTools'
import BlogTeasers from './BlogTeasers'
import Seo from './Seo'

type FaqGroup = { heading: string; items: { q: string; a: string }[] }
type Related = { name: string; href: string; blurb: string }
type Guide = { slug?: string; title: string; blurb?: string; readMin?: number }

type Props = {
  title: string
  description: string
  path: string
  crumb: { label: string; to: string }[]
  h1: string
  lead: string
  children: ReactNode
  article: ReactNode
  faqGroups: FaqGroup[]
  related: Related[]
  guides?: Guide[]
}

export default function ToolShell(p: Props) {
  const jsonLd = buildFaqJsonLd(p.faqGroups)
  return (
    <>
      <Seo title={p.title} description={p.description} path={p.path} jsonLd={jsonLd} />
      <div style={{ maxWidth: 820, margin: '0 auto', padding: '0 18px' }}>
        <div style={{ fontSize: 13, color: '#6b7280', margin: '20px 0 4px' }}>
          <Link to="/" style={{ color: '#6b7280' }}>Home</Link>
          {p.crumb.map((c) => (
            <span key={c.to}> / <Link to={c.to} style={{ color: '#6b7280' }}>{c.label}</Link></span>
          ))}
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
'@
WriteFile "src/components/ToolShell.tsx" $shell

# ------------------------------------------------------------
# 14. frontend/src/pages/legal/Disclaimer.tsx
# ------------------------------------------------------------
$disclaimer = @'
import Seo from '../../components/Seo'

export default function Disclaimer() {
  return (
    <>
      <Seo
        title="Disclaimer | PPM Creator"
        description="How PPM Creator tools work, what they do not guarantee, and how to use them responsibly."
        path="/disclaimer"
      />
      <main style={{ maxWidth: 820, margin: '0 auto', padding: '32px 18px', lineHeight: 1.7 }}>
        <h1>Disclaimer</h1>
        <p>PPM Creator provides free online tools for images, PDFs, text and everyday calculations. The tools are provided as-is. We do not guarantee any specific result, file size or outcome.</p>
        <h2>No guarantee of outcome</h2>
        <p>Compression, conversion and calculation results depend on the input file and your device. Always check important output before using it for a form, submission or publication.</p>
        <h2>Not professional advice</h2>
        <p>Nothing on this site is legal, financial, medical or government advice. For official form sizes, fees or deadlines, always check the official instructions published by the relevant authority.</p>
        <h2>Third-party links</h2>
        <p>Some pages link to external sites. We are not responsible for their content or privacy practices.</p>
        <h2>Contact</h2>
        <p>Questions? Email hello@ppmcreator.com.</p>
      </main>
    </>
  )
}
'@
WriteFile "src/pages/legal/Disclaimer.tsx" $disclaimer

# ------------------------------------------------------------
# 15. frontend/src/pages/legal/Sitemap.tsx
# ------------------------------------------------------------
$sitemapPage = @'
import { Link } from 'react-router-dom'
import Seo from '../../components/Seo'

const groups = [
  {
    title: 'Main pages',
    items: [
      { label: 'Home', to: '/' },
      { label: 'Blog', to: '/blog' },
      { label: 'About', to: '/about' },
      { label: 'Contact', to: '/contact' },
      { label: 'Privacy', to: '/privacy-policy' },
      { label: 'Terms', to: '/terms' },
      { label: 'Disclaimer', to: '/disclaimer' },
    ],
  },
  {
    title: 'Image tools',
    items: [
      { label: 'Image Compressor', to: '/image-compress' },
      { label: 'Image Resizer', to: '/image-resize' },
      { label: 'Image Converter', to: '/image-convert' },
      { label: 'Image Cropper', to: '/image-crop' },
      { label: 'Image Rotate', to: '/image-rotate' },
      { label: 'Image to PDF', to: '/image-to-pdf' },
      { label: 'Image to Base64', to: '/image-to-base64' },
      { label: 'Meme Generator', to: '/meme-generator' },
      { label: 'Image to Text', to: '/image-to-text' },
      { label: 'Passport Photo', to: '/passport-photo' },
      { label: 'Image Color Picker', to: '/image-color-picker' },
      { label: 'Image Watermark', to: '/image-watermark' },
      { label: 'Favicon Generator', to: '/favicon-generator' },
      { label: 'Background Remover', to: '/bg-remover' },
    ],
  },
  {
    title: 'PDF tools',
    items: [
      { label: 'Merge PDF', to: '/pdf-merge' },
      { label: 'Split PDF', to: '/pdf-split' },
      { label: 'Compress PDF', to: '/pdf-compress' },
      { label: 'Protect PDF', to: '/pdf-protect' },
      { label: 'Unlock PDF', to: '/pdf-unlock' },
      { label: 'PDF to Word', to: '/pdf-to-word' },
      { label: 'PDF to Excel', to: '/pdf-to-excel' },
      { label: 'PDF to PPT', to: '/pdf-to-ppt' },
      { label: 'PDF to CSV', to: '/pdf-to-csv' },
      { label: 'PDF to HTML', to: '/pdf-to-html' },
    ],
  },
  {
    title: 'Converters',
    items: [
      { label: 'Word to PDF', to: '/word-to-pdf' },
      { label: 'Word to Excel', to: '/word-to-excel' },
      { label: 'Word to PPT', to: '/word-to-ppt' },
      { label: 'Word to HTML', to: '/word-to-html' },
      { label: 'Excel to PDF', to: '/excel-to-pdf' },
      { label: 'Excel to Word', to: '/excel-to-word' },
      { label: 'Excel to CSV', to: '/excel-to-csv' },
      { label: 'PPT to PDF', to: '/ppt-to-pdf' },
      { label: 'CSV to PDF', to: '/csv-to-pdf' },
      { label: 'CSV to JSON', to: '/csv-to-json' },
      { label: 'Office to PDF', to: '/office-to-pdf' },
      { label: 'HTML to Text', to: '/html-to-text' },
    ],
  },
  {
    title: 'Calculators & text',
    items: [
      { label: 'Age Calculator', to: '/age-calculator' },
      { label: 'Percentage Calculator', to: '/percentage-calc' },
      { label: 'Unit Converter', to: '/unit-converter' },
      { label: 'Word Counter', to: '/word-counter' },
      { label: 'Text Case Converter', to: '/text-case-converter' },
      { label: 'Password Generator', to: '/password-generator' },
      { label: 'QR Code Generator', to: '/qr-code-gen' },
      { label: 'CV Maker', to: '/cv-maker' },
      { label: 'EXIF Viewer', to: '/exif-viewer' },
    ],
  },
]

export default function SitemapPage() {
  return (
    <>
      <Seo
        title="Sitemap | PPM Creator"
        description="Browse every page and tool on PPM Creator."
        path="/sitemap"
      />
      <main style={{ maxWidth: 820, margin: '0 auto', padding: '32px 18px' }}>
        <h1>Sitemap</h1>
        {groups.map((g) => (
          <section key={g.title} style={{ marginTop: 24 }}>
            <h2>{g.title}</h2>
            <ul style={{ paddingLeft: 22 }}>
              {g.items.map((it) => (
                <li key={it.to}><Link to={it.to} style={{ color: '#1c1917' }}>{it.label}</Link></li>
              ))}
            </ul>
          </section>
        ))}
      </main>
    </>
  )
}
'@
WriteFile "src/pages/legal/Sitemap.tsx" $sitemapPage

# ------------------------------------------------------------
# 16. Fix site.json (only change "url")
# ------------------------------------------------------------
Write-Host "`n=== Fixing existing files (targeted edits) ===" -ForegroundColor Cyan
$existing = Join-Path $root "src\data\site.json"
if (Test-Path -LiteralPath $existing) {
  $raw = [System.IO.File]::ReadAllText($existing)
  $raw2 = $raw -replace '"url"\s*:\s*"https://ppmcreator\.com"', '"url": "https://ppmcreator.pages.dev"'
  if ($raw2 -ne $raw) {
    [System.IO.File]::WriteAllText($existing, $raw2, $utf8)
    Write-Host "  [~] src/data/site.json : url -> https://ppmcreator.pages.dev" -ForegroundColor Yellow
  } else {
    Write-Host "  [=] src/data/site.json : no change needed" -ForegroundColor DarkGray
  }
}

# ------------------------------------------------------------
# 17. Fix Home.tsx emojis (mojibake -> real emoji). Body untouched.
# ------------------------------------------------------------
$homePath = Join-Path $root "src\pages\Home.tsx"
if (Test-Path -LiteralPath $homePath) {
  $home = [System.IO.File]::ReadAllText($homePath)
  $pairs = @{
    'ðŸ“‘' = '📝'; 'ðŸ”—' = '🔗'; 'âœ‚ï¸' = '✂️'; 'ðŸ“‰' = '📉'; 'ðŸ”’' = '🔒'
    'ðŸ”“' = '🔓'; 'ðŸ–¼ï¸' = '🖼️'; 'ðŸ“' = '📐'; 'ðŸ”„' = '🔄'; 'ðŸŽ¨' = '🎨'
    'ðŸ’§' = '💧'; 'â­' = '⭐'; 'ðŸ‘¤' = '👤'; 'ðŸ’»' = '💻'; 'ðŸ˜‚' = '😂'
    'ðŸ”' = '🔍'; 'ðŸ”¤' = '🔤'; 'ðŸ”‘' = '🔑'; 'ðŸ“' = '📏'; 'ðŸ“·' = '📷'
    'ðŸ“„' = '📄'; 'ðŸ“Š' = '📊'; 'ðŸ“ˆ' = '📈'; 'ðŸ“½ï¸' = '📽️'; 'ðŸ“±' = '📱'
    'ðŸ“‹' = '📋'; 'ðŸŽ¬' = '🎬'; 'ðŸŽ‚' = '🎂'; 'ðŸ§®' = '🧮'
  }
  $before = $home
  foreach ($k in $pairs.Keys) { $home = $home.Replace($k, $pairs[$k]) }
  if ($home -ne $before) {
    [System.IO.File]::WriteAllText($homePath, $home, $utf8)
    Write-Host "  [~] src/pages/Home.tsx : emoji fixed (body untouched)" -ForegroundColor Yellow
  } else {
    Write-Host "  [=] src/pages/Home.tsx : no mojibake found" -ForegroundColor DarkGray
  }
}

# ------------------------------------------------------------
# 18. router.tsx - add 2 new routes only (Disclaimer, Sitemap)
# ------------------------------------------------------------
$routerPath = Join-Path $root "src\router.tsx"
if (Test-Path -LiteralPath $routerPath) {
  $rt = [System.IO.File]::ReadAllText($routerPath)
  $orig = $rt

  if ($rt -notmatch "legal/Disclaimer") {
    $rt = $rt -replace "(import Terms from '\./pages/legal/Terms')", "`$1`r`nimport Disclaimer from './pages/legal/Disclaimer'`r`nimport SitemapPage from './pages/legal/Sitemap'"
  }
  if ($rt -notmatch "path: 'disclaimer'") {
    $rt = $rt -replace "(\{ path: 'terms', element: <Terms /> \},)", "`$1`r`n      { path: 'disclaimer', element: <Disclaimer /> },`r`n      { path: 'sitemap', element: <SitemapPage /> },"
  }
  if ($rt -ne $orig) {
    [System.IO.File]::WriteAllText($routerPath, $rt, $utf8)
    Write-Host "  [~] src/router.tsx : added /disclaimer and /sitemap routes" -ForegroundColor Yellow
  } else {
    Write-Host "  [=] src/router.tsx : routes already present" -ForegroundColor DarkGray
  }
}

# ------------------------------------------------------------
# 19. db/schema_v5.sql (new tables only; does NOT touch old analytics)
# ------------------------------------------------------------
$dbRoot = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\db"
$schema5 = @'
-- Group 1 additions. Safe to re-run (IF NOT EXISTS).
-- Privacy: NO IP addresses, NO file names, NO personal data.
-- Only counts, tool slugs, and admin auth metadata.

-- Aggregated tool usage. One row per (tool, event, day).
CREATE TABLE IF NOT EXISTS tool_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  tool_slug TEXT NOT NULL,
  event TEXT NOT NULL CHECK (event IN ('run','download')),
  day TEXT NOT NULL,                 -- YYYY-MM-DD (UTC)
  count INTEGER NOT NULL DEFAULT 0,
  UNIQUE(tool_slug, event, day)
);

-- Aggregated page views. One row per (page, day). No IP, no referrer.
CREATE TABLE IF NOT EXISTS page_views (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_url TEXT NOT NULL,
  day TEXT NOT NULL,
  count INTEGER NOT NULL DEFAULT 0,
  UNIQUE(page_url, day)
);

-- Admin sessions (server-side, hashed token).
CREATE TABLE IF NOT EXISTS admin_sessions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  token_hash TEXT NOT NULL UNIQUE,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_seen_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  user_agent TEXT,
  revoked INTEGER NOT NULL DEFAULT 0
);

-- Login history. Failed attempts without password, without IP.
CREATE TABLE IF NOT EXISTS login_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT NOT NULL,
  result TEXT NOT NULL CHECK (result IN ('success','failed')),
  user_agent TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_tool_events_day ON tool_events(day);
CREATE INDEX IF NOT EXISTS idx_page_views_day ON page_views(day);
CREATE INDEX IF NOT EXISTS idx_login_attempts_username_time ON login_attempts(username, created_at);
'@
$schema5Path = Join-Path $dbRoot "schema_v5.sql"
[System.IO.File]::WriteAllText($schema5Path, $schema5, $utf8)
Write-Host "  [+] db/schema_v5.sql" -ForegroundColor Green

# ------------------------------------------------------------
# 20. Build
# ------------------------------------------------------------
Write-Host "`n=== Building (npm run build) ===" -ForegroundColor Cyan
Push-Location $root
try {
  npm run build
} finally {
  Pop-Location
}

# ------------------------------------------------------------
# 21. Group 1 report
# ------------------------------------------------------------
$report = @"
# Group 1 Report — Foundation

Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm')

## Files created
- frontend/public/site.json
- frontend/public/robots.txt
- frontend/public/sitemap.xml
- frontend/src/lib/seo.ts
- frontend/src/components/Seo.tsx
- frontend/src/components/UploadBox.tsx
- frontend/src/components/LiveSizeSlider.tsx
- frontend/src/components/DownloadButton.tsx
- frontend/src/components/FaqSection.tsx
- frontend/src/components/ShareButtons.tsx
- frontend/src/components/RelatedTools.tsx
- frontend/src/components/BlogTeasers.tsx
- frontend/src/components/ToolShell.tsx
- frontend/src/pages/legal/Disclaimer.tsx
- frontend/src/pages/legal/Sitemap.tsx
- db/schema_v5.sql

## Files edited (targeted, non-destructive)
- frontend/src/data/site.json  -> url changed to https://ppmcreator.pages.dev
- frontend/src/pages/Home.tsx  -> emoji mojibake fixed. Body untouched. Video Downloader kept.
- frontend/src/router.tsx      -> /disclaimer and /sitemap routes added. Nothing removed.

## Files NOT touched (as requested)
- frontend/src/pages/tools/VideoDownloader.tsx
- frontend/src/config/toolsRegistry.ts
- frontend/src/pages/Home.tsx body (only emoji strings changed)
- All existing tool pages
- All db/schema_v*.sql existing files

## Migration to run (after this script succeeds)