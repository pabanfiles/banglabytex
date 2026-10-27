import { ArrowRight, Search } from 'lucide-react'
import { useState } from 'react'

const ALL_TOOLS = [
  { name: 'PDF Editor', icon: '📝', link: '/pdf-editor.html' },
  { name: 'Merge PDF', icon: '🔗', link: '/pdf-merge' },
  { name: 'Split PDF', icon: '✂️', link: '/pdf-split' },
  { name: 'Compress PDF', icon: '📉', link: '/pdf-compress' },
  { name: 'Image Compressor', icon: '🖼️', link: '/image-compress' },
  { name: 'Age Calculator', icon: '🎂', link: '/age-calculator' },
  { name: 'Percentage Calculator', icon: '🧮', link: '/percentage-calc' },
  { name: 'QR Generator', icon: '📱', link: '/qr-code-gen' },
  { name: 'CV Maker', icon: '📋', link: '/cv-maker' },
  { name: 'Video Downloader', icon: '🎬', link: '/video-downloader' },
]

export default function Home() {
  const [search, setSearch] = useState('')
  
  const filteredTools = ALL_TOOLS.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-slate-50 min-h-screen">
      {/* HERO SECTION */}
      <section className="bg-white border-b border-slate-200 pt-24 pb-32 text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-slate-900 tracking-tight">
          Free Online Tools <br />
          <span className="text-[#F97316]">for Everyone</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto mb-10">
          PDF, image, document and file tools that work fast in your browser. No signup required.
        </p>

        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Search tools..." 
            value={search} 
            onChange={e => setSearch(e.target.value)} 
            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 text-slate-900 border border-slate-200 shadow-sm focus:ring-2 focus:ring-[#F97316] outline-none transition-all" 
          />
        </div>
      </section>

      {/* TOOLS GRID */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map(tool => (
            <a 
              key={tool.name} 
              href={tool.link} 
              className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-[#F97316] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full"
            >
              <div className="w-12 h-12 bg-slate-50 text-3xl rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                {tool.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-[#F97316] transition-colors mb-2">
                {tool.name}
              </h3>
              <div className="mt-auto pt-4 flex items-center text-sm font-semibold text-slate-500 group-hover:text-[#F97316] transition-colors">
                Open Tool <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform"/>
              </div>
            </a>
          ))}
          {filteredTools.length === 0 && (
            <p className="col-span-full text-center text-slate-500 py-10">No tools found for "{search}"</p>
          )}
        </div>
      </section>
    </div>
  )
}