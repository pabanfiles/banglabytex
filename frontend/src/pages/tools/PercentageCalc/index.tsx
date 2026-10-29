import { useState } from 'react'
import ToolShell from '@/components/ToolShell'

export default function PercentageCalc() {
  const [mode, setMode] = useState<'of' | 'change' | 'iswhat'>('of')
  const [a, setA] = useState('')
  const [b, setB] = useState('')

  const result = (() => {
    const x = parseFloat(a), y = parseFloat(b)
    if (isNaN(x) || isNaN(y)) return null
    if (mode === 'of') return { value: (x / 100) * y, label: x + '% of ' + y + ' =' }
    if (mode === 'change') { const p = ((y - x) / x) * 100; return { value: p, label: 'Change from ' + x + ' to ' + y + ' =', suffix: '%' } }
    return { value: (x / y) * 100, label: x + ' is what % of ' + y + ' =', suffix: '%' }
  })()

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this calculator do?', a: 'It handles the three most common percentage questions: X percent of Y, the percentage change between two numbers, and X is what percent of Y.' },
      { q: 'Is it free?', a: 'Yes. No account, no upload, no daily limit.' },
      { q: 'Can I use decimals?', a: 'Yes. Any number, including decimals and negative values, works.' },
    ]},
    { heading: 'Formulas', items: [
      { q: 'How is X percent of Y calculated?', a: 'Multiply Y by X and divide by 100. For example, 20 percent of 150 is 150 * 20 / 100 = 30.' },
      { q: 'How is percentage change calculated?', a: 'Subtract the old value from the new value, divide by the old value, and multiply by 100. A negative result means a decrease.' },
      { q: 'How is X is what percent of Y calculated?', a: 'Divide X by Y and multiply by 100. For example, 30 is 20 percent of 150.' },
    ]},
    { heading: 'Privacy', items: [
      { q: 'Is my data sent anywhere?', a: 'No. The calculation runs in your browser. Nothing is uploaded.' },
      { q: 'Does the tool store the values?', a: 'No. Reloading the page clears the inputs.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to use this percentage calculator</h2>
      <ol>
        <li>Pick the question you want to answer.</li>
        <li>Type the two numbers.</li>
        <li>The result appears immediately.</li>
      </ol>
      <h2>Why use this tool</h2>
      <p>Different questions need different formulas. This calculator keeps the three common ones in one place, so you do not have to remember which is which.</p>
      <h2>Privacy and data</h2>
      <p>Nothing is uploaded. Inputs stay in your browser.</p>
    </>
  )

  return (
    <ToolShell
      title="Percentage Calculator Online Free | PPM Creator"
      description="Calculate a percentage of a number, percentage change, or what percent one number is of another. Runs in your browser."
      path="/percentage-calc"
      crumb={[{ label: 'Calculators', to: '/calculators' }]}
      h1="Percentage Calculator: Three Common Questions"
      lead="Calculate X percent of Y, percentage change, or X is what percent of Y."
      faqGroups={faqGroups}
      related={[
        { name: 'Age Calculator', href: '/age-calculator', blurb: 'Calculate your exact age' },
        { name: 'Unit Converter', href: '/unit-converter', blurb: 'Convert between common units' },
        { name: 'Word Counter', href: '/word-counter', blurb: 'Count words and characters' },
        { name: 'Password Generator', href: '/password-generator', blurb: 'Generate a strong password' },
      ]}
      guides={[
        { title: 'Percentage change explained' },
        { title: 'Common percentage mistakes' },
        { title: 'Using percentages in everyday life' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 14 }}>
          {(['of', 'change', 'iswhat'] as const).map((m) => (
            <button key={m} type="button" onClick={() => setMode(m)} style={{ padding: '8px 14px', borderRadius: 10, border: '1px solid ' + (mode === m ? '#F97316' : '#e7e5e4'), background: mode === m ? '#FFF7ED' : '#fff', color: mode === m ? '#F97316' : '#1c1917', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>{m === 'of' ? '% of a number' : m === 'change' ? 'Change' : 'Is what %'}</button>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
          <input type="number" value={a} onChange={(e) => setA(e.target.value)} placeholder={mode === 'of' ? 'Percent' : 'First number'} style={{ padding: '10px 12px', border: '1px solid #e7e5e4', borderRadius: 10, fontSize: 14 }} />
          <input type="number" value={b} onChange={(e) => setB(e.target.value)} placeholder={mode === 'of' ? 'Number' : 'Second number'} style={{ padding: '10px 12px', border: '1px solid #e7e5e4', borderRadius: 10, fontSize: 14 }} />
        </div>
        {result && (
          <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 14, fontSize: 16 }}>
            {result.label} <b>{Math.round(result.value * 100) / 100}{'suffix' in result ? result.suffix : ''}</b>
          </div>
        )}
      </section>
    </ToolShell>
  )
}