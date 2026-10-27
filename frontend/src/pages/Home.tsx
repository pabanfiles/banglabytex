import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Search } from 'lucide-react'
import { useState, useEffect } from 'react'

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
  const filteredTools = ALL_TOOLS.filter(t => t.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="bg-[#FFF7ED] dark:bg-slate-900 min-h-screen">
      <section className="bg-[#F97316] text-white pt-20 pb-32 rounded-b-[3rem] text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">Free Online Tools</h1>
        <div className="max-w-xl mx-auto relative">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input type="text" placeholder="Search tools..." value={search} onChange={e => setSearch(e.target.value)} className="w-full pl-12 pr-4 py-4 rounded-full text-slate-900 outline-none" />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 -mt-16 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredTools.map(tool => (
            <a key={tool.name} href={tool.link} className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg hover:-translate-y-1 transition border border-slate-100 dark:border-slate-700">
              <div className="text-4xl mb-4">{tool.icon}</div>
              <h3 className="text-lg font-bold text-[#431407] dark:text-white">{tool.name}</h3>
              <div className="mt-4 text-[#F97316] font-semibold flex items-center gap-2">Open <ArrowRight size={16}/></div>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}