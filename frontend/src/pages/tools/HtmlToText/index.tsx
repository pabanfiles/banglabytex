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