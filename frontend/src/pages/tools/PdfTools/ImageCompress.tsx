import { Link } from 'react-router-dom'
import { ChevronRight, ExternalLink } from 'lucide-react'
export default function ImageCompress() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <div className="text-sm text-slate-500 mb-4 flex items-center gap-1">
        <Link to="/" className="hover:text-[#F97316]">Home</Link> <ChevronRight size={14}/> <span className="text-[#F97316]">Image Compressor</span>
      </div>
      <h1 className="text-3xl md:text-4xl font-bold mb-6 text-[#431407]">Compress Image Online Free</h1>
      <p className="text-slate-600 mb-8">Reduce JPG, PNG, and WebP file sizes easily.</p>
      <div className="bg-white p-10 rounded-3xl shadow-lg border border-[#FFEDD5] text-center">
        <a href="/pdf-tools.html?tool=comp" className="inline-flex items-center gap-2 px-10 py-4 bg-[#F97316] text-white font-bold rounded-full shadow-xl hover:bg-[#EA580C] transition">
          Open Compress Tool <ExternalLink size={18}/>
        </a>
      </div>
    </div>
  )
}