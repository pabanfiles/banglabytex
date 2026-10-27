import { useState } from 'react'
import { ArrowRight, Search, Sparkles } from 'lucide-react'

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
  
  const filteredTools = ALL_TOOLS.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      {/* HERO SECTION with Animation */}
      <section className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 pt-24 pb-32 text-center px-4 transition-colors duration-300">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF7ED] dark:bg-slate-700 text-[#F97316] text-sm font-medium mb-6 animate-bounce">
            <Sparkles size={16} /> All-in-One Digital Hub
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-slate-900 dark:text-white tracking-tight animate-[fadeIn_1s_ease-in-out]">
            Free Online Tools <br />
            <span className="text-[#F97316]">for Everyone</span>
          </h1>
          
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10">
            PDF, image, document and file tools that work fast in your browser. No signup required.
          </p>

          <div className="max-w-xl mx-auto relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search tools..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
              className="w-full pl-14 pr-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm focus:ring-2 focus:ring-[#F97316] outline-none transition-all" 
            />
          </div>
        </div>
      </section>

      {/* TOOLS GRID with Animation */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((tool, index) => (
            <a 
              key={tool.name} 
              href={tool.link} 
              className="group bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl hover:border-[#F97316] hover:-translate-y-2 transition-all duration-300 flex flex-col h-full opacity-0 animate-[fadeInUp_0.5s_ease-out_forwards]"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="w-12 h-12 bg-slate-50 dark:bg-slate-700 text-3xl rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300">
                {tool.icon}
              </div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-[#F97316] transition-colors mb-2">
                {tool.name}
              </h3>
              <div className="mt-auto pt-4 flex items-center text-sm font-semibold text-slate-500 dark:text-slate-400 group-hover:text-[#F97316] transition-colors">
                Open Tool <ArrowRight size={16} className="ml-1 group-hover:translate-x-1 transition-transform"/>
              </div>
            </a>
          ))}
          {filteredTools.length === 0 && (
            <p className="col-span-full text-center text-slate-500 py-10">No tools found for "{search}"</p>
          )}
        </div>
      </section>

      {/* Tailwind Animation Keyframes */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}