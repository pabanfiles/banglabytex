import { useEffect, useState } from 'react'
import { card, h2, btnP, input, label, note } from '../ui'

export default function SettingsTab() {
  const [siteName, setSiteName] = useState('PPM Creator Tools')
  const [email, setEmail] = useState('hello@ppmcreator.com')
  const [social, setSocial] = useState('@ppmcreator')
  const [ga, setGa] = useState('')
  const [adsense, setAdsense] = useState('')
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetch('/api/tools?settings=1').then((r) => r.json()).then((d) => {
      setSiteName(d?.site_name || 'PPM Creator Tools')
    }).catch(() => {})
  }, [])

  const save = async () => {
    try { await fetch('/api/tools', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ settings: { site_name: siteName, contact_email: email, social, ga, adsense } }) }); setSaved(true); setTimeout(() => setSaved(false), 1600) } catch { alert('Save failed.') }
  }

  return (
    <div style={card}>
      <h2 style={h2}>Site settings</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div>
          <label style={label}>Site name<input value={siteName} onChange={(e) => setSiteName(e.target.value)} style={input} /></label>
          <label style={label}>Contact email<input value={email} onChange={(e) => setEmail(e.target.value)} style={input} /></label>
          <label style={label}>Social handle<input value={social} onChange={(e) => setSocial(e.target.value)} style={input} /></label>
        </div>
        <div>
          <label style={label}>Google Analytics ID (leave empty to stay off)<input value={ga} onChange={(e) => setGa(e.target.value)} placeholder="G-XXXXXXX" style={input} /></label>
          <label style={label}>AdSense publisher ID (after approval)<input value={adsense} onChange={(e) => setAdsense(e.target.value)} placeholder="ca-pub-..." style={input} /></label>
          <button onClick={save} style={btnP}>Save settings</button>
          {saved && <span style={{ color: '#15803D', fontSize: 13, marginLeft: 10 }}>Saved</span>}
        </div>
      </div>
      <div style={note}>The GA and AdSense IDs are optional. Leave empty to keep the site without analytics or ads.</div>
    </div>
  )
}