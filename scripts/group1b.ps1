$ErrorActionPreference = "Stop"
$root = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend"
$utf8 = New-Object System.Text.UTF8Encoding $false
function WF($rel, $body) {
  $full = Join-Path $root $rel
  $dir = Split-Path $full -Parent
  if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  [System.IO.File]::WriteAllText($full, $body, $utf8)
  Write-Host "  [+] $rel" -ForegroundColor Green
}
Write-Host "=== Group 1 : Part B ===" -ForegroundColor Cyan

# UploadBox
WF "src/components/UploadBox.tsx" @"
import { useRef, useState } from 'react'

export default function UploadBox({ accept = 'image/*', maxMB = 25, hint, onFile }) {
  const [drag, setDrag] = useState(false)
  const [error, setError] = useState('')
  const inputRef = useRef(null)
  const handle = (file) => {
    setError('')
    if (!file) return
    if (maxMB && file.size > maxMB * 1024 * 1024) { setError('This file is over ' + maxMB + ' MB.'); return }
    onFile(file)
  }
  return (
    <div style={{ position: 'relative' }}>
      <div
        onDragOver={(e) => { e.preventDefault(); setDrag(true) }}
        onDragLeave={() => setDrag(false)}
        onDrop={(e) => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files?.[0]) }}
        style={{ border: '2px dashed ' + (drag ? '#F97316' : '#e7e5e4'), borderRadius: 14, padding: '34px 14px', textAlign: 'center', background: '#fff' }}
      >
        <b style={{ display: 'block', fontSize: 17, fontWeight: 600 }}>Choose a file or drop it here</b>
        <small style={{ color: '#6b7280' }}>{hint || ('Up to ' + maxMB + ' MB - nothing is uploaded')}</small>
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        aria-label="Choose a file"
        onChange={(e) => { handle(e.target.files?.[0]); if (inputRef.current) inputRef.current.value = '' }}
        style={{ position: 'absolute', left: 0, top: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer', fontSize: 0 }}
      />
      {error ? <p role="alert" style={{ color: '#be123c', fontSize: 14, marginTop: 10 }}>{error}</p> : null}
    </div>
  )
}
"@

# LiveSizeSlider
WF "src/components/LiveSizeSlider.tsx" @"
function kb(b) { return b < 1048576 ? (b / 1024).toFixed(0) + ' KB' : (b / 1048576).toFixed(2) + ' MB' }
export default function LiveSizeSlider({ value, min = 10, max = 100, onChange, originalBytes, newBytes, busy }) {
  const target = Math.round((originalBytes * value) / 100)
  const saved = newBytes != null && originalBytes > 0 ? Math.max(0, Math.round((1 - newBytes / originalBytes) * 100)) : null
  return (
    <div>
      <label style={{ fontSize: 14, fontWeight: 500 }}>Target size: how much of the original to keep</label>
      <input type="range" min={min} max={max} step={1} value={value} onChange={(e) => onChange(Number(e.target.value))} style={{ width: '100%', accentColor: '#F97316', margin: '8px 0 2px' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 14, color: '#6b7280' }}>
        <span>{value}% of original = {kb(target)}</span>
        <span>{busy ? 'Calculating...' : (saved != null ? 'Saved ' + saved + '%' : '')}</span>
      </div>
    </div>
  )
}
"@

# DownloadButton
WF "src/components/DownloadButton.tsx" @"
import { useState } from 'react'
export default function DownloadButton({ getBlob, filename, label = 'Download' }) {
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const onClick = async () => {
    setBusy(true); setError('')
    try {
      const results = await Promise.all([getBlob(), new Promise((r) => setTimeout(r, 900))])
      const blob = results[0]
      if (!blob) { setError('Nothing to download yet.'); return }
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = filename
      document.body.appendChild(a); a.click(); a.remove()
      setTimeout(() => URL.revokeObjectURL(url), 4000)
    } catch { setError('Something went wrong. Please try again.') }
    finally { setBusy(false) }
  }
  return (
    <div>
      <button type="button" onClick={onClick} disabled={busy} style={{ border: 0, borderRadius: 10, padding: '12px 20px', fontWeight: 600, color: '#fff', background: '#F97316', cursor: busy ? 'wait' : 'pointer', opacity: busy ? 0.6 : 1, marginRight: 8 }}>
        {busy ? 'Processing...' : label}
      </button>
      {error ? <p role="alert" style={{ color: '#be123c', fontSize: 14 }}>{error}</p> : null}
    </div>
  )
}
"@

# FaqSection
WF "src/components/FaqSection.tsx" @"
export function buildFaqJsonLd(groups) {
  const all = groups.flatMap((g) => g.items)
  return { '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: all.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a } })) }
}
export default function FaqSection({ groups }) {
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
"@

# ShareButtons
WF "src/components/ShareButtons.tsx" @"
import { useState } from 'react'
export default function ShareButtons({ path, title = 'PPM Creator' }) {
  const [copied, setCopied] = useState(false)
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ppmcreator.pages.dev'
  const url = origin + path
  const e = encodeURIComponent(url)
  const t = encodeURIComponent(title)
  const links = [
    { label: 'WhatsApp', href: 'https://wa.me/?text=' + t + '%20' + e },
    { label: 'Facebook', href: 'https://www.facebook.com/sharer/sharer.php?u=' + e },
    { label: 'X', href: 'https://twitter.com/intent/tweet?url=' + e + '&text=' + t },
    { label: 'Telegram', href: 'https://t.me/share/url?url=' + e + '&text=' + t },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/sharing/share-offsite/?url=' + e },
    { label: 'Pinterest', href: 'https://pinterest.com/pin/create/button/?url=' + e },
    { label: 'Email', href: 'mailto:?subject=' + t + '&body=' + e }
  ]
  const copy = async () => { try { await navigator.clipboard.writeText(url); setCopied(true); setTimeout(() => setCopied(false), 1600) } catch {} }
  const style = { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', minHeight: 38, padding: '0 16px', borderRadius: 99, border: '1px solid #e7e5e4', fontSize: 13, fontWeight: 500, color: '#1c1917', background: '#fff', textDecoration: 'none', cursor: 'pointer', marginRight: 8, marginBottom: 8 }
  return (
    <div>
      <h2>Share this tool</h2>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {links.map((l) => <a key={l.label} href={l.href} target="_blank" rel="noopener noreferrer" style={style}>{l.label}</a>)}
        <button type="button" onClick={copy} style={style}>{copied ? 'Copied' : 'Copy link'}</button>
      </div>
    </div>
  )
}
"@

# RelatedTools
WF "src/components/RelatedTools.tsx" @"
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
"@

# BlogTeasers
WF "src/components/BlogTeasers.tsx" @"
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
"@

# ToolShell
WF "src/components/ToolShell.tsx" @"
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
"@

Write-Host "  Done part B" -ForegroundColor Green