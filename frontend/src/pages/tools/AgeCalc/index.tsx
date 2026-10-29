import { useState } from 'react'
import ToolShell from '@/components/ToolShell'

export default function AgeCalc() {
  const [dob, setDob] = useState('')
  const [to, setTo] = useState(new Date().toISOString().slice(0, 10))

  const calc = () => {
    if (!dob) return null
    const b = new Date(dob); const n = new Date(to)
    if (isNaN(b.getTime()) || isNaN(n.getTime()) || n < b) return null
    let y = n.getFullYear() - b.getFullYear()
    let m = n.getMonth() - b.getMonth()
    let d = n.getDate() - b.getDate()
    if (d < 0) { m--; d += new Date(n.getFullYear(), n.getMonth(), 0).getDate() }
    if (m < 0) { y--; m += 12 }
    const totalDays = Math.floor((n.getTime() - b.getTime()) / 86400000)
    return { y, m, d, totalDays, totalWeeks: Math.floor(totalDays / 7), totalMonths: y * 12 + m }
  }

  const r = calc()

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'How does this age calculator work?', a: 'It takes your date of birth and a target date, then shows the difference in years, months and days. It also shows the total days, weeks and months between the two dates.' },
      { q: 'Is it free?', a: 'Yes. No account, no upload, no daily limit.' },
      { q: 'Does it handle leap years?', a: 'Yes. The calculation follows the real calendar, so February 29 in a leap year is counted correctly.' },
    ]},
    { heading: 'Accuracy', items: [
      { q: 'Why might my age differ from another calculator?', a: 'Some calculators count only whole years, others count months and days. This tool shows all three, so the result matches whichever style you need.' },
      { q: 'Can I use it for official forms?', a: 'For official forms, always check the instructions. Some forms count age on a specific cutoff date, which you can set in the target date field.' },
      { q: 'What is the target date for?', a: 'It lets you calculate age on a past or future date, for example on the day of an exam cutoff or a birthday you are planning.' },
    ]},
    { heading: 'Privacy', items: [
      { q: 'Is my date of birth sent anywhere?', a: 'No. The calculation happens in your browser. Nothing is uploaded.' },
      { q: 'Do you store the date?', a: 'No. The date is used only for the visible result and is cleared when you reload the page.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to calculate your age</h2>
      <ol>
        <li>Pick your date of birth.</li>
        <li>Leave the target date as today, or change it for a specific cutoff.</li>
        <li>The result shows years, months and days, and the total days, weeks and months.</li>
      </ol>
      <h2>Why use this calculator</h2>
      <p>It shows several views of the same date range, so you can answer different questions without recalculating. For an exam cutoff, set the target date. For a birthday plan, set a future date.</p>
      <h2>Privacy and data</h2>
      <p>Dates stay in your browser. Nothing is uploaded.</p>
    </>
  )

  return (
    <ToolShell
      title="Age Calculator Online Free | PPM Creator"
      description="Calculate your exact age in years, months and days, or on a specific date. Runs in your browser."
      path="/age-calculator"
      crumb={[{ label: 'Calculators', to: '/calculators' }]}
      h1="Age Calculator: Exact Age in Years, Months, Days"
      lead="Pick your date of birth and an optional target date. See your age in multiple units."
      faqGroups={faqGroups}
      related={[
        { name: 'Percentage Calculator', href: '/percentage-calc', blurb: 'Calculate percentages easily' },
        { name: 'Unit Converter', href: '/unit-converter', blurb: 'Convert between common units' },
        { name: 'Word Counter', href: '/word-counter', blurb: 'Count words and characters in text' },
        { name: 'Password Generator', href: '/password-generator', blurb: 'Generate a strong random password' },
      ]}
      guides={[
        { title: 'How age is counted on official forms' },
        { title: 'Calculating age on a cutoff date' },
        { title: 'Why some age calculators disagree' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        <label style={{ fontSize: 13, color: '#6b7280' }}>Date of birth</label>
        <input type="date" value={dob} onChange={(e) => setDob(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 4, marginBottom: 10, fontSize: 14 }} />
        <label style={{ fontSize: 13, color: '#6b7280' }}>Age on this date</label>
        <input type="date" value={to} onChange={(e) => setTo(e.target.value)} style={{ width: '100%', padding: '10px 12px', border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 4, marginBottom: 14, fontSize: 14 }} />
        {r && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
            <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 12 }}><small style={{ color: '#6b7280', fontSize: 12 }}>Age</small><b style={{ fontSize: 18, display: 'block' }}>{r.y}y {r.m}m {r.d}d</b></div>
            <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 12 }}><small style={{ color: '#6b7280', fontSize: 12 }}>Total days</small><b style={{ fontSize: 18, display: 'block' }}>{r.totalDays}</b></div>
            <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 12 }}><small style={{ color: '#6b7280', fontSize: 12 }}>Total weeks</small><b style={{ fontSize: 18, display: 'block' }}>{r.totalWeeks}</b></div>
            <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 12 }}><small style={{ color: '#6b7280', fontSize: 12 }}>Total months</small><b style={{ fontSize: 18, display: 'block' }}>{r.totalMonths}</b></div>
          </div>
        )}
      </section>
    </ToolShell>
  )
}