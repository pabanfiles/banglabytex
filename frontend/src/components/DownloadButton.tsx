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