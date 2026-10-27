import { Link } from 'react-router-dom'
import { ChevronRight, ExternalLink } from 'lucide-react'
export default function PdfMerge() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-sm text-slate-500 mb-4 flex items-center gap-1">
        <Link to="/" className="hover:text-[#F97316]">Home</Link> <ChevronRight size={14}/> <span className="text-[#F97316]">Merge PDF</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#431407]">Merge PDF Files Online Free</h1>
      <p className="text-slate-600 mb-8">Combine multiple PDF documents into a single file. Fast, free, and secure.</p>
      <div className="bg-white p-10 rounded-3xl shadow-lg border border-[#FFEDD5] text-center">
        <h2 className="text-xl font-bold text-slate-800 mb-4">Ready to merge your PDFs?</h2>
        <p className="text-slate-500 mb-8">Click the button below to open our secure PDF merging tool.</p>
        <a href="/pdf-tools.html?tool=merge" className="inline-flex items-center gap-2 px-10 py-4 bg-[#F97316] text-white font-bold rounded-full shadow-xl hover:bg-[#EA580C] transition">
          Open Merge Tool <ExternalLink size={18}/>
        </a>
      </div>
    </div>
  )
}