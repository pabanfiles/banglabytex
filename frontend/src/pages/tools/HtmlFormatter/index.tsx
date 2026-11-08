import { useState } from 'react'
import ToolShell from '@/components/ToolShell'
import DownloadButton from '@/components/DownloadButton'

function formatHtml(html: string): string {
  let formatted = ''
  let indent = 0
  const reg = /(>)(<)(\/*)/g
  html = html.replace(reg, '$1\n$2$3')
  const lines = html.split('\n')
  for (let line of lines) {
    line = line.trim()
    if (!line) continue
    if (line.match(/.+<\/\w[^>]*>$/)) {
      formatted += '  '.repeat(indent) + line + '\n'
    } else if (line.match(/^<\/\w/)) {
      if (indent > 0) indent -= 1
      formatted += '  '.repeat(indent) + line + '\n'
    } else if (line.match(/^<\w[^>]*[^\/]>.*$/)) {
      formatted += '  '.repeat(indent) + line + '\n'
      indent += 1
    } else {
      formatted += '  '.repeat(indent) + line + '\n'
    }
  }
  return formatted.trim()
}

export default function HtmlFormatter() {
  const [input, setInput] = useState('<div><p>Hello</p><ul><li>Item 1</li></ul></div>')
  const [output, setOutput] = useState('')
  const [error, setError] = useState('')
  const [copied, setCopied] = useState(false)

  const handleFormat = () => {
    setError('')
    try {
      if (!input.trim()) return
      setOutput(formatHtml(input))
    } catch (e: any) {
      setError('Failed to format HTML. Check for unclosed tags.')
    }
  }

  const copy = async () => {
    try { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch {}
  }

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this HTML formatter do?', a: 'It takes messy or minified HTML and adds proper line breaks and indentation. This makes the code much easier to read, edit, and debug.' },
      { q: 'Is it free?', a: 'Yes. No account is needed, and the tool runs entirely inside your browser.' },
      { q: 'Does it upload my code?', a: 'No. The formatting happens locally on your device. Your HTML code is never sent to a server.' },
    ]},
    { heading: 'Formatting', items: [
      { q: 'Will it break my scripts or styles?', a: 'The formatter focuses on tag indentation. Inline scripts and styles are kept intact, but complex templates might need manual adjustments.' },
      { q: 'Can I use it for XML?', a: 'The tool is optimized for HTML5. It may work for basic XML, but HTML allows void tags like <br> without closing, which XML does not.' },
      { q: 'Why does it look different from my editor?', a: 'Different editors use different formatting rules. This tool provides a clean, standard 2-space indent format.' },
    ]},
    { heading: 'Privacy', items: [
      { q: 'Is my data safe?', a: 'Absolutely. Everything runs in your browser memory. When you close the tab, the code is gone.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to format HTML code</h2>
      <ol>
        <li>Paste your unformatted or minified HTML into the input box.</li>
        <li>Click the Format button.</li>
        <li>Copy the clean, indented code or download it as a file.</li>
      </ol>
      <h2>Why use an HTML formatter</h2>
      <p>Reading minified HTML is difficult. When code is nested deeply, a formatter adds indentation so you can quickly see which opening tag matches which closing tag. This speeds up debugging and editing.</p>
      <p>Use this tool when you copy code from a website or a minified bundle and need to understand how it is structured.</p>
      <h2>Privacy</h2>
      <p>Your code stays in your browser. It is never uploaded.</p>
    </>
  )

  return (
    <ToolShell
      title="HTML Formatter Online Free | PPM Creator Tools"
      description="Format and beautify messy HTML code in your browser. Free, fast, and private."
      path="/html-formatter"
      crumb={[{ label: 'Developer Tools', to: '/calculators' }]}
      h1="HTML Formatter"
      lead="Beautify and indent your HTML code for better readability."
      faqGroups={faqGroups}
      related={[
        { name: 'HTML to Text', href: '/html-to-text', blurb: 'Remove HTML tags' },
        { name: 'CSS Minifier', href: '/css-minifier', blurb: 'Compress CSS code' },
        { name: 'Code Runner', href: '/code-runner', blurb: 'Run HTML live' },
        { name: 'Word Counter', href: '/word-counter', blurb: 'Count characters' },
      ]}
      guides={[
        { title: 'Why formatting HTML matters' },
        { title: 'Reading minified code' },
        { title: 'Common HTML errors' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        <label style={{ fontSize: 13, color: '#6b7280' }}>Input HTML</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} style={{ width: '100%', padding: 12, border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 4, marginBottom: 10, fontFamily: 'monospace', fontSize: 13 }} />
        
        <button type="button" onClick={handleFormat} style={{ padding: '10px 16px', background: '#F97316', color: '#fff', border: 0, borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 14 }}>Format HTML</button>

        {output && (
          <>
            <label style={{ fontSize: 13, color: '#6b7280' }}>Formatted Output</label>
            <textarea readOnly value={output} rows={12} style={{ width: '100%', padding: 12, border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 4, marginBottom: 10, fontFamily: 'monospace', fontSize: 13, background: '#fff' }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" onClick={copy} style={{ padding: '10px 16px', border: '1px solid #e7e5e4', background: 'transparent', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{copied ? 'Copied' : 'Copy'}</button>
              <DownloadButton getBlob={async () => new Blob([output], { type: 'text/html' })} filename="formatted.html" label="Download HTML" />
            </div>
          </>
        )}
        {error && <p style={{ color: '#B91C1C', fontSize: 13, marginTop: 10 }}>{error}</p>}
      </section>
    </ToolShell>
  )
}