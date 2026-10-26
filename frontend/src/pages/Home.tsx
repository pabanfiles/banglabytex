import { Link } from 'react-router-dom'
import { tools } from '@/config/toolsRegistry'
import { ArrowRight, Sparkles, Zap, Shield, Heart, Search } from 'lucide-react'
import { useState } from 'react'

export default function Home() {
  const [search, setSearch] = useState('')

  const filteredTools = tools.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="bg-slate-50 min-h-screen">
      <section className="bg-gradient-to-br from-emerald-500 to-cyan-500 text-white pt-20 pb-32 rounded-b-[3rem] text-center px-4">
        <h1 className="text-4xl md:text-6xl font-extrabold mb-6">All-in-One Tools</h1>
        {/* সার্চ বার */}
        <div className="max-w-xl mx-auto relative mt-8">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
          <input 
            type="text" 
            placeholder="Search tools (e.g. PDF, Video, Calculator...)" 
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-14 pr-6 py-4 rounded-full text-slate-900 text-lg outline-none shadow-2xl"
          />
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTools.map((tool) => (
            <Link key={tool.slug} to={tool.externalLink || '/' + tool.slug} className="group bg-white p-6 rounded-2xl shadow-sm border hover:border-emerald-500 hover:-translate-y-1 transition-all flex flex-col h-full">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-3xl mb-4">{tool.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{tool.name}</h3>
              <p className="text-slate-500 text-sm flex-grow">{tool.description}</p>
              <div className="mt-4 inline-flex items-center gap-2 text-emerald-500 font-semibold">Open Tool <ArrowRight size={16}/></div>
            </Link>
          ))}
          {filteredTools.length === 0 && <p className="col-span-3 text-center text-slate-500 py-10">No tools found for "{search}"</p>}
        </div>
      </section>
    </div>
  )
}