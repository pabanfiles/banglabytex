import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { tools } from '@/config/toolsRegistry'
import { ArrowRight, Sparkles, Zap, Shield, Heart, Search, X } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import SocialLinks from '@/components/SocialLinks'

export default function Home() {
  const [search, setSearch] = useState('')
  const [showSuggestions, setShowSuggestions] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)
  const [dynamicTools, setDynamicTools] = useState<any[]>(tools)

  // Fetch Dynamic Tools from D1 Database
  useEffect(() => {
    fetch('/api/tools')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data) && data.length > 0) {
          // ম্যাপ করা যাতে ডাটাবেসের ডেটা এবং লোকাল কম্পোনেন্ট মিলে যায়
          const merged = tools.map(localTool => {
            const dbTool = data.find((t: any) => t.slug === localTool.slug)
            if(dbTool) {
              return { ...localTool, name: dbTool.h1_title, description: dbTool.intro_text || localTool.description }
            }
            return localTool
          })
          setDynamicTools(merged)
        }
      })
      .catch(() => {})
  }, [])

  // Click outside to close suggestions
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const filteredTools = dynamicTools.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-[#F97316] via-[#EA580C] to-[#C2410C] text-white pt-24 pb-40 rounded-b-[3rem] md:rounded-b-[5rem] overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle, #ffffff 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-medium mb-6 border border-white/30"
          >
            <Sparkles size={16} /> All-in-One Digital Hub
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-3xl leading-tight drop-shadow-sm"
          >
            Free Online Tools <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">for Everyone</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-orange-50 max-w-2xl mb-10"
          >
            PDF, image, document and file tools that work fast in your browser. No signup. No limits.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a href="#tools" className="px-8 py-3.5 bg-white text-[#F97316] font-bold rounded-full transition-all shadow-xl hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-2">
              Explore Tools <ArrowRight size={18} />
            </a>
          </motion.div>
        </div>
      </section>

      {/* SEARCH & SOCIAL SECTION */}
      <section className="max-w-4xl mx-auto px-4 -mt-20 relative z-20 space-y-6">
        
        {/* Search Bar Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-2xl p-2 border border-slate-100 relative"
          ref={searchRef}
        >
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input 
              type="text" 
              placeholder="Search for tools (e.g. PDF, Video, Calculator...)" 
              value={search}
              onChange={(e) => { setSearch(e.target.value); setShowSuggestions(true); }}
              onFocus={() => setShowSuggestions(true)}
              className="w-full pl-14 pr-12 py-4 rounded-2xl text-slate-900 text-lg outline-none focus:bg-slate-50 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                <X size={20} />
              </button>
            )}
          </div>

          {/* Auto-Suggest */}
          {showSuggestions && search.length > 0 && (
            <div className="absolute top-full left-0 w-full mt-2 bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden z-50">
              {filteredTools.length > 0 ? (
                <div className="max-h-60 overflow-y-auto">
                  {filteredTools.map((tool) => (
                    <Link key={tool.slug} to={tool.externalLink || '/' + tool.slug} className="flex items-center gap-4 px-6 py-3 hover:bg-slate-50 border-b border-slate-50 last:border-0">
                      <span className="text-2xl">{tool.icon}</span>
                      <div>
                        <p className="font-semibold text-slate-900">{tool.name}</p>
                        <p className="text-xs text-slate-500 line-clamp-1">{tool.description}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="px-6 py-4 text-center text-slate-500 text-sm">No tools found for "{search}"</div>
              )}
            </div>
          )}
        </motion.div>

        {/* Social Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 md:p-8 flex flex-col items-center justify-center gap-4 text-center"
        >
          <h3 className="text-xl font-bold text-slate-900">Stay Connected</h3>
          <SocialLinks />
        </motion.div>
      </section>

      {/* TOOLS GRID */}
      <section id="tools" className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#431407] mb-3">PPM Creator Tools</h2>
          <p className="text-slate-500 text-lg">Handcrafted tools to make your digital life easier.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredTools.map((tool, i) => {
            const cardContent = (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
              >
                <div className="w-16 h-16 bg-[#FFF7ED] text-[#F97316] rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">{tool.icon}</div>
                <h3 className="text-xl font-bold text-[#431407] group-hover:text-[#F97316] transition-colors mb-2">{tool.name}</h3>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed mb-6 flex-grow">{tool.description}</p>
                
                <div className="mt-auto pt-4">
                  <div className="inline-flex items-center justify-center gap-2 bg-[#F97316] group-hover:bg-[#EA580C] text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-colors shadow-md w-full">
                    Launch Tool <ArrowRight size={16} />
                  </div>
                </div>
              </motion.div>
            );

            return tool.externalLink ? (
              <a key={tool.slug} href={tool.externalLink} target="_blank" rel="noopener noreferrer" className="h-full">
                {cardContent}
              </a>
            ) : (
              <Link key={tool.slug} to={'/' + tool.slug} className="h-full">
                {cardContent}
              </Link>
            );
          })}
        </div>
      </section>

      {/* FEATURES */}
      <section className="bg-white py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#431407] mb-3">Why PPM Creator?</h2>
            <p className="text-slate-500 text-lg">Built with care, powered by modern tech.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#FFF7ED] border border-[#FFEDD5] hover:shadow-md transition text-center">
              <div className="flex justify-center mb-4"><Zap className="text-[#F97316]" size={36}/></div>
              <h3 className="text-lg font-bold text-[#431407] mb-2">Lightning Fast</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Optimized for speed - every tool loads instantly, no waiting.</p>
            </div>
            <div className="p-8 rounded-3xl bg-[#FFF7ED] border border-[#FFEDD5] hover:shadow-md transition text-center">
              <div className="flex justify-center mb-4"><Shield className="text-[#F97316]" size={36}/></div>
              <h3 className="text-lg font-bold text-[#431407] mb-2">Privacy First</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Your data stays yours. We do not store, sell, or share your files.</p>
            </div>
            <div className="p-8 rounded-3xl bg-[#FFF7ED] border border-[#FFEDD5] hover:shadow-md transition text-center">
              <div className="flex justify-center mb-4"><Heart className="text-[#F97316]" size={36}/></div>
              <h3 className="text-lg font-bold text-[#431407] mb-2">100% Free</h3>
              <p className="text-slate-500 text-sm leading-relaxed">All tools are free to use - no hidden charges, no premium traps.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}