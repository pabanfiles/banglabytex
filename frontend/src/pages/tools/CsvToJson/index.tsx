import { useState } from 'react'
import ToolShell from '@/components/ToolShell'

function parseCsv(text: string): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/)
  if (lines.length < 2) return []
  const splitLine = (line: string) => {
    const out: string[] = []
    let cur = '', inQ = false
    for (let i = 0; i < line.length; i++) {
      const c = line[i]
      if (c === '\"') { if (inQ && line[i + 1] === '\"') { cur += '\"'; i++ } else inQ = !inQ }
      else if (c === ',' && !inQ) { out.push(cur); cur = '' }
      else cur += c
    }
    out.push(cur)
    return out
  }
  const headers = splitLine(lines[0]).map((h) => h.trim())
  return lines.slice(1).map((line) => {
    const cells = splitLine(line)
    const row: Record<string, string> = {}
    headers.forEach((h, i) => { row[h] = cells[i] ?? '' })
    return row
  })
}

export default function CsvToJson() {
  const [csv, setCsv] = useState('')
  const [json, setJson] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const convert = () => {
    setError('')
    try {
      const rows = parseCsv(csv)
      if (rows.length === 0) { setError('Paste CSV with a header row and at least one data row.'); return }
      setJson(JSON.stringify(rows, null, 2))
    } catch { setError('Could not parse this CSV.') }
  }
  const copy = async () => { try { await navigator.clipboard.writeText(json); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch {} }

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this tool do?', a: 'It reads a CSV file as text and outputs a JSON array of objects. The first row is treated as the header row.' },
      { q: 'Is it free?', a: 'Yes. No account, no upload.' },
      { q: 'Is my CSV uploaded?', a: 'No. The parsing runs in your browser.' },
    ]},
    { heading: 'CSV format', items: [
      { q: 'Which CSV dialects are supported?', a: 'The parser handles quoted fields and escaped quotes, which covers most exports from spreadsheets and databases.' },
      { q: 'What if a row has fewer cells than the header?', a: 'Missing cells become empty strings, so the JSON stays valid.' },
      { q: 'What about numbers?', a: 'Values are kept as strings. Convert them later with a small script if the target requires numbers.' },
    ]},
    { heading: 'Privacy', items: [
      { q: 'Is the JSON saved?', a: 'No. Reload the page and the fields clear.' },
      { q: 'Can I convert a large file?', a: 'Yes, up to browser memory. A few hundred rows is easily handled.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to convert CSV to JSON</h2>
      <ol>
        <li>Paste CSV text with a header row.</li>
        <li>Press Convert.</li>
        <li>Copy the JSON.</li>
      </ol>
      <h2>Why use this tool</h2>
      <p>Quick way to move data from a spreadsheet to JSON. Local parsing, no upload.</p>
      <h2>Privacy and data</h2>
      <p>Nothing is uploaded.</p>
    </>
  )

  return (
    <ToolShell
      title="CSV to JSON Converter Online Free | PPM Creator"
      description="Convert CSV text to JSON. Runs in your browser."
      path="/csv-to-json"
      crumb={[{ label: 'Text Tools', to: '/calculators' }]}
      h1="CSV to JSON"
      lead="Paste CSV with a header row to get JSON."
      faqGroups={faqGroups}
      related={[
        { name: 'HTML to Text', href: '/html-to-text', blurb: 'Remove HTML tags' },
        { name: 'Word Counter', href: '/word-counter', blurb: 'Count words and characters' },
        { name: 'Text Case Converter', href: '/text-case-converter', blurb: 'Change text case' },
        { name: 'Password Generator', href: '/password-generator', blurb: 'Generate a strong password' },
      ]}
      guides={[
        { title: 'Moving data from a spreadsheet to JSON' },
        { title: 'Quoted fields in CSV' },
        { title: 'Why CSV numbers can lose precision' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        <textarea value={csv} onChange={(e) => setCsv(e.target.value)} rows={6} placeholder={'name,age\nAlice,30\nBob,25'} style={{ width: '100%', padding: 12, border: '1px solid #e7e5e4', borderRadius: 10, fontSize: 13, fontFamily: 'monospace' }} />
        <button type="button" onClick={convert} style={{ marginTop: 10, border: 0, padding: '10px 16px', borderRadius: 10, background: '#F97316', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Convert</button>
        {json && (<>
          <textarea readOnly value={json} rows={10} style={{ width: '100%', padding: 12, border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 12, fontSize: 12, fontFamily: 'monospace' }} />
          <button type="button" onClick={copy} style={{ marginTop: 10, border: '1px solid #e7e5e4', padding: '10px 16px', borderRadius: 10, background: 'transparent', cursor: 'pointer' }}>{copied ? 'Copied' : 'Copy JSON'}</button>
        </>)}
        {error && <p role="alert" style={{ color: '#be123c', fontSize: 14, marginTop: 10 }}>{error}</p>}
      </section>
    </ToolShell>
  )
}