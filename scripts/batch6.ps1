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

Write-Host "=== Batch 6 ===" -ForegroundColor Cyan

# ============ AGE CALCULATOR ============
BK "AgeCalc\index.tsx"
WF "AgeCalc\index.tsx" @"
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
"@
Write-Host "  [+] AgeCalc done" -ForegroundColor Green

# ============ PERCENTAGE CALCULATOR ============
BK "PercentageCalc\index.tsx"
WF "PercentageCalc\index.tsx" @"
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
"@
Write-Host "  [+] PercentageCalc done" -ForegroundColor Green

# ============ WORD COUNTER ============
BK "WordCounter\index.tsx"
WF "WordCounter\index.tsx" @"
import { useState } from 'react'
import ToolShell from '@/components/ToolShell'

export default function WordCounter() {
  const [text, setText] = useState('')
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const chars = text.length
  const charsNoSpace = text.replace(/\s/g, '').length
  const sentences = (text.match(/[.!?]+/g) || []).length
  const paragraphs = text.split(/\n{2,}/).filter(Boolean).length
  const readMin = Math.ceil(words / 200)

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this tool do?', a: 'It counts words, characters, sentences and paragraphs in the text you paste. It also shows a rough reading time at 200 words per minute.' },
      { q: 'Is it free?', a: 'Yes. No account, no upload, no daily limit.' },
      { q: 'Is my text uploaded?', a: 'No. The counting runs in your browser. Nothing is sent anywhere.' },
    ]},
    { heading: 'Counting', items: [
      { q: 'How are words counted?', a: 'Words are groups of characters separated by spaces, tabs or line breaks. This matches how most word processors count words.' },
      { q: 'Why do different tools give slightly different counts?', a: 'Some tools count numbers as words, some do not. Some split hyphenated terms. This tool uses a simple space-separated count.' },
      { q: 'What is the reading time based on?', a: 'A rough average of 200 words per minute. Actual time depends on the reader and the content.' },
    ]},
    { heading: 'Uses', items: [
      { q: 'Can I use it for a school essay?', a: 'Yes. Many essay limits are word counts, and this tool gives a quick check. Confirm the limit with your teacher or the exam instructions.' },
      { q: 'Can I use it for a tweet or a meta description?', a: 'Yes. The character count at the top helps you stay under a limit. For a meta description, aim for around 155 characters.' },
      { q: 'Does it count emoji?', a: 'An emoji is usually counted as one word if it is space-separated, and as one character. Different tools may count it differently.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to use the word counter</h2>
      <ol>
        <li>Paste or type your text.</li>
        <li>The counts update as you type.</li>
        <li>Copy the numbers where you need them.</li>
      </ol>
      <h2>Why use this tool</h2>
      <p>A quick way to check a length limit for an essay, a tweet, a meta description or a blog post. Everything runs locally, so nothing is uploaded.</p>
      <h2>Privacy and data</h2>
      <p>Your text stays in your browser. Nothing is stored or uploaded.</p>
    </>
  )

  return (
    <ToolShell
      title="Word Counter Online Free | PPM Creator"
      description="Count words, characters, sentences and paragraphs. Runs in your browser."
      path="/word-counter"
      crumb={[{ label: 'Text Tools', to: '/calculators' }]}
      h1="Word Counter: Count Words and Characters"
      lead="Paste text to see word count, character count, sentences and reading time."
      faqGroups={faqGroups}
      related={[
        { name: 'Text Case Converter', href: '/text-case-converter', blurb: 'Change text to upper, lower or title case' },
        { name: 'HTML to Text', href: '/html-to-text', blurb: 'Remove HTML tags from text' },
        { name: 'CSV to JSON', href: '/csv-to-json', blurb: 'Convert CSV data to JSON' },
        { name: 'Password Generator', href: '/password-generator', blurb: 'Generate a strong password' },
      ]}
      guides={[
        { title: 'Keeping a blog post under a word limit' },
        { title: 'Word count vs character count' },
        { title: 'Writing a meta description that fits' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={10} placeholder="Paste or type your text here" style={{ width: '100%', padding: 12, border: '1px solid #e7e5e4', borderRadius: 10, fontSize: 14, fontFamily: 'inherit' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginTop: 12 }}>
          {[['Words', words], ['Characters', chars], ['No spaces', charsNoSpace], ['Sentences', sentences], ['Paragraphs', paragraphs], ['Read time', readMin + ' min']].map(([label, value]) => (
            <div key={String(label)} style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 12 }}>
              <small style={{ display: 'block', color: '#6b7280', fontSize: 12 }}>{label}</small>
              <b style={{ fontSize: 20, fontWeight: 600 }}>{value}</b>
            </div>
          ))}
        </div>
      </section>
    </ToolShell>
  )
}
"@
Write-Host "  [+] WordCounter done" -ForegroundColor Green

# ============ TEXT CASE CONVERTER ============
BK "TextCase\index.tsx"
WF "TextCase\index.tsx" @"
import { useState } from 'react'
import ToolShell from '@/components/ToolShell'

export default function TextCase() {
  const [text, setText] = useState('')
  const [copied, setCopied] = useState(false)

  const apply = (mode: string) => {
    if (mode === 'upper') setText(text.toUpperCase())
    else if (mode === 'lower') setText(text.toLowerCase())
    else if (mode === 'title') setText(text.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()))
    else if (mode === 'sentence') setText(text.charAt(0).toUpperCase() + text.slice(1).toLowerCase())
    else if (mode === 'reverse') setText(text.split('').reverse().join(''))
  }
  const copy = async () => { try { await navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch {} }

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this tool do?', a: 'It changes the letter case of text. You can make it all upper case, all lower case, title case, sentence case, or reverse the character order.' },
      { q: 'Is it free?', a: 'Yes. No account, no upload, no daily limit.' },
      { q: 'Is my text uploaded?', a: 'No. The conversion runs in your browser.' },
    ]},
    { heading: 'Case types', items: [
      { q: 'What is title case?', a: 'Each word starts with a capital letter and the rest is lower case. It is common for headlines and book titles.' },
      { q: 'What is sentence case?', a: 'Only the first letter of the text is upper case, and the rest is lower case. It matches normal sentence style.' },
      { q: 'When would I use reverse?', a: 'It is mostly useful for testing and text puzzles. It reverses the character order, not the word order.' },
    ]},
    { heading: 'Privacy', items: [
      { q: 'Is the converted text saved?', a: 'No. It stays in your browser. Reloading the page clears it.' },
      { q: 'Can I convert a very long text?', a: 'Yes, up to the limits of your browser memory. A few hundred kilobytes of text is easily handled.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to change text case</h2>
      <ol>
        <li>Paste or type your text.</li>
        <li>Press the case button you want.</li>
        <li>Copy the result.</li>
      </ol>
      <h2>Why use this tool</h2>
      <p>Typing a headline in title case by hand is slow. One click does it, and the reverse button helps with text puzzles and testing.</p>
      <h2>Privacy and data</h2>
      <p>Your text stays in your browser. Nothing is uploaded.</p>
    </>
  )

  return (
    <ToolShell
      title="Text Case Converter Online Free | PPM Creator"
      description="Convert text to upper case, lower case, title case, sentence case or reverse. Runs in your browser."
      path="/text-case-converter"
      crumb={[{ label: 'Text Tools', to: '/calculators' }]}
      h1="Text Case Converter"
      lead="Paste text and change its case with one click."
      faqGroups={faqGroups}
      related={[
        { name: 'Word Counter', href: '/word-counter', blurb: 'Count words and characters' },
        { name: 'HTML to Text', href: '/html-to-text', blurb: 'Remove HTML tags from text' },
        { name: 'Password Generator', href: '/password-generator', blurb: 'Generate a strong password' },
        { name: 'CSV to JSON', href: '/csv-to-json', blurb: 'Convert CSV data to JSON' },
      ]}
      guides={[
        { title: 'Title case rules for headlines' },
        { title: 'When to use sentence case' },
        { title: 'Fixing text pasted in the wrong case' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 10 }}>
          {[['upper', 'UPPER'], ['lower', 'lower'], ['title', 'Title'], ['sentence', 'Sentence'], ['reverse', 'Reverse']].map(([m, label]) => (
            <button key={m} type="button" onClick={() => apply(m)} style={{ padding: '8px 14px', borderRadius: 10, border: '1px solid #e7e5e4', background: '#fff', color: '#1c1917', fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>{label}</button>
          ))}
        </div>
        <textarea value={text} onChange={(e) => setText(e.target.value)} rows={8} placeholder="Paste or type your text here" style={{ width: '100%', padding: 12, border: '1px solid #e7e5e4', borderRadius: 10, fontSize: 14, fontFamily: 'inherit' }} />
        <div style={{ marginTop: 10 }}>
          <button type="button" onClick={copy} style={{ border: 0, padding: '10px 16px', borderRadius: 10, background: '#F97316', color: '#fff', fontWeight: 600, cursor: 'pointer' }}>{copied ? 'Copied' : 'Copy'}</button>
        </div>
      </section>
    </ToolShell>
  )
}
"@
Write-Host "  [+] TextCase done" -ForegroundColor Green

# ============ PASSWORD GENERATOR ============
BK "PasswordGen\index.tsx"
WF "PasswordGen\index.tsx" @"
import { useState } from 'react'
import ToolShell from '@/components/ToolShell'

const LOWER = 'abcdefghijklmnopqrstuvwxyz'
const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
const DIGITS = '0123456789'
const SYMBOLS = '!@#$%^&*()-_=+[]{};:,.?'

export default function PasswordGen() {
  const [length, setLength] = useState(16)
  const [useLower, setUseLower] = useState(true)
  const [useUpper, setUseUpper] = useState(true)
  const [useDigits, setUseDigits] = useState(true)
  const [useSymbols, setUseSymbols] = useState(true)
  const [pw, setPw] = useState('')
  const [copied, setCopied] = useState(false)

  const gen = () => {
    let pool = ''
    if (useLower) pool += LOWER
    if (useUpper) pool += UPPER
    if (useDigits) pool += DIGITS
    if (useSymbols) pool += SYMBOLS
    if (!pool) { setPw(''); return }
    const arr = new Uint32Array(length)
    crypto.getRandomValues(arr)
    let out = ''
    for (let i = 0; i < length; i++) out += pool[arr[i] % pool.length]
    setPw(out)
  }

  const copy = async () => { try { await navigator.clipboard.writeText(pw); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch {} }

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this tool do?', a: 'It creates a random password using the character sets you pick. You choose the length and the character types.' },
      { q: 'Is it free?', a: 'Yes. No account, no upload, no daily limit.' },
      { q: 'Is the password saved anywhere?', a: 'No. It exists only in your browser tab. When you close or reload the page, it is gone.' },
    ]},
    { heading: 'Safety', items: [
      { q: 'How random is the password?', a: 'It uses the browser crypto random generator, which is designed for security. This is stronger than a math.random-based generator.' },
      { q: 'How long should a password be?', a: 'Sixteen characters with a mix of letters, digits and symbols is a strong default for most accounts. Longer is better for important accounts.' },
      { q: 'Should I reuse the same password?', a: 'No. Each account should have its own password. If one site leaks, the others stay safe.' },
    ]},
    { heading: 'Storage', items: [
      { q: 'Where should I store passwords?', a: 'A password manager. It remembers strong random passwords so you do not have to, and it fills them in for you.' },
      { q: 'Can I write it on paper?', a: 'For a rarely used backup account, paper in a locked drawer is safer than saving to a plain text file on a shared computer.' },
      { q: 'What if I forget it?', a: 'Use the site recovery options. This tool cannot recover a password you did not save.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to generate a password</h2>
      <ol>
        <li>Pick the length and character types.</li>
        <li>Press Generate.</li>
        <li>Copy the password and save it in a password manager.</li>
      </ol>
      <h2>Why use this tool</h2>
      <p>It uses the browser crypto random source, so the password is not predictable. Nothing is uploaded, so the password never leaves your device.</p>
      <h2>Privacy and data</h2>
      <p>The password exists only in your browser tab.</p>
    </>
  )

  return (
    <ToolShell
      title="Password Generator Online Free | PPM Creator"
      description="Generate a strong random password with the browser crypto source. Runs in your browser. Nothing is uploaded."
      path="/password-generator"
      crumb={[{ label: 'Utilities', to: '/calculators' }]}
      h1="Password Generator"
      lead="Create a random password with the browser crypto source. Everything runs locally."
      faqGroups={faqGroups}
      related={[
        { name: 'Word Counter', href: '/word-counter', blurb: 'Count words and characters' },
        { name: 'Text Case Converter', href: '/text-case-converter', blurb: 'Change text case' },
        { name: 'Unit Converter', href: '/unit-converter', blurb: 'Convert between common units' },
        { name: 'QR Code Generator', href: '/qr-code-gen', blurb: 'Create a QR code from a link' },
      ]}
      guides={[
        { title: 'Choosing a strong password' },
        { title: 'Why reuse is the biggest risk' },
        { title: 'Using a password manager' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        <label style={{ fontSize: 13, color: '#6b7280' }}>Length: {length}</label>
        <input type="range" min={8} max={64} step={1} value={length} onChange={(e) => setLength(Number(e.target.value))} style={{ width: '100%', accentColor: '#F97316', margin: '6px 0 12px' }} />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 14 }}>
          <label style={{ fontSize: 13, display: 'flex', gap: 6, alignItems: 'center' }}><input type="checkbox" checked={useLower} onChange={(e) => setUseLower(e.target.checked)} />Lowercase</label>
          <label style={{ fontSize: 13, display: 'flex', gap: 6, alignItems: 'center' }}><input type="checkbox" checked={useUpper} onChange={(e) => setUseUpper(e.target.checked)} />Uppercase</label>
          <label style={{ fontSize: 13, display: 'flex', gap: 6, alignItems: 'center' }}><input type="checkbox" checked={useDigits} onChange={(e) => setUseDigits(e.target.checked)} />Digits</label>
          <label style={{ fontSize: 13, display: 'flex', gap: 6, alignItems: 'center' }}><input type="checkbox" checked={useSymbols} onChange={(e) => setUseSymbols(e.target.checked)} />Symbols</label>
        </div>
        <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 12, padding: 14, fontFamily: 'monospace', fontSize: 16, wordBreak: 'break-all', marginBottom: 12 }}>{pw || 'Press Generate'}</div>
        <button type="button" onClick={gen} style={{ border: 0, padding: '12px 20px', borderRadius: 10, background: '#F97316', color: '#fff', fontWeight: 600, cursor: 'pointer', marginRight: 8 }}>Generate</button>
        <button type="button" onClick={copy} disabled={!pw} style={{ border: '1px solid #e7e5e4', padding: '12px 20px', borderRadius: 10, background: 'transparent', color: '#1c1917', fontWeight: 500, cursor: 'pointer' }}>{copied ? 'Copied' : 'Copy'}</button>
      </section>
    </ToolShell>
  )
}
"@
Write-Host "  [+] PasswordGen done" -ForegroundColor Green

Write-Host "=== Batch 6 done. Build next. ===" -ForegroundColor Green