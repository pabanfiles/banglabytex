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