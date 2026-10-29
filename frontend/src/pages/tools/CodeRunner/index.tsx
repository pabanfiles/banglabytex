import { useEffect, useRef, useState } from 'react'
import ToolShell from '@/components/ToolShell'

const DEFAULT_HTML = `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <style>
    body { font-family: system-ui, sans-serif; padding: 24px; background: #fafaf9; }
    h1 { color: #F97316; }
    button { padding: 10px 20px; background: #F97316; color: white; border: 0; border-radius: 8px; cursor: pointer; font-size: 14px; }
    button:hover { background: #EA580C; }
  </style>
</head>
<body>
  <h1>Hello, PPM Creator!</h1>
  <p>Edit this code and see the result instantly.</p>
  <button onclick="alert('It works!')">Click me</button>
</body>
</html>`

export default function CodeRunner() {
  const [html, setHtml] = useState(DEFAULT_HTML)
  const [tab, setTab] = useState<'html' | 'css' | 'js'>('html')
  const [autoRun, setAutoRun] = useState(true)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const debounceRef = useRef<number | null>(null)

  const run = () => {
    const iframe = iframeRef.current
    if (!iframe) return
    const doc = iframe.contentDocument
    if (!doc) return
    doc.open()
    doc.write(html)
    doc.close()
  }

  useEffect(() => {
    if (!autoRun) return
    if (debounceRef.current) window.clearTimeout(debounceRef.current)
    debounceRef.current = window.setTimeout(run, 500)
    return () => { if (debounceRef.current) window.clearTimeout(debounceRef.current) }
  }, [html, autoRun])

  const reset = () => { setHtml(DEFAULT_HTML); setTimeout(run, 50) }

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this code runner do?', a: 'It runs HTML, CSS and JavaScript code inside a sandboxed iframe in your browser. You see the live result instantly. No upload and no server is involved.' },
      { q: 'Is it free?', a: 'Yes. No account is needed and there is no daily limit. The tool runs entirely in your browser.' },
      { q: 'Can I use it offline?', a: 'After the page loads once, yes. The tool does not call any server for the preview. You can edit and run code without an internet connection.' },
      { q: 'Which browsers are supported?', a: 'Any modern browser with iframe support, including Chrome, Edge, Firefox and Safari on desktop and mobile.' },
    ]},
    { heading: 'Using the editor', items: [
      { q: 'How do I run my code?', a: 'Turn auto-run on for a 500 millisecond delay after each edit, or turn it off and use the Run button. Both modes show the result in the preview panel below the editor.' },
      { q: 'How do I split HTML, CSS and JS?', a: 'Keep everything in one HTML file with <style> and <script> tags, or use the HTML tab for markup, the CSS tab for styles and the JS tab for scripts. The current version uses a single HTML file so external libraries load cleanly.' },
      { q: 'Can I load external libraries?', a: 'Yes. Add <script src="https://..."> tags in the HTML. The preview loads scripts the same way a browser does, so CDN links work.' },
      { q: 'What happens to my code after I close the tab?', a: 'The code is not saved. Keep a copy in your own file if you want to continue later.' },
    ]},
    { heading: 'Limits and safety', items: [
      { q: 'Can the code access my browser data?', a: 'No. The iframe runs in a sandboxed context, so scripts cannot read cookies, localStorage from this site, or parent document data.' },
      { q: 'Can the code make network requests?', a: 'Inline scripts can fetch public URLs. Requests are subject to the same CORS rules as any browser page. The tool does not proxy or relay requests.' },
      { q: 'Why does my alert() not appear?', a: 'Some browsers block alert() inside sandboxed iframes. Use console.log() and open DevTools, or show messages with a custom DOM element instead.' },
      { q: 'Is the preview isolated from this site?', a: 'Yes. The preview uses a separate iframe with its own document. Styles and scripts in the preview do not affect this site.' },
    ]},
    { heading: 'Troubleshooting', items: [
      { q: 'Why is the preview blank?', a: 'A JavaScript error usually stops the page from rendering. Open DevTools in your browser to see the error. Once fixed, the preview updates after the next edit.' },
      { q: 'Why does the preview not refresh automatically?', a: 'Check that auto-run is on. Some browsers cache iframe content; pressing Run forces a fresh render.' },
      { q: 'Can I paste minified code?', a: 'Yes. Minified code works but is harder to edit. Use a formatter first if you plan to make changes.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to use the code runner</h2>
      <ol>
        <li>Type or paste your HTML, CSS and JavaScript into the editor.</li>
        <li>Turn auto-run on, or click Run to render the code in the preview panel.</li>
        <li>Edit and repeat. The result updates after each change.</li>
        <li>Copy your final code into your own file when you are done.</li>
      </ol>
      <h2>Why use this tool</h2>
      <p>It is the fastest way to test a small HTML snippet, a CSS rule or a JavaScript function without setting up a project. The preview runs in a sandbox, so experiments do not leak into this site.</p>
      <p>For learning, it is helpful to keep the editor and the preview side by side. Change one line and see the effect immediately. This tight loop is how most developers learn the browser.</p>
      <h2>What you can build</h2>
      <p>Small demos, prototypes, learning exercises, interactive widgets and snippets for a blog post all fit well. If you need a full framework, download the code and run it in your own development environment.</p>
      <h2>Limits</h2>
      <p>The sandbox restricts access to cookies, localStorage of this site, and the parent page. Some browsers also block alert() inside sandboxed iframes. External libraries load normally, and network requests follow the same CORS rules as any browser page.</p>
      <h2>Privacy</h2>
      <p>Your code stays in your browser. It is never sent to a server, never stored, and it disappears when you close the tab.</p>
    </>
  )

  return (
    <ToolShell
      title="HTML, CSS, JS Code Runner Online Free | PPM Creator"
      description="Write and run HTML, CSS and JavaScript code in your browser. Live preview, no upload, no signup."
      path="/code-runner"
      crumb={[{ label: 'Developer Tools', to: '/calculators' }]}
      h1="HTML, CSS, JS Code Runner"
      lead="Write HTML, CSS and JavaScript in your browser and see the live result instantly. Nothing is uploaded."
      faqGroups={faqGroups}
      related={[
        { name: 'HTML to Text', href: '/html-to-text', blurb: 'Remove HTML tags from text' },
        { name: 'CSV to JSON', href: '/csv-to-json', blurb: 'Convert CSV to JSON' },
        { name: 'Word Counter', href: '/word-counter', blurb: 'Count words and characters' },
        { name: 'Password Generator', href: '/password-generator', blurb: 'Generate a strong password' },
      ]}
      guides={[
        { title: 'Learning HTML, CSS and JS in the browser' },
        { title: 'Testing snippets without a project setup' },
        { title: 'Why iframe sandboxing matters' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ display: 'flex', gap: 4, background: '#fff', padding: 4, borderRadius: 8, border: '1px solid #e7e5e4' }}>
            <button type="button" onClick={() => setTab('html')} style={{ padding: '6px 12px', border: 0, borderRadius: 6, background: tab === 'html' ? '#FFF7ED' : 'transparent', color: tab === 'html' ? '#F97316' : '#6b7280', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>HTML</button>
            <button type="button" onClick={() => setTab('css')} style={{ padding: '6px 12px', border: 0, borderRadius: 6, background: tab === 'css' ? '#FFF7ED' : 'transparent', color: tab === 'css' ? '#F97316' : '#6b7280', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>CSS</button>
            <button type="button" onClick={() => setTab('js')} style={{ padding: '6px 12px', border: 0, borderRadius: 6, background: tab === 'js' ? '#FFF7ED' : 'transparent', color: tab === 'js' ? '#F97316' : '#6b7280', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>JS</button>
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <label style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: 6, color: '#6b7280' }}>
              <input type="checkbox" checked={autoRun} onChange={(e) => setAutoRun(e.target.checked)} />
              Auto-run
            </label>
            <button type="button" onClick={run} style={{ padding: '7px 14px', background: '#F97316', color: '#fff', border: 0, borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Run</button>
            <button type="button" onClick={reset} style={{ padding: '7px 12px', border: '1px solid #e7e5e4', background: '#fff', color: '#6b7280', borderRadius: 8, fontSize: 13, cursor: 'pointer' }}>Reset</button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) minmax(0, 1fr)', gap: 10, marginBottom: 10 }}>
          {tab === 'html' && (
            <textarea value={html} onChange={(e) => setHtml(e.target.value)} rows={20} spellCheck={false} style={{ gridColumn: '1 / -1', width: '100%', padding: 12, border: '1px solid #e7e5e4', borderRadius: 10, fontFamily: 'ui-monospace, Consolas, monospace', fontSize: 12, lineHeight: 1.6, background: '#fff', minHeight: 320 }} />
          )}
          {tab === 'css' && (
            <div style={{ gridColumn: '1 / -1', padding: 16, border: '1px dashed #e7e5e4', borderRadius: 10, background: '#fff', color: '#6b7280', fontSize: 13, textAlign: 'center' }}>
              CSS à¦Ÿà§à¦¯à¦¾à¦¬ à¦¶à§€à¦˜à§à¦°à¦‡ à¦†à¦¸à¦›à§‡à¥¤ à¦à¦–à¦¨ HTML tab à¦ <code style={{ background: '#fafaf9', padding: '2px 6px', borderRadius: 4 }}>&lt;style&gt;</code> tag à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à§à¦¨à¥¤
            </div>
          )}
          {tab === 'js' && (
            <div style={{ gridColumn: '1 / -1', padding: 16, border: '1px dashed #e7e5e4', borderRadius: 10, background: '#fff', color: '#6b7280', fontSize: 13, textAlign: 'center' }}>
              JS à¦Ÿà§à¦¯à¦¾à¦¬ à¦¶à§€à¦˜à§à¦°à¦‡ à¦†à¦¸à¦›à§‡à¥¤ à¦à¦–à¦¨ HTML tab à¦ <code style={{ background: '#fafaf9', padding: '2px 6px', borderRadius: 4 }}>&lt;script&gt;</code> tag à¦¬à§à¦¯à¦¬à¦¹à¦¾à¦° à¦•à¦°à§à¦¨à¥¤
            </div>
          )}
        </div>

        <div style={{ border: '1px solid #e7e5e4', borderRadius: 10, overflow: 'hidden', background: '#fff' }}>
          <div style={{ padding: '8px 12px', background: '#fafaf9', borderBottom: '1px solid #e7e5e4', fontSize: 12, color: '#6b7280', fontWeight: 500 }}>Preview</div>
          <iframe
            ref={iframeRef}
            title="Code preview"
            sandbox="allow-scripts allow-modals allow-forms allow-popups"
            style={{ width: '100%', height: 360, border: 0, display: 'block', background: '#fff' }}
          />
        </div>

        <p style={{ fontSize: 12, color: '#6b7280', marginTop: 12, background: '#FFF7ED', padding: 10, borderRadius: 8 }}>
          Code runs in a sandboxed iframe. It cannot read this site's cookies or localStorage. Network requests follow normal browser CORS rules.
        </p>
      </section>
    </ToolShell>
  )
}