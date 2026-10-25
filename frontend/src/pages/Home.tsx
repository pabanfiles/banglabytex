import { Link } from 'react-router-dom'
import { tools } from '@/config/toolsRegistry'
import { ArrowRight, Facebook, Youtube, Instagram, Send, Zap, Shield, Heart, Sparkles } from 'lucide-react'

export default function Home() {
  return (
    <div className="bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-100">
        <div className="max-w-7xl mx-auto px-4 py-24 md:py-32 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white text-teal-700 text-sm font-medium mb-6 border border-teal-200 shadow-sm">
            <Sparkles size={16} /> All-in-One Digital Hub
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-3xl leading-tight text-slate-800">
            Everything You Need, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-emerald-600">In One Place</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mb-10">
            Download videos, edit PDFs, and grab the best deals - all from one fast, free, and beautifully simple platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#tools" className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-2">
              Explore Tools <ArrowRight size={18} />
            </a>
            <Link to="/about" className="px-8 py-3.5 bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 font-bold rounded-xl transition shadow-sm flex items-center justify-center">
              Learn More
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 -mt-8 relative z-20">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900">Stay Connected with BanglaByteX</h3>
            <p className="text-slate-500 text-sm mt-1">Join our community for updates, tips, and new tool releases.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a href="#" className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium text-sm"><Facebook size={16}/> Facebook</a>
            <a href="#" className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium text-sm"><Youtube size={16}/> YouTube</a>
            <a href="#" className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-pink-500 to-orange-500 text-white rounded-lg hover:opacity-90 transition font-medium text-sm"><Instagram size={16}/> Instagram</a>
            <a href="#" className="flex items-center gap-2 px-4 py-2 bg-sky-500 text-white rounded-lg hover:bg-sky-600 transition font-medium text-sm"><Send size={16}/> Telegram</a>
          </div>
        </div>
      </section>

      <section id="tools" className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Our Premium Tools</h2>
          <p className="mt-3 text-slate-500">Handcrafted tools to make your digital life easier.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map(tool => {
            const cardContent = (
              <>
                <div className="w-14 h-14 bg-teal-50 text-teal-600 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">{tool.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-teal-600 transition">{tool.name}</h3>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed mb-6">{tool.description}</p>
                <div className="flex items-center gap-2 text-teal-600 font-semibold text-sm">
                  Launch Tool <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </>
            );

            return tool.externalLink ? (
              <a key={tool.slug} href={tool.externalLink === '/pdf-editor/index.html' ? '/pdf-editor.html' : tool.externalLink} target="_blank" rel="noopener noreferrer" className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-teal-500 transition-all duration-300">
                {cardContent}
              </a>
            ) : (
              <a key={tool.slug} href={'/' + tool.slug} className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-teal-500 transition-all duration-300">
                {cardContent}
              </a>
            );
          })}
        </div>
      </section>

      <section className="bg-white py-20 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Why BanglaByteX?</h2>
            <p className="mt-3 text-slate-500">Built with care, powered by modern tech.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition">
              <div className="mb-4"><Zap className="text-yellow-500" size={28}/></div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Lightning Fast</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Optimized for speed - every tool loads instantly, no waiting.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition">
              <div className="mb-4"><Shield className="text-green-500" size={28}/></div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Privacy First</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Your data stays yours. We do not store, sell, or share your files.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition">
              <div className="mb-4"><Heart className="text-red-500" size={28}/></div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">100% Free</h3>
              <p className="text-slate-500 text-sm leading-relaxed">All tools are free to use - no hidden charges, no premium traps.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
