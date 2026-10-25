import { useMemo, useState } from 'react'

export default function WordCounter() {
  const [text, setText] = useState('')
  const stats = useMemo(() => {
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const chars = text.length
    const charsNoSpace = text.replace(/\s/g, '').length
    const sentences = text.split(/[.!?]+/).filter(s => s.trim()).length
    const paragraphs = text.split(/\n+/).filter(p => p.trim()).length
    const readingTime = Math.ceil(words / 200)
    return { words, chars, charsNoSpace, sentences, paragraphs, readingTime }
  }, [text])
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">📝 Word Counter</h1>
        <p className="mt-2 text-slate-600">Count words, characters, sentences, and reading time.</p>
      </div>
      <div className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100 space-y-4">
        <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Start typing..." rows={10} className="w-full px-4 py-3 border border-slate-200 rounded-lg focus:ring-2 focus:ring-brand-500" />
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            ['Words', stats.words],
            ['Characters', stats.chars],
            ['No Spaces', stats.charsNoSpace],
            ['Sentences', stats.sentences],
            ['Paragraphs', stats.paragraphs],
            ['Reading (min)', stats.readingTime],
          ].map(([label, value]) => (
            <div key={label} className="bg-brand-50 p-4 rounded-xl text-center">
              <p className="text-2xl font-bold text-brand-600">{value}</p>
              <p className="text-xs text-slate-600 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}