import { useState } from 'react'
import ToolShell from '@/components/ToolShell'
import DownloadButton from '@/components/DownloadButton'

function minifyCss(css: string): string {
  return css
    .replace(/\/\*[\s\S]*?\*\//g, '') // remove comments
    .replace(/\s+/g, ' ') // collapse spaces
    .replace(/\s*([{}|:;,])\s*/g, '$1') // remove spaces around operators
    .replace(/;}/g, '}') // remove last semicolon
    .trim()
}

export default function CssMinifier() {
  const [input, setInput] = useState('body {\n  background-color: #ffffff;\n  color: #333333;\n}\n\nh1 {\n  font-size: 24px;\n}')
  const [output, setOutput] = useState('')
  const [copied, setCopied] = useState(false)
  const [origSize, setOrigSize] = useState(0)
  const [newSize, setNewSize] = useState(0)

  const handleMinify = () => {
    if (!input.trim()) return
    setOrigSize(new Blob([input]).size)
    const minified = minifyCss(input)
    setOutput(minified)
    setNewSize(new Blob([minified]).size)
  }

  const copy = async () => {
    try { await navigator.clipboard.writeText(output); setCopied(true); setTimeout(() => setCopied(false), 1500) } catch {}
  }

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this CSS minifier do?', a: 'It removes unnecessary spaces, line breaks, and comments from CSS code. This reduces the file size, making your website load faster.' },
      { q: 'Is it free?', a: 'Yes. No account is needed, and the tool runs entirely in your browser.' },
      { q: 'Does it upload my code?', a: 'No. The minification happens locally. Your CSS is never sent to a server.' },
    ]},
    { heading: 'Minification', items: [
      { q: 'Will minifying break my CSS?', a: 'Standard CSS minification is safe. The tool removes whitespace and comments, which browsers ignore anyway. If you use advanced CSS hacks, test your site after applying the minified code.' },
      { q: 'How much smaller will the file be?', a: 'Typically, minification reduces file size by 20% to 40%. Removing comments and line breaks makes the biggest difference.' },
      { q: 'Does it minify media queries?', a: 'Yes. Spaces around brackets and colons inside media queries are removed.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to minify CSS code</h2>
      <ol>
        <li>Paste your formatted CSS into the input box.</li>
        <li>Click the Minify button.</li>
        <li>Copy the compressed code or download it as a .css file.</li>
      </ol>
      <h2>Why minify CSS</h2>
      <p>Every space and line break in CSS adds to the file size. Minifying removes these extras so the browser downloads less data. This improves page load speed, which is good for users and search engines.</p>
      <p>Keep a copy of your original CSS for editing. Use the minified version only on your live server.</p>
      <h2>Privacy</h2>
      <p>Your CSS stays in your browser. It is never uploaded.</p>
    </>
  )

  return (
    <ToolShell
      title="CSS Minifier Online Free | PPM Creator Tools"
      description="Minify and compress CSS code to reduce file size. Free, fast, and private."
      path="/css-minifier"
      crumb={[{ label: 'Developer Tools', to: '/calculators' }]}
      h1="CSS Minifier"
      lead="Compress your CSS code to make your website load faster."
      faqGroups={faqGroups}
      related={[
        { name: 'HTML Formatter', href: '/html-formatter', blurb: 'Format messy HTML' },
        { name: 'Code Runner', href: '/code-runner', blurb: 'Run HTML/CSS/JS' },
        { name: 'HTML to Text', href: '/html-to-text', blurb: 'Remove HTML tags' },
        { name: 'Word Counter', href: '/word-counter', blurb: 'Count characters' },
      ]}
      guides={[
        { title: 'Why minify CSS' },
        { title: 'CSS performance tips' },
        { title: 'How to keep your original files safe' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        <label style={{ fontSize: 13, color: '#6b7280' }}>Input CSS</label>
        <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={8} style={{ width: '100%', padding: 12, border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 4, marginBottom: 10, fontFamily: 'monospace', fontSize: 13 }} />
        
        <button type="button" onClick={handleMinify} style={{ padding: '10px 16px', background: '#F97316', color: '#fff', border: 0, borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: 14 }}>Minify CSS</button>

        {output && (
          <>
            <div style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
              <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 8, padding: '8px 12px', flex: 1 }}>
                <small style={{ color: '#6b7280', fontSize: 12, display: 'block' }}>Original Size</small>
                <b style={{ fontSize: 14 }}>{origSize} bytes</b>
              </div>
              <div style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 8, padding: '8px 12px', flex: 1 }}>
                <small style={{ color: '#6b7280', fontSize: 12, display: 'block' }}>Minified Size</small>
                <b style={{ fontSize: 14, color: '#15803D' }}>{newSize} bytes</b>
              </div>
            </div>
            <label style={{ fontSize: 13, color: '#6b7280' }}>Minified Output</label>
            <textarea readOnly value={output} rows={6} style={{ width: '100%', padding: 12, border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 4, marginBottom: 10, fontFamily: 'monospace', fontSize: 13, background: '#fff' }} />
            <div style={{ display: 'flex', gap: 8 }}>
              <button type="button" onClick={copy} style={{ padding: '10px 16px', border: '1px solid #e7e5e4', background: 'transparent', borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>{copied ? 'Copied' : 'Copy'}</button>
              <DownloadButton getBlob={async () => new Blob([output], { type: 'text/css' })} filename="styles.min.css" label="Download CSS" />
            </div>
          </>
        )}
      </section>
    </ToolShell>
  )
}