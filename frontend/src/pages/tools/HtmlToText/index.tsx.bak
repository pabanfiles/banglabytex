import { useState } from 'react'
import { toast } from 'sonner'
import { Type, Download } from 'lucide-react'
import ToolPageLayout from '@/components/ToolPageLayout'
import { useToolData } from '@/hooks/useToolData'

export default function HtmlToText() {
  const { toolData, faqs, relatedPosts } = useToolData('html-to-text')
  const [html, setHtml] = useState('')

  const handleConvert = () => {
    const doc = new DOMParser().parseFromString(html, 'text/html')
    const text = doc.body.textContent || ''
    setHtml(text)
    toast.success('Converted!')
  }

  return (
    <ToolPageLayout title={toolData?.h1_title || 'HTML to Text Converter'} description={toolData?.intro_text || 'Remove HTML tags and extract clean text.'} category="Converters" faqs={faqs} relatedPosts={relatedPosts}>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 max-w-3xl mx-auto">
        <label className="block mb-2 font-semibold text-slate-700 dark:text-slate-300">Paste HTML Code:</label>
        <textarea rows={8} value={html} onChange={e => setHtml(e.target.value)} className="w-full p-4 border rounded-xl mb-4 font-mono text-sm" placeholder="<h1>Hello</h1> <p>World</p>"></textarea>
        <button onClick={handleConvert} className="w-full py-4 bg-[#F97316] text-white font-bold rounded-full">
          <Type size={18} className="inline mr-2"/> Extract Text
        </button>
      </div>
    </ToolPageLayout>
  )
}