$ErrorActionPreference = "Stop"
$utf8 = New-Object System.Text.UTF8Encoding $false
$root = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend\src\pages\tools"
function WF($rel, $body) {
  $full = Join-Path $root $rel
  $dir = Split-Path $full -Parent
  if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  [System.IO.File]::WriteAllText($full, $body, $utf8)
  Write-Host "  [+] $rel" -ForegroundColor Green
}
function BK($rel) { $f = Join-Path $root $rel; if (Test-Path -LiteralPath $f) { Copy-Item -LiteralPath $f -Destination "$f.bak" -Force } }

Write-Host "=== Batch 6b : UnitConverter ===" -ForegroundColor Cyan

BK "UnitConverter\index.tsx"
WF "UnitConverter\index.tsx" @"
import { useState } from 'react'
import ToolShell from '@/components/ToolShell'

type Cat = 'length' | 'weight' | 'temp' | 'area' | 'volume'
const UNITS: Record<Cat, { name: string; factor: number }[]> = {
  length: [{ name: 'Millimetre', factor: 0.001 }, { name: 'Centimetre', factor: 0.01 }, { name: 'Metre', factor: 1 }, { name: 'Kilometre', factor: 1000 }, { name: 'Inch', factor: 0.0254 }, { name: 'Foot', factor: 0.3048 }, { name: 'Yard', factor: 0.9144 }, { name: 'Mile', factor: 1609.344 }],
  weight: [{ name: 'Milligram', factor: 0.000001 }, { name: 'Gram', factor: 0.001 }, { name: 'Kilogram', factor: 1 }, { name: 'Tonne', factor: 1000 }, { name: 'Ounce', factor: 0.0283495 }, { name: 'Pound', factor: 0.453592 }],
  area: [{ name: 'Square metre', factor: 1 }, { name: 'Square foot', factor: 0.092903 }, { name: 'Square yard', factor: 0.836127 }, { name: 'Acre', factor: 4046.86 }, { name: 'Hectare', factor: 10000 }],
  volume: [{ name: 'Millilitre', factor: 0.001 }, { name: 'Litre', factor: 1 }, { name: 'Cubic metre', factor: 1000 }, { name: 'Teaspoon', factor: 0.00492892 }, { name: 'Tablespoon', factor: 0.0147868 }, { name: 'Cup', factor: 0.236588 }, { name: 'Pint', factor: 0.473176 }, { name: 'Gallon (US)', factor: 3.78541 }],
  temp: [{ name: 'Celsius', factor: 1 }, { name: 'Fahrenheit', factor: 1 }, { name: 'Kelvin', factor: 1 }],
}

