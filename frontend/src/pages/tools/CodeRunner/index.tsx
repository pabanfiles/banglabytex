import { useState, useEffect } from 'react'
import ToolShell from '@/components/ToolShell'

const DEFAULT_HTML = `<!-- Write your HTML here -->
<div class="box">
  <h1>Hello PPM Creator!</h1>
  <p>Edit the HTML, CSS, and JS tabs to see changes live.</p>
  <button id="myBtn">Click Me</button>
</div>`

const DEFAULT_CSS = `/* Write your CSS here */
body {
  font-family: system-ui, sans-serif;
  background-color: #fafaf9;
  padding: 20px;
}
.box {
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.05);
  text-align: center;
}
h1 { color: #F97316; }
button {
  background: #F97316;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
}`

const DEFAULT_JS = `// Write your JavaScript here
document.getElementById('myBtn').addEventListener('click', function() {
  alert('JavaScript is working perfectly!');
});`

export default function CodeRunner() {
  const [html, setHtml] = useState(DEFAULT_HTML)
  const [css, setCss] = useState(DEFAULT_CSS)
  const [js, setJs] = useState(DEFAULT_JS)
  const [tab, setTab] = useState<'html' | 'css' | 'js'>('html')
  const [srcDoc, setSrcDoc] = useState('')

  useEffect(() => {
    const timer = setTimeout(() => {
      const combined = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8" />
            <style>${css}</style>
          </head>
          <body>
            ${html}
            <script>${js}</script>
          </body>
        </html>
      `
      setSrcDoc(combined)
    }, 500) // 500ms debounce for performance
    return () => clearTimeout(timer)
  }, [html, css, js])

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What is an HTML/CSS/JS live preview tool?', a: 'It is a browser-based code editor that lets you write HTML, CSS, and JavaScript and see the result instantly. You do not need to install any software or set up a local server.' },
      { q: 'Is it free to use?', a: 'Yes. This tool is completely free and requires no account. You can run it as many times as you like.' },
      { q: 'Does it require an internet connection?', a: 'Once the page is loaded, the tool runs entirely in your browser. You can write and test code offline.' },
      { q: 'Is my code saved anywhere?', a: 'No. Everything runs locally in your browser memory. If you close the tab, your code is permanently deleted. Always copy your final code to a safe file.' },
      { q: 'Can I use this for a real project?', a: 'Absolutely. It is perfect for prototyping, learning, and testing small snippets before moving them into a full code editor like VS Code.' },
    ]},
    { heading: 'Using the Editor', items: [
      { q: 'How do I run my code?', a: 'The preview updates automatically after you stop typing. We use a 500-millisecond delay (debounce) to prevent lag while you type.' },
      { q: 'Can I load external libraries like React or jQuery?', a: 'Yes. You can add a script tag in the HTML editor to load libraries from a CDN (like cdnjs or jsDelivr), and they will run in the preview.' },
      { q: 'Does the tool support modern JavaScript (ES6+)?', a: 'Yes. The preview is rendered inside a modern iframe, which supports all modern JavaScript features including classes, arrow functions, and async/await.' },
      { q: 'How do I reset the editor?', a: 'You can refresh the page to clear everything, or manually delete the code and paste the starter template.' },
      { q: 'Why is my CSS not applying?', a: 'Make sure your CSS selector matches the class or ID in your HTML. For example, if your HTML has <div class="box">, your CSS should use .box { ... }.' },
      { q: 'Can I use images in my HTML?', a: 'Yes. You can use external image URLs like <img src="https://example.com/image.jpg">. Local image uploads are not supported in this version.' },
    ]},
    { heading: 'Security & Privacy', items: [
      { q: 'Can the code access my browser cookies?', a: 'No. The code runs in a sandboxed iframe. It cannot read cookies, localStorage, or any personal data from this website.' },
      { q: 'Can the code make API requests?', a: 'Yes, but they are subject to standard CORS rules. If an API allows cross-origin requests, your JavaScript can fetch data from it.' },
      { q: 'Does the tool store my code on a server?', a: 'No. Your code never leaves your device. There is no backend processing involved.' },
      { q: 'Can someone else see what I am coding?', a: 'No. The entire process is local. Only you can see the code and the preview.' },
    ]},
    { heading: 'Troubleshooting', items: [
      { q: 'Why is my preview blank?', a: 'A JavaScript error or an unclosed HTML tag can break the rendering. Check your code carefully. If you have an infinite loop in JS, the preview might freeze.' },
      { q: 'Why does alert() not work?', a: 'Some browsers block alert() inside iframes. This tool allows modals, so it should work, but if it does not, use console.log() and check your browser developer tools.' },
      { q: 'Is there a limit to how much code I can write?', a: 'There is no strict limit, but extremely large files (over 1MB) might slow down your browser.' },
      { q: 'Can I use this on my mobile phone?', a: 'Yes. The editor is mobile-friendly. However, typing long code on a phone screen can be challenging.' },
    ]},
  ]

  const article = (
    <>
      <h2>What is the HTML, CSS, and JavaScript Code Runner?</h2>
      <p>The PPM Creator Code Runner is an online coding playground that allows developers and learners to write HTML, CSS, and JavaScript directly in their browser. It provides an instant, live preview of the output without the need to set up a local development environment. This tool is ideal for quick testing, debugging, and experimenting with web technologies.</p>
      <p>Traditionally, to test a simple HTML page, you would need a text editor, save the file, and then open it in a browser. If you wanted to add CSS or JavaScript, the process became even more complex. This tool eliminates all that friction by combining the editor and the browser preview into one single interface.</p>
      
      <h2>Why Use an Online Code Runner?</h2>
      <p>There are several reasons why an online code runner is an essential tool for web developers:</p>
      <ul>
        <li><b>Instant Feedback:</b> Write a line of code and see the result immediately. This tight feedback loop is the fastest way to learn and debug.</li>
        <li><b>No Setup Required:</b> You do not need to install Node.js, configure a server, or create project folders. Just open the page and start coding.</li>
        <li><b>Safe Sandbox:</b> The code runs in an isolated environment. Even if you write a script that crashes, it will not affect your browser or your computer.</li>
        <li><b>Cross-Device Compatibility:</b> Because it runs in the browser, you can use it on any device, including Chromebooks, tablets, and even smartphones.</li>
      </ul>

      <h2>How to Use the Code Runner</h2>
      <p>Using the tool is straightforward. You are presented with three tabs: HTML, CSS, and JS.</p>
      <ol>
        <li>Click on the <b>HTML</b> tab to write your markup. This is the structure of your page.</li>
        <li>Switch to the <b>CSS</b> tab to style your elements. You can use classes, IDs, and flexbox just like a normal stylesheet.</li>
        <li>Use the <b>JS</b> tab to add interactivity. You can select elements, add event listeners, and manipulate the DOM.</li>
        <li>The <b>Live Preview</b> panel on the right (or bottom on mobile) updates automatically after a 500-millisecond delay.</li>
      </ol>

      <h2>Common Use Cases</h2>
      <h3>1. Learning Web Development</h3>
      <p>If you are a beginner, this is the perfect tool to practice. You can follow tutorials and test the code instantly. No need to worry about saving files or setting up servers.</p>
      <h3>2. Debugging Snippets</h3>
      <p>Sometimes you copy a piece of code from a forum or a library documentation. Paste it here to verify that it works correctly and to see its visual output.</p>
      <h3>3. Prototyping UI Ideas</h3>
      <p>Before building a full component in a large framework like React, you can quickly draft the HTML and CSS structure here to validate your design idea.</p>

      <h2>Security and Privacy</h2>
      <p>We take privacy seriously. All the code you write in this tool is processed entirely on your device. It is never uploaded to a server, and it is not stored in any database. When you close the tab, the code is gone. The preview runs inside a sandboxed iframe, which prevents it from accessing sensitive data like cookies or the local storage of this website.</p>
    </>
  )

  return (
    <ToolShell
      title="HTML CSS JS Code Runner & Live Preview | PPM Creator Tools"
      description="Run HTML, CSS, and JavaScript code online. Test your code live in the browser with instant preview. No signup required, completely private."
      path="/code-runner"
      crumb={[{ label: 'Developer Tools', to: '/calculators' }]}
      h1="HTML, CSS, and JS Live Preview"
      lead="Write code in the editor and see the result instantly in the live preview."
      faqGroups={faqGroups}
      related={[
        { name: 'HTML Formatter', href: '/html-formatter', blurb: 'Beautify HTML code' },
        { name: 'CSS Minifier', href: '/css-minifier', blurb: 'Compress CSS files' },
        { name: 'HTML to Text', href: '/html-to-text', blurb: 'Remove HTML tags' },
        { name: 'Word Counter', href: '/word-counter', blurb: 'Count characters' },
      ]}
      guides={[
        { title: 'HTML vs CSS vs JS: What is the difference?', slug: 'html-css-js-difference' },
        { title: '10 HTML best practices for beginners', slug: 'html-best-practices' },
        { title: 'Why sandboxed previews matter in web tools', slug: 'sandboxed-preview-security' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        
        <div style={{ display: 'flex', gap: 4, borderBottom: '1px solid #e7e5e4', marginBottom: 12 }}>
          {(['html', 'css', 'js'] as const).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              style={{
                padding: '10px 20px',
                background: tab === t ? '#fff' : 'transparent',
                border: '1px solid #e7e5e4',
                borderBottomColor: tab === t ? '#fff' : 'transparent',
                marginBottom: '-1px',
                borderTopLeftRadius: 8,
                borderTopRightRadius: 8,
                cursor: 'pointer',
                fontSize: 14,
                fontWeight: 600,
                color: tab === t ? '#F97316' : '#6b7280',
              }}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr)', gap: 12 }}>
          {tab === 'html' && (
            <textarea
              value={html}
              onChange={(e) => setHtml(e.target.value)}
              spellCheck={false}
              style={{ width: '100%', height: 250, padding: 16, border: '1px solid #e7e5e4', borderRadius: 8, fontFamily: 'ui-monospace, Consolas, monospace', fontSize: 13, background: '#fff', resize: 'vertical' }}
            />
          )}
          {tab === 'css' && (
            <textarea
              value={css}
              onChange={(e) => setCss(e.target.value)}
              spellCheck={false}
              style={{ width: '100%', height: 250, padding: 16, border: '1px solid #e7e5e4', borderRadius: 8, fontFamily: 'ui-monospace, Consolas, monospace', fontSize: 13, background: '#fff', resize: 'vertical' }}
            />
          )}
          {tab === 'js' && (
            <textarea
              value={js}
              onChange={(e) => setJs(e.target.value)}
              spellCheck={false}
              style={{ width: '100%', height: 250, padding: 16, border: '1px solid #e7e5e4', borderRadius: 8, fontFamily: 'ui-monospace, Consolas, monospace', fontSize: 13, background: '#fff', resize: 'vertical' }}
            />
          )}
        </div>

        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <h3 style={{ margin: 0, fontSize: 16, color: '#1c1917' }}>Live Preview</h3>
          </div>
          <div style={{ border: '1px solid #e7e5e4', borderRadius: 8, overflow: 'hidden', background: '#fff' }}>
            <iframe
              title="Code preview"
              srcDoc={srcDoc}
              sandbox="allow-scripts allow-modals allow-forms allow-popups"
              style={{ width: '100%', height: 400, border: 0, display: 'block' }}
            />
          </div>
        </div>

      </section>
    </ToolShell>
  )
}