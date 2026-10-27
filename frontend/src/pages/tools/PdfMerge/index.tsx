import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, ExternalLink } from 'lucide-react'

export default function PdfMerge() {
  const [toolData, setToolData] = useState<any>(null)

  useEffect(() => {
    fetch('/api/tools').then(r => r.json()).then(d => {
      if(Array.isArray(d)) {
        const t = d.find(x => x.slug === 'pdf-merge')
        if(t) setToolData(t)
      }
    }).catch(()=>{})
  }, [])

  let faqs = []
  try { faqs = JSON.parse(toolData?.faq_json || '[]') } catch(e) {}

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <div className="text-sm text-slate-500 mb-4 flex items-center gap-1">
        <Link to="/" className="hover:text-[#F97316]">Home</Link> <ChevronRight size={14}/> <span className="text-[#F97316]">Merge PDF</span>
      </div>

      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#431407]">{toolData?.h1_title || 'Merge PDF Files Online Free'}</h1>
      <p className="text-slate-600 mb-8">{toolData?.intro_text || 'Combine multiple PDF documents into one single file.'}</p>

      <div className="bg-white p-8 rounded-3xl shadow-sm border border-[#FFEDD5] text-center mb-12">
        <p className="text-slate-600 mb-6">Click the button below to open our secure PDF merging tool.</p>
        <a href="/pdf-tools.html?tool=merge" className="inline-flex items-center gap-2 px-8 py-4 bg-[#F97316] text-white font-bold rounded-full shadow-lg hover:bg-[#EA580C] transition">
          Open Merge Tool <ExternalLink size={18}/>
        </a>
      </div>

      {faqs.length > 0 && (
        <div className="bg-white p-8 rounded-3xl border border-[#FFEDD5] shadow-sm">
          <h2 className="text-2xl font-bold text-[#431407] mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq: any, index: number) => (
              <div key={index}>
                <h3 className="text-lg font-bold text-slate-800">{faq.q}</h3>
                <p className="text-slate-600 mt-1">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}