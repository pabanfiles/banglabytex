import { useState } from 'react'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

export default function TextCaseConverter() {
  const [text, setText] = useState('')
  const transforms = {
    'UPPERCASE': (s: string) => s.toUpperCase(),
    'lowercase': (s: string) => s.toLowerCase(),
    'Title Case': (s: string) => s.replace(/\w\S*/g, t => t.charAt(0).toUpperCase() + t.substr(1).toLowerCase()),
    'Sentence case': (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase(),
    'camelCase': (s: string) => s.toLowerCase().replace(/[^a-zA-Z0-9]+(.)/g, (_, c) => c.toUpperCase()),
    'snake_case': (s: string) => s.trim().toLowerCase().replace(/\s+/g, '_'),
  }
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">🔤 Text Case Converter</h1>
        <p className="mt-2 text-slate-600">Transform your text into any case instantly.</p>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100 space-y-4">
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Type or paste your text here..." rows={6} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {Object.entries(transforms).map(([name, fn]) => (
            <button key={name} onClick={() => { setText(fn(text)); toast.success(name) }} className="px-3 py-2 bg-brand-600 text-white rounded-lg hover:bg-brand-700 text-sm">{name}</button>
          ))}
        </div>
        <button onClick={() => { navigator.clipboard.writeText(text); toast.success('Copied!') }} className="flex items-center gap-2 px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700">
          <Copy size={16} /> Copy Text
        </button>
      </div>
    </div>
  )
}