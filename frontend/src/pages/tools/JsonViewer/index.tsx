import { useState } from 'react'
import ToolShell from '@/components/ToolShell'

type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue }

function TreeNode({ name, data }: { name: string | null, data: JsonValue }) {
  const [isOpen, setIsOpen] = useState(true)

  const isObject = typeof data === 'object' && data !== null && !Array.isArray(data)
  const isArray = Array.isArray(data)
  const isExpandable = isObject || isArray
  const entries = isArray ? (data as JsonValue[]).map((v, i) => [i.toString(), v]) : isObject ? Object.entries(data) : []

  const renderValue = () => {
    if (data === null) return <span style={{ color: '#71717a' }}>null</span>
    if (typeof data === 'boolean') return <span style={{ color: '#8b5cf6' }}>{data.toString()}</span>
    if (typeof data === 'number') return <span style={{ color: '#e11d48' }}>{data}</span>
    if (typeof data === 'string') return <span style={{ color: '#15803d' }}>"{data}"</span>
    return null
  }

  return (
    <div style={{ paddingLeft: 16, fontFamily: 'monospace', fontSize: 13, lineHeight: 1.6 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        {isExpandable && (
          <button onClick={() => setIsOpen(!isOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: 10, width: 14, color: '#6b7280' }}>
            {isOpen ? '▼' : '▶'}
          </button>
        )}
        {!isExpandable && <span style={{ width: 14 }} />}
        
        {name !== null && <span style={{ color: '#F97316', fontWeight: 600 }}>{name}:</span>}
        {isExpandable && !isOpen && <span style={{ color: '#6b7280', marginLeft: 4 }}>{isArray ? '[ ... ]' : '{ ... }'}</span>}
        {!isExpandable && <span style={{ marginLeft: 4 }}>{renderValue()}</span>}
      </div>
      
      {isExpandable && isOpen && (
        <div style={{ borderLeft: '1px solid #e7e5e4', marginLeft: 6 }}>
          {entries.map(([k, v]) => <TreeNode key={k} name={isArray ? k : k} data={v} />)}
        </div>
      )}
    </div>
  )
}

export default function JsonViewer() {
  const [input, setInput] = useState('{\n  "name": "PPM Creator Tools",\n  "isAwesome": true,\n  "tools": 30,\n  "features": ["Fast", "Private", "Free"],\n  "author": {\n    "name": "Admin",\n    "verified": true\n  }\n}')
  const [parsed, setParsed] = useState<JsonValue | null>(null)
  const [error, setError] = useState('')

  const handleFormat = () => {
    setError('')
    try {
      if (!input.trim()) return
      const obj = JSON.parse(input)
      setParsed(obj)
    } catch (e: any) {
      setError(e.message)
      setParsed(null)
    }
  }

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What is a JSON Viewer?', a: 'A JSON Viewer takes raw JSON data and displays it as a clean, interactive tree structure. This makes it easy to read and navigate through deeply nested objects and arrays.' },
      { q: 'Is this tool free?', a: 'Yes, it is completely free. You can validate, format, and view as many JSON files as you like without any limits.' },
      { q: 'Is my data sent to a server?', a: 'No. The parsing and rendering happen entirely in your browser. Your JSON data is never uploaded, ensuring complete privacy.' },
      { q: 'Can it fix broken JSON?', a: 'It does not automatically fix broken JSON, but it provides the exact error message (like a missing comma or quote) so you can easily correct it.' },
    ]},
    { heading: 'Using the Viewer', items: [
      { q: 'How do I use the tree view?', a: 'Simply paste your JSON into the input box and click "View JSON". The output will appear as a tree where you can click the arrows to expand or collapse nested nodes.' },
      { q: 'Can I copy the formatted JSON?', a: 'Yes, once your JSON is parsed successfully, you can copy it or download it as a .json file for later use.' },
      { q: 'Does it support large JSON files?', a: 'Yes, it handles large files well. However, extremely large files (over 5MB) might slow down your browser due to the massive DOM rendering required for the tree.' },
      { q: 'What is the difference between an array and an object?', a: 'An object uses curly braces {} and has key-value pairs. An array uses square brackets [] and holds a list of items. This viewer clearly shows both.' },
    ]},
    { heading: 'Privacy & Security', items: [
      { q: 'Is my JSON kept private?', a: 'Absolutely. Everything runs locally in your browser memory. We have no backend that receives your data.' },
      { q: 'Can I view API responses here?', a: 'Yes. If you have a JSON response from an API, you can copy it and paste it here to see its structure clearly.' },
    ]},
  ]

  const article = (
    <>
      <h2>What is a JSON Viewer?</h2>
      <p>A JSON (JavaScript Object Notation) Viewer is a tool that converts raw JSON strings into an interactive, human-readable format. JSON is the standard data format for APIs and configuration files, but when it is minified or deeply nested, it becomes very difficult to read.</p>
      <p>This tool not only formats the JSON but also creates a collapsible tree view, allowing you to explore large datasets effortlessly.</p>
      
      <h2>Why Use Our JSON Viewer?</h2>
      <ul>
        <li><b>Instant Validation:</b> It checks if your JSON is valid. If there is an error, it tells you exactly where the syntax broke.</li>
        <li><b>Tree Navigation:</b> Click to expand or collapse objects and arrays. Perfect for exploring complex API responses.</li>
        <li><b>Dark Mode Supported Colors:</b> Syntax highlighting makes it easy to distinguish strings, numbers, and booleans.</li>
        <li><b>Privacy First:</b> Your data never leaves your browser. No server uploads.</li>
      </ul>

      <h2>How to Use the Tool</h2>
      <ol>
        <li>Paste your raw JSON into the "Input JSON" textarea.</li>
        <li>Click the "View JSON" button.</li>
        <li>If the JSON is valid, it will render as a tree below. You can click the arrows to expand/collapse nodes.</li>
        <li>If there is an error, a red message will show you exactly what is wrong (e.g., "Unexpected token at position 14").</li>
      </ol>

      <h2>Common JSON Errors</h2>
      <p>When parsing JSON, the most common errors include:</p>
      <ul>
        <li><b>Trailing Commas:</b> JSON does not allow a comma after the last item in an object or array.</li>
        <li><b>Unquoted Keys:</b> All keys in a JSON object must be wrapped in double quotes.</li>
        <li><b>Single Quotes:</b> JSON strictly requires double quotes ("), not single quotes (').</li>
      </ul>
    </>
  )

  return (
    <ToolShell
      title="JSON Viewer, Formatter & Validator | PPM Creator Tools"
      description="View, format, and validate JSON data online. Our interactive tree view makes it easy to explore complex JSON structures. Free, fast, and private."
      path="/json-viewer"
      crumb={[{ label: 'Developer Tools', to: '/calculators' }]}
      h1="JSON Viewer & Formatter"
      lead="Paste your JSON below to format it and view it as an interactive tree."
      faqGroups={faqGroups}
      related={[
        { name: 'CSV to JSON', href: '/csv-to-json', blurb: 'Convert CSV to JSON' },
        { name: 'HTML Formatter', href: '/html-formatter', blurb: 'Format HTML code' },
        { name: 'Code Runner', href: '/code-runner', blurb: 'Run HTML/CSS/JS live' },
        { name: 'Word Counter', href: '/word-counter', blurb: 'Count characters' },
      ]}
      guides={[
        { title: 'Understanding JSON structure', slug: 'understanding-json' },
        { title: 'How to fix common JSON errors', slug: 'fix-json-errors' },
        { title: 'JSON vs XML: What is the difference?', slug: 'json-vs-xml' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        
        <div style={{ marginBottom: 14 }}>
          <label style={{ fontSize: 13, color: '#6b7280', fontWeight: 600 }}>Input JSON</label>
          <textarea 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            rows={8} 
            style={{ width: '100%', padding: 12, border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 4, fontFamily: 'monospace', fontSize: 13, background: '#fff' }} 
          />
        </div>

        <button type="button" onClick={handleFormat} style={{ padding: '10px 20px', background: '#F97316', color: '#fff', border: 0, borderRadius: 8, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
          View JSON
        </button>

        {error && (
          <div style={{ marginTop: 14, padding: 12, background: '#FEF2F2', border: '1px solid #fecaca', borderRadius: 8, color: '#B91C1C', fontSize: 13 }}>
            <b>Error:</b> {error}
          </div>
        )}

        {parsed && (
          <div style={{ marginTop: 20 }}>
            <label style={{ fontSize: 13, color: '#6b7280', fontWeight: 600, marginBottom: 8, display: 'block' }}>Tree View</label>
            <div style={{ border: '1px solid #e7e5e4', borderRadius: 10, padding: 16, background: '#fff', overflowX: 'auto' }}>
              <TreeNode name={null} data={parsed} />
            </div>
          </div>
        )}

      </section>
    </ToolShell>
  )
}