export default function UnitConverter() {
  const [cat, setCat] = useState<Cat>('length')
  const [from, setFrom] = useState('Metre')
  const [to, setTo] = useState('Foot')
  const [value, setValue] = useState('1')

  const units = UNITS[cat]

  const convert = (): number | null => {
    const n = parseFloat(value)
    if (isNaN(n)) return null
    if (cat === 'temp') {
      let c: number
      if (from === 'Celsius') c = n
      else if (from === 'Fahrenheit') c = (n - 32) * 5 / 9
      else c = n - 273.15
      if (to === 'Celsius') return c
      if (to === 'Fahrenheit') return c * 9 / 5 + 32
      return c + 273.15
    }
    const f = units.find((u) => u.name === from)?.factor || 1
    const t = units.find((u) => u.name === to)?.factor || 1
    return n * f / t
  }
  const r = convert()

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this tool do?', a: 'It converts a value between units of length, weight, temperature, area and volume. Pick a category, choose the units and type a number.' },
      { q: 'Is it free?', a: 'Yes. No account, no upload, no daily limit.' },
      { q: 'How accurate is the conversion?', a: 'The factors are the standard SI and US customary values. Results are rounded to a few decimal places, which is enough for everyday use.' },
    ]},
    { heading: 'Units', items: [
      { q: 'Why does temperature work differently?', a: 'Temperature scales do not share a common zero, so a simple multiplication does not work. The tool converts through Celsius as a middle step.' },
      { q: 'Which gallon do you use?', a: 'US gallon. The UK imperial gallon is larger. If you need imperial, multiply the US gallon value by 0.833.' },
      { q: 'Can I convert very large or small values?', a: 'Yes, up to the limits of JavaScript numbers. For astronomical or sub-atomic scales you may prefer a scientific calculator.' },
    ]},
    { heading: 'Privacy', items: [
      { q: 'Is the value uploaded?', a: 'No. The conversion runs in your browser.' },
      { q: 'Does the tool save the inputs?', a: 'No. Reloading the page clears them.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to use the unit converter</h2>
      <ol>
        <li>Pick a category.</li>
        <li>Choose the from unit and the to unit.</li>
        <li>Type a value. The result updates as you type.</li>
      </ol>
      <h2>Why use this tool</h2>
      <p>It handles the common categories with one interface. No signup and no upload, so it works offline after the page has loaded.</p>
      <h2>Privacy and data</h2>
      <p>Values stay in your browser.</p>
    </>
  )

  return (
    <ToolShell
      title="Unit Converter Online Free | PPM Creator"
      description="Convert length, weight, temperature, area and volume. Runs in your browser."
      path="/unit-converter"
      crumb={[{ label: 'Calculators', to: '/calculators' }]}
      h1="Unit Converter"
      lead="Convert length, weight, temperature, area and volume with one tool."
      faqGroups={faqGroups}
      related={[
        { name: 'Percentage Calculator', href: '/percentage-calc', blurb: 'Calculate percentages easily' },
        { name: 'Age Calculator', href: '/age-calculator', blurb: 'Calculate your exact age' },
        { name: 'Word Counter', href: '/word-counter', blurb: 'Count words and characters' },
        { name: 'Password Generator', href: '/password-generator', blurb: 'Generate a strong password' },
      ]}
      guides={[
        { title: 'Common unit conversions you need' },
        { title: 'US vs UK measurement units' },
        { title: 'Why temperature conversion is different' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          {(['length', 'weight', 'temp', 'area', 'volume'] as Cat[]).map((c) => (
            <button key={c} type="button" onClick={() => { setCat(c); setFrom(UNITS[c][0].name); setTo(UNITS[c][1]?.name || UNITS[c][0].name) }} style={{ padding: '8px 14px', borderRadius: 10, border: '1px solid ' + (cat === c ? '#F97316' : '#e7e5e4'), background: cat === c ? '#FFF7ED' : '#fff', color: cat === c ? '#F97316' : '#1c1917', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>{c}</button>
          ))}
        </div>
        <input type="number" value={value} onChange={(e) => setValue(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e7e5e4', borderRadius: 10, marginBottom: 10, fontSize: 14 }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 12 }}>
          <div>
            <label style={{ fontSize: 12, color: '#6b7280' }}>From</label>
            <select value={from} onChange={(e) => setFrom(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 4 }}>{units.map((u) => <option key={u.name}>{u.name}</option>)}</select>
          </div>
          <div>
            <label style={{ fontSize: 12, color: '#6b7280' }}>To</label>
            <select value={to} onChange={(e) => setTo(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 4 }}>{units.map((u) => <option key={u.name}>{u.name}</option>)}</select>
          </div>
        </div>
        {r != null && <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 14, fontSize: 16 }}>{value} {from} = <b>{Math.round(r * 1000000) / 1000000} {to}</b></div>}
      </section>
    </ToolShell>
  )
}
"@
Write-Host "  [+] UnitConverter done" -ForegroundColor Green

Write-Host "=== Batch 7 : Converters ===" -ForegroundColor Cyan

# ============ HTML TO TEXT ============
BK "HtmlToText\index.tsx"
WF "HtmlToText\index.tsx" @"
import { useState } from 'react'
import ToolShell from '@/components/ToolShell'

export default function HtmlToText() {
  const [html, setHtml] = useState('')
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)

  const convert = () => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const t = doc.body.textContent || ''
    setText(t.replace(/\n{3,}/g, '\n\n').trim())
  }
  const copy = async () => { try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch {} }

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this tool do?', a: 'It strips HTML tags and leaves the visible text. It uses the browser parser, so the result is the text a reader would see.' },
      { q: 'Is it free?', a: 'Yes. No account, no upload.' },
      { q: 'Does it upload my HTML?', a: 'No. The parsing happens in your browser.' },
    ]},
    { heading: 'Handling', items: [
      { q: 'Does it keep line breaks?', a: 'It keeps line breaks inside the text but collapses repeated blank lines to a single blank line for readability.' },
      { q: 'Are links preserved?', a: 'The link text is kept. The URL itself is not, because HTML to plain text usually wants the reader-visible text only.' },
      { q: 'What about scripts and styles?', a: 'Scripts and styles are ignored. Only visible content is kept.' },
    ]},
    { heading: 'Privacy', items: [
      { q: 'Is the text saved?', a: 'No. Reload the page and both fields clear.' },
      { q: 'Can I convert a very large file?', a: 'Yes, up to browser memory. A few hundred kilobytes of HTML is easily handled.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to remove HTML tags</h2>
      <ol>
        <li>Paste HTML into the first box.</li>
        <li>Press Convert.</li>
        <li>Copy the plain text result.</li>
      </ol>
      <h2>Why use this tool</h2>
      <p>When you paste HTML into a text editor, you often want just the text. The browser parser is the most reliable way to get that text, and this tool does it in one click.</p>
      <h2>Privacy and data</h2>
      <p>Parsing is done locally. Nothing is uploaded.</p>
    </>
  )

  return (
    <ToolShell
      title="HTML to Text Converter Online Free | PPM Creator"
      description="Remove HTML tags and get plain text. Runs in your browser."
      path="/html-to-text"
      crumb={[{ label: 'Text Tools', to: '/calculators' }]}
      h1="HTML to Text"
      lead="Paste HTML, remove the tags, and copy the visible text."
      faqGroups={faqGroups}
      related={[
        { name: 'Word Counter', href: '/word-counter', blurb: 'Count words and characters' },
        { name: 'Text Case Converter', href: '/text-case-converter', blurb: 'Change text case' },
        { name: 'CSV to JSON', href: '/csv-to-json', blurb: 'Convert CSV data to JSON' },
        { name: 'Password Generator', href: '/password-generator', blurb: 'Generate a strong password' },
      ]}
      guides={[
        { title: 'Stripping HTML from pasted content' },
        { title: 'What HTML to text loses' },
        { title: 'When to use a DOM parser instead' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        <textarea value={html} onChange={(e) => setHtml(e.target.value)} rows={6} placeholder="<p>Hello <b>world</b></p>" style={{ width: '100%', padding: 12, border: '1px solid #e7e5e4', borderRadius: 10, fontSize: 13, fontFamily: 'monospace' }} />
        <button type="button" onClick={convert} style={{ marginTop: 10, border: 0, padding: '10px 16px', borderRadius: 10, background: '#F97316', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>Convert</button>
        {text && (<>
          <textarea readOnly value={text} rows={6} style={{ width: '100%', padding: 12, border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 12, fontSize: 14, fontFamily: 'inherit' }} />
          <button type="button" onClick={copy} style={{ marginTop: 10, border: '1px solid #e7e5e4', padding: '10px 16px', borderRadius: 10, background: 'transparent', cursor: 'pointer' }}>{copied ? 'Copied' : 'Copy text'}</button>
        </>)}
      </section>
    </ToolShell>
  )
}
"@
Write-Host "  [+] HtmlToText done" -ForegroundColor Green

# ============ CSV TO JSON ============
BK "CsvToJson\index.tsx"
WF "CsvToJson\index.tsx" @"
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
"@
Write-Host "  [+] CsvToJson done" -ForegroundColor Green

# ============ EXIF VIEWER ============
BK "ExifViewer\index.tsx"
WF "ExifViewer\index.tsx" @"
import { useState } from 'react'
import ToolShell from '@/components/ToolShell'
import UploadBox from '@/components/UploadBox'

type Tag = { tag: string; value: string }

function parseExif(buf: ArrayBuffer): Tag[] {
  const view = new DataView(buf)
  if (view.getUint16(0, false) !== 0xffd8) return []
  let offset = 2
  const tags: Tag[] = []
  while (offset < view.byteLength) {
    if (view.getUint16(offset, false) !== 0xffe1) break
    const len = view.getUint16(offset + 2, false)
    const exifStart = offset + 4
    if (view.getUint32(exifStart, false) === 0x45786966) {
      const tiffStart = exifStart + 6
      const little = view.getUint16(tiffStart, false) === 0x4949
      const readU16 = (o: number) => view.getUint16(o, little)
      const readU32 = (o: number) => view.getUint32(o, little)
      if (readU16(tiffStart + 2) === 42) {
        const first = readU32(tiffStart + 4)
        const entries = readU16(tiffStart + first)
        const names: Record<number, string> = {
          0x010f: 'Make', 0x0110: 'Model', 0x0112: 'Orientation',
          0x0131: 'Software', 0x0132: 'DateTime', 0x8769: 'ExifIFDPointer',
          0x8825: 'GPSInfoIFDPointer', 0x9003: 'DateTimeOriginal',
          0xa002: 'PixelXDimension', 0xa003: 'PixelYDimension',
        }
        for (let i = 0; i < entries; i++) {
          const entry = tiffStart + first + 2 + i * 12
          const tag = readU16(entry)
          const type = readU16(entry + 2)
          const count = readU32(entry + 4)
          const valueOffset = entry + 8
          const name = names[tag] || ('0x' + tag.toString(16))
          if (type === 2) {
            const ptr = count > 4 ? tiffStart + readU32(valueOffset) : valueOffset
            let str = ''
            for (let j = 0; j < count; j++) { const ch = view.getUint8(ptr + j); if (ch === 0) break; str += String.fromCharCode(ch) }
            tags.push({ tag: name, value: str })
          } else if (type === 3) {
            tags.push({ tag: name, value: String(readU16(valueOffset)) })
          } else if (type === 4) {
            tags.push({ tag: name, value: String(readU32(valueOffset)) })
          }
        }
      }
    }
    offset += 2 + len
  }
  return tags
}

export default function ExifViewer() {
  const [tags, setTags] = useState<Tag[]>([])
  const [fileName, setFileName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleFile = async (f: File) => {
    setError(''); setTags([]); setFileName(f.name); setLoading(true)
    if (!f.type.startsWith('image/')) { setError('Please choose a JPEG image.'); setLoading(false); return }
    try {
      const buf = await f.arrayBuffer()
      const result = parseExif(buf)
      if (result.length === 0) setError('No EXIF metadata found in this image. PNG and WebP files usually have none.')
      else setTags(result)
    } catch { setError('Could not read the EXIF metadata.') }
    setLoading(false)
  }

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What is EXIF data?', a: 'EXIF is metadata embedded in most camera photos. It can include the camera model, the date and time, and the orientation. Some phones also write GPS data unless location tagging is turned off.' },
      { q: 'What does this tool show?', a: 'It reads the common EXIF tags of a JPEG file and displays them as a table. PNG and WebP files usually have no EXIF, and the tool says so.' },
      { q: 'Is my image uploaded?', a: 'No. The file is read in your browser and is not sent to any server.' },
    ]},
    { heading: 'Privacy', items: [
      { q: 'Does it show GPS location?', a: 'It can show the GPS tags if they are present, as raw values. It does not plot them on a map.' },
      { q: 'Should I remove EXIF before sharing?', a: 'Yes, if the photo has GPS or other private data. Use a metadata remover or re-save the image through a tool that strips EXIF, like a screenshot.' },
      { q: 'Does the tool store the file?', a: 'No. The file is read once and never saved.' },
    ]},
    { heading: 'Troubleshooting', items: [
      { q: 'Why does no data appear?', a: 'The image may have no EXIF tags, may have been re-saved by a program that strips them, or may be in a format other than JPEG.' },
      { q: 'Can I export the result?', a: 'Not in this version. Copy the table values manually.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to view EXIF metadata</h2>
      <ol>
        <li>Upload a JPEG file.</li>
        <li>The tool shows the common EXIF tags.</li>
        <li>Copy the values you need.</li>
      </ol>
      <h2>Why use this tool</h2>
      <p>Quick way to check what a photo carries before you share it. Everything runs locally.</p>
      <h2>Privacy and data</h2>
      <p>The file stays on your device.</p>
    </>
  )

  return (
    <ToolShell
      title="EXIF Viewer Online Free | PPM Creator"
      description="Read the EXIF metadata of a JPEG image in your browser. Nothing is uploaded."
      path="/exif-viewer"
      crumb={[{ label: 'Image Tools', to: '/image-tools' }]}
      h1="EXIF Viewer: Read Photo Metadata"
      lead="Upload a JPEG to see its EXIF tags. Nothing is uploaded."
      faqGroups={faqGroups}
      related={[
        { name: 'Image Compressor', href: '/image-compress', blurb: 'Reduce file size' },
        { name: 'Image Converter', href: '/image-convert', blurb: 'Change image format' },
        { name: 'Image Cropper', href: '/image-crop', blurb: 'Crop to a size' },
        { name: 'BgRemover', href: '/bg-remover', blurb: 'Remove a background colour' },
      ]}
      guides={[
        { title: 'What EXIF reveals about a photo' },
        { title: 'Removing location data before sharing' },
        { title: 'Why some apps strip EXIF automatically' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        <UploadBox accept="image/jpeg" maxMB={25} hint="JPEG image - up to 25 MB - nothing is uploaded" onFile={handleFile} />
        {loading && <p style={{ fontSize: 13, color: '#6b7280', marginTop: 10 }}>Reading...</p>}
        {fileName && <p style={{ fontSize: 13, color: '#6b7280', marginTop: 10 }}>{fileName}</p>}
        {tags.length > 0 && (
          <table style={{ width: '100%', marginTop: 14, borderCollapse: 'collapse', fontSize: 13 }}>
            <thead><tr><th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e7e5e4', color: '#6b7280', fontWeight: 500 }}>Tag</th><th style={{ textAlign: 'left', padding: 8, borderBottom: '1px solid #e7e5e4', color: '#6b7280', fontWeight: 500 }}>Value</th></tr></thead>
            <tbody>{tags.map((t, i) => (<tr key={i}><td style={{ padding: 8, borderBottom: '1px solid #e7e5e4', fontWeight: 600 }}>{t.tag}</td><td style={{ padding: 8, borderBottom: '1px solid #e7e5e4' }}>{t.value}</td></tr>))}</tbody>
          </table>
        )}
        {error && <p role="alert" style={{ color: '#be123c', fontSize: 14, marginTop: 10 }}>{error}</p>}
      </section>
    </ToolShell>
  )
}
"@
Write-Host "  [+] ExifViewer done" -ForegroundColor Green

# ============ PLACEHOLDER: Office/Word/Excel/PPT converters ============
# These are server-dependent (real docx/xlsx parsing) and will be built as separate server-side group later.
# For now, place a friendly "coming soon" page so routes don't 404.

$placeholders = @('OfficeToPdf','PdfToWord','PdfToExcel','PdfToPpt','PdfToCsv','PdfToHtml','WordToPdf','WordToExcel','WordToPpt','WordToHtml','ExcelToPdf','ExcelToWord','ExcelToCsv','PptToPdf','CsvToPdf','SocialChecker','EmiCalculator','MemeGenerator','ImageToText','ImageColorPicker','ImageWatermark','ImageTools','PdfTools','WordTools','Converters','YoutubeMeta','VideoDownloader')

foreach ($name in $placeholders) {
  # Skip VideoDownloader and YoutubeMeta (user said keep them)
  if ($name -eq 'VideoDownloader' -or $name -eq 'YoutubeMeta') { Write-Host "  [=] skipped $name (user requested)" -ForegroundColor DarkGray; continue }
  $path = Join-Path $root "$name\index.tsx"
  if (Test-Path -LiteralPath $path) { Write-Host "  [=] $name exists, left alone" -ForegroundColor DarkGray; continue }
  $title = ($name -replace '(?<!^)([A-Z])', ' $1').Trim()
  $component = @"
import ToolShell from '@/components/ToolShell'

export default function $name() {
  return (
    <ToolShell
      title="$title | PPM Creator"
      description="This tool is being prepared."
      path="/$($name.ToLower())"
      crumb={[{ label: 'Tools', to: '/calculators' }]}
      h1="$title"
      lead="This tool is being prepared. Please check back soon."
      faqGroups={[{ heading: 'Status', items: [{ q: 'Is this tool available?', a: 'Not yet. It is on the list and will be published soon. Other tools on this site are ready to use.' }] }]}
      related={[{ name: 'Image Compressor', href: '/image-compress', blurb: 'Reduce file size' }, { name: 'Merge PDF', href: '/pdf-merge', blurb: 'Combine PDFs' }]}
      article={<><h2>Coming soon</h2><p>We are preparing this tool. In the meantime, explore the rest of the site.</p></>}
    ><div /></ToolShell>
  )
}
"@
  WF "$name\index.tsx" $component
  Write-Host "  [+] $name (placeholder)" -ForegroundColor Green
}

Write-Host "=== Batch 6b + 7 done. Build next. ===" -ForegroundColor Green