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