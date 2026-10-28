import { useState } from 'react'
import ToolPageLayout from '@/components/ToolPageLayout'
import { useToolData } from '@/hooks/useToolData'

export default function WordCounter() {
  const { toolData, faqs, relatedPosts } = useToolData('word-counter')
  const [text, setText] = useState('')
  const words = text.trim() ? text.trim().split(/\s+/).length : 0
  const chars = text.length
  const charsNoSpace = text.replace(/\s/g, '').length

  return (
    <ToolPageLayout title={toolData?.h1_title || 'Word Counter'} description={toolData?.intro_text || 'Count words, characters, and reading time.'} category="Text Tools" faqs={faqs} relatedPosts={relatedPosts}>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 max-w-2xl mx-auto">
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Start typing..." rows={8} className="w-full p-4 border rounded-xl mb-4" />
        <div className="grid grid-cols-3 gap-3">
          <div className="bg-[#FFF7ED] dark:bg-slate-700 p-4 rounded-xl text-center"><p className="text-2xl font-bold text-[#F97316]">{words}</p><p className="text-xs text-slate-600 dark:text-slate-300">Words</p></div>
          <div className="bg-[#FFF7ED] dark:bg-slate-700 p-4 rounded-xl text-center"><p className="text-2xl font-bold text-[#F97316]">{chars}</p><p className="text-xs text-slate-600 dark:text-slate-300">Characters</p></div>
          <div className="bg-[#FFF7ED] dark:bg-slate-700 p-4 rounded-xl text-center"><p className="text-2xl font-bold text-[#F97316]">{charsNoSpace}</p><p className="text-xs text-slate-600 dark:text-slate-300">No Spaces</p></div>
        </div>
      </div>
    </ToolPageLayout>
  )
}