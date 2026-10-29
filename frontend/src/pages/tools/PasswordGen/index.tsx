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