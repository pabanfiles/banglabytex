import { useState, useRef, useEffect } from 'react'
import { ArrowRight, Search, X } from 'lucide-react'

const ALL_TOOLS = [
  { name: 'PDF Editor', icon: '📝', link: '/pdf-editor.html' },
  { name: 'Merge PDF', icon: '🔗', link: '/pdf-merge' },
  { name: 'Split PDF', icon: '✂️', link: '/pdf-split' },
  { name: 'Compress PDF', icon: '📉', link: '/pdf-compress' },
  { name: 'Image Compressor', icon: '🖼️', link: '/image-compress' },
  { name: 'CSV to JSON', icon: '📊', link: '/csv-to-json' },
  { name: 'HTML to Text', icon: '💻', link: '/html-to-text' },
  { name: 'Office to PDF', icon: '📄', link: '/office-to-pdf' },
  { name: 'Age Calculator', icon: '🎂', link: '/age-calculator' },
  { name: 'Percentage Calculator', icon: '🧮', link: '/percentage-calc' },
  { name: 'QR Generator', icon: '📱', link: '/qr-code-gen' },
  { name: 'CV Maker', icon: '📋', link: '/cv-maker' },
  { name: 'Video Downloader', icon: '🎬', link: '/video-downloader' },
]

export default function Home() {
  const [search, setSearch] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setShowSuggestions(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filteredTools = ALL_TOOLS.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      <section className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 pt-24 pb-32 text-center px-4 relative z-10">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-slate-900 dark:text-white tracking-tight">
          Free Online Tools
        </h1>
        
        <div className="max-w-xl mx-auto relative" ref={searchRef}>
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search tools..." 
            value={search} 
            onChange={e => { setSearch(e.target.value); setShowSuggestions(true) }} 
            onFocus={() => setShowSuggestions(true)}
            className="w-full pl-14 pr-12 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm focus:ring-2 focus:ring-[#F97316] outline-none transition-all" 
          />
          {search && (
            <button onClick={() => setSearch('')} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
              <X size={20}/>
            </button>
          )}

          {/* Auto-Suggest Dropdown */}
          {showSuggestions && search.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-800 rounded-xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden text-left">
              {filteredTools.length > 0 ? (
                <div className="max-h-64 overflow-y-auto">
                  {filteredTools.map(tool => (
                    <a key={tool.name} href={tool.link} className="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-slate-100 dark:border-slate-700 last:border-0 transition">
                      <span className="text-xl">{tool.icon}</span>
                      <span className="font-semibold text-slate-800 dark:text-white">{tool.name}</span>
                      <ArrowRight size={14} className="ml-auto text-slate-400" />
                    </a>
                  ))}
                </div>
              ) : (
                <div className="px-4 py-4 text-center text-slate-500 text-sm">No tools found.</div>
              )}
            </div>
          )}
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map(tool => (
            <a key={tool.name} href={tool.link} className="group bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-[#F97316] hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-700 text-3xl rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">{tool.icon}</div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#F97316] transition-colors mb-2">{tool.name}</h3>
              <div className="mt-auto pt-4 flex items-center text-sm font-semibold text-slate-500 dark:text-slate-400 group-hover:text-[#F97316] transition-colors">
                Open Tool <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform"/>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  )
}