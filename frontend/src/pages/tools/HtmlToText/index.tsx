import { useState } from 'react'
import { Copy, Code2 } from 'lucide-react'
import { toast } from 'sonner'

export default function HtmlToText() {
  const [html, setHtml] = useState('')
  const [text, setText] = useState('')

  const convert = () => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    setText(doc.body.textContent || '')
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-extrabold text-center mb-8">HTML to Text Converter</h1>
      <div className="bg-white p-6 rounded-3xl shadow-sm border space-y-4">
        <label className="font-semibold text-slate-700">Paste your HTML code:</label>
        <textarea value={html} onChange={e => setHtml(e.target.value)} rows={6} className="w-full p-4 border rounded-xl font-mono text-sm bg-slate-50" placeholder="<h1>Hello</h1> <p>World</p>..." />
        <button onClick={convert} className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl w-full">Extract Text</button>
        
        {text && (
          <div className="mt-4">
            <div className="flex justify-between items-center mb-2">
              <label className="font-semibold text-slate-700">Extracted Text:</label>
              <button onClick={() => { navigator.clipboard.writeText(text); toast.success('Copied!') }} className="text-emerald-600 text-sm flex items-center gap-1"><Copy size={14}/> Copy</button>
            </div>
            <textarea value={text} readOnly rows={6} className="w-full p-4 border rounded-xl bg-slate-50" />
          </div>
        )}
      </div>
    </div>
  )
}