import { useState, useRef, useEffect } from 'react'
import { ArrowRight, Search, Sparkles, X } from 'lucide-react'

const ALL_TOOLS = [
  { name: 'PDF Editor', icon: '📝', link: '/pdf-editor.html' },
  { name: 'Merge PDF', icon: '🔗', link: '/pdf-merge' },
  { name: 'Split PDF', icon: '✂️', link: '/pdf-split' },
  { name: 'Compress PDF', icon: '📉', link: '/pdf-compress' },
  { name: 'Protect PDF', icon: '🔒', link: '/pdf-protect' },
  { name: 'Unlock PDF', icon: '🔓', link: '/pdf-unlock' },
  { name: 'Image Compressor', icon: '🖼️', link: '/image-compress' },
  { name: 'Image Resizer', icon: '📐', link: '/image-resize' },
  { name: 'Image Converter', icon: '🔄', link: '/image-convert' },
  { name: 'Image Cropper', icon: '✂️', link: '/image-crop' },
  { name: 'Image to PDF', icon: '🖼️', link: '/image-to-pdf' },
  { name: 'Background Remover', icon: '✂️', link: '/bg-remover' },
  { name: 'Color Picker', icon: '🎨', link: '/image-color-picker' },
  { name: 'Watermark', icon: '💧', link: '/image-watermark' },
  { name: 'Favicon Gen', icon: '⭐', link: '/favicon-generator' },
  { name: 'Rotate & Flip', icon: '🔄', link: '/image-rotate' },
  { name: 'Passport Photo', icon: '👤', link: '/passport-photo' },
  { name: 'To Base64', icon: '💻', link: '/image-to-base64' },
  { name: 'Meme Generator', icon: '😂', link: '/meme-generator' },
  { name: 'Image to Text', icon: '🔍', link: '/image-to-text' },
    { name: 'PDF to Word', icon: '📄', link: '/pdf-to-word' },
  { name: 'PDF to Excel', icon: '📊', link: '/pdf-to-excel' },
  { name: 'Word to PDF', icon: '📝', link: '/word-to-pdf' },
  { name: 'Excel to PDF', icon: '📈', link: '/excel-to-pdf' },
  { name: 'PPT to PDF', icon: '📽️', link: '/ppt-to-pdf' },
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

  // ক্লিক আউটসাইড করলে সাজেশন বন্ধ হবে
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredTools = ALL_TOOLS.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-slate-50 dark:bg-slate-900 min-h-screen">
      {/* HERO SECTION */}
      <section className="bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 pt-24 pb-32 text-center px-4 transition-colors duration-300">
        <div className="max-w-3xl mx-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FFF7ED] dark:bg-slate-700 text-[#F97316] text-sm font-medium mb-6 animate-bounce">
            <Sparkles size={16} /> All-in-One Digital Hub
          </div>
          
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 text-slate-900 dark:text-white tracking-tight">
            PPM Creator Tools
          </h1>
          
          <p className="text-lg text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-10">
            Explore our growing collection of fast, secure, and free online tools for PDF, images, videos, and everyday tasks.
          </p>

          {/* Search Bar with Auto Suggest */}
          <div className="max-w-xl mx-auto relative" ref={searchRef}>
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={22}/>
            <input 
              type="text" 
              placeholder="Search tools (e.g. PDF, Image...)" 
              value={search} 
              onChange={e => { setSearch(e.target.value); setShowSuggestions(true) }} 
              onFocus={() => setShowSuggestions(true)}
              className="w-full pl-14 pr-12 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-700 shadow-sm focus:ring-2 focus:ring-[#F97316] outline-none transition-all" 
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={20}/>
              </button>
            )}

            {/* Auto Suggest Dropdown */}
            {showSuggestions && search.length > 0 && (
              <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden text-left z-50">
                {filteredTools.length > 0 ? (
                  <div className="max-h-64 overflow-y-auto">
                    {filteredTools.map(tool => (
                      <a key={tool.name} href={tool.link} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-700 border-b border-slate-100 dark:border-slate-700 last:border-0 transition-colors">
                        <span className="text-2xl">{tool.icon}</span>
                        <span className="font-semibold text-slate-800 dark:text-white">{tool.name}</span>
                        <ArrowRight size={16} className="ml-auto text-slate-400" />
                      </a>
                    ))}
                  </div>
                ) : (
                  <div className="px-6 py-6 text-center text-slate-500 text-sm">No tools found for "{search}"</div>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* TOOLS GRID */}
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

      {/* Keyframes for Animation */}
      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}