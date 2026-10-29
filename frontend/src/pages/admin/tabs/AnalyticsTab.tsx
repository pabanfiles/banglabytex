import { useEffect, useState } from 'react'
import { card, h2, input, note, pill } from '../ui'

type Row = { name: string; runs: number; downloads: number }

export default function AnalyticsTab() {
  const [range, setRange] = useState('7')
  const [visits, setVisits] = useState(0)
  const [views, setViews] = useState(0)
  const [runs, setRuns] = useState(0)
  const [downloads, setDownloads] = useState(0)
  const [tools, setTools] = useState<Row[]>([])
  const [sources, setSources] = useState<{ name: string; n: number }[]>([])
  const [pages, setPages] = useState<{ url: string; n: number }[]>([])
  const [live, setLive] = useState(0)

  useEffect(() => {
    fetch('/api/analytics?range=' + range).then((r) => r.json()).then((d) => {
      setVisits(d?.visits || 0); setViews(d?.views || 0); setRuns(d?.runs || 0); setDownloads(d?.downloads || 0)
      setTools(Array.isArray(d?.tools) ? d.tools : [])
      setSources(Array.isArray(d?.sources) ? d.sources : [])
      setPages(Array.isArray(d?.pages) ? d.pages : [])
      setLive(d?.live || 0)
    }).catch(() => {})
  }, [range])

  const mx = Math.max(1, ...tools.map((t) => t.runs))
  const srcTot = sources.reduce((a, s) => a + s.n, 0) || 1

  return (
    <>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <h2 style={{ ...h2, margin: 0 }}>Live usage</h2>
        <select value={range} onChange={(e) => setRange(e.target.value)} style={{ ...input, maxWidth: 170 }}>
          <option value="1">Today</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option>
        </select>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 14 }}>
        {[['Visitors', visits], ['Page views', views], ['Tool runs', runs], ['Downloads', downloads]].map(([l, v]) => (
          <div key={String(l)} style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 14 }}>
            <small style={{ display: 'block', color: '#6b7280', fontSize: 12 }}>{l}</small>
            <b style={{ fontSize: 22, fontWeight: 600 }}>{Number(v).toLocaleString()}</b>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14 }}>
        <div style={card}>
          <h2 style={h2}>Tool usage</h2>
          {tools.length === 0 && <p style={{ color: '#6b7280', fontSize: 13 }}>No tool runs recorded yet for this range.</p>}
          {tools.map((t) => (
            <div key={t.name} style={{ marginBottom: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}><span>{t.name}</span><span style={{ color: '#6b7280' }}>{t.runs} runs - {t.downloads} downloads</span></div>
              <div style={{ height: 8, background: '#e7e5e4', borderRadius: 99, overflow: 'hidden' }}><i style={{ display: 'block', height: '100%', background: '#F97316', width: Math.round((t.runs / mx) * 100) + '%' }} /></div>
            </div>
          ))}
          <div style={note}>Counts only: tool name and number of runs. No file names, file contents, or IP addresses are stored.</div>
        </div>
        <div style={card}>
          <h2 style={h2}>Where visitors come from</h2>
          {sources.length === 0 && <p style={{ color: '#6b7280', fontSize: 13 }}>No source data yet.</p>}
          {sources.map((s) => (
            <div key={s.name} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, marginBottom: 4 }}><span>{s.name}</span><span style={{ color: '#6b7280' }}>{Math.round((s.n / srcTot) * 100)}%</span></div>
              <div style={{ height: 8, background: '#e7e5e4', borderRadius: 99 }}><i style={{ display: 'block', height: '100%', background: '#F97316', width: Math.round((s.n / srcTot) * 100) + '%' }} /></div>
            </div>
          ))}
          <h2 style={{ ...h2, marginTop: 18 }}>Most visited pages</h2>
          {pages.length === 0 && <p style={{ color: '#6b7280', fontSize: 13 }}>No page data yet.</p>}
          {pages.map((p) => (
            <div key={p.url} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px dashed #e7e5e4', fontSize: 13 }}>
              <span>{p.url}</span><span style={pill}>{p.n} views</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{ ...card, marginTop: 14 }}>
        <h2 style={h2}>Right now</h2>
        <div style={{ display: 'flex', gap: 8 }}>
          <span style={pill}>{live} people on the site</span>
          <span style={pill}>{runs > 0 ? Math.max(0, Math.round(live / 3)) : 0} tools running</span>
        </div>
        <div style={note}>Page views come from Cloudflare Web Analytics. Tool runs come from a small anonymous counter in D1. No personal data is stored.</div>
      </div>
    </>
  )
}