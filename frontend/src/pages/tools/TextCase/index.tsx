import { useState } from 'react'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'
import ToolPageLayout from '@/components/ToolPageLayout'
import { useToolData } from '@/hooks/useToolData'

export default function TextCase() {
  const { toolData, faqs, relatedPosts } = useToolData('text-case-converter')
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
    <ToolPageLayout title={toolData?.h1_title || 'Text Case Converter'} description={toolData?.intro_text || 'Convert text to UPPERCASE, lowercase, Title Case, and more.'} category="Text Tools" faqs={faqs} relatedPosts={relatedPosts}>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 max-w-2xl mx-auto">
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Type or paste your text here..." rows={6} className="w-full p-4 border rounded-xl mb-4" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 mb-4">
          {Object.entries(transforms).map(([name, fn]) => (
            <button key={name} onClick={() => { setText(fn(text)); toast.success(name) }} className="px-3 py-2 bg-[#F97316] text-white rounded-lg hover:bg-[#EA580C] text-sm">{name}</button>
          ))}
        </div>
        <button onClick={() => { navigator.clipboard.writeText(text); toast.success('Copied!') }} className="w-full py-3 bg-slate-800 text-white font-bold rounded-xl flex items-center justify-center gap-2"><Copy size={16}/> Copy Text</button>
      </div>
    </ToolPageLayout>
  )
}