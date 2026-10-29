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