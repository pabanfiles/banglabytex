import { Link } from 'react-router-dom'
import { tools } from '@/config/toolsRegistry'
import { ArrowRight, Facebook, Youtube, Instagram, Send, Zap, Shield, Heart, Smartphone, Sparkles, TrendingUp } from 'lucide-react'

export default function Home() {
  return (
    <div className="bg-slate-50">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 text-white">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-7xl mx-auto px-4 py-24 md:py-32 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 text-sm font-medium mb-6 border border-purple-500/30">
            <Sparkles size={16} /> All-in-One Digital Hub
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-3xl leading-tight">
            Everything You Need, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">In One Place</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-300 max-w-2xl mb-10">
            Download videos, edit PDFs, and grab the best deals - all from one fast, free, and beautifully simple platform.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="#tools" className="px-8 py-3.5 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-xl transition shadow-lg shadow-purple-500/30 flex items-center justify-center gap-2">
              Explore Tools <ArrowRight size={18} />
            </a>
            <Link to="/about" className="px-8 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white font-bold rounded-xl transition flex items-center justify-center">
              Learn More
            </Link>
          </div>
          
          {/* Floating Icons Animation */}
          <div className="mt-16 relative w-full max-w-lg h-48 opacity-80">
             <div className="absolute top-0 left-1/2 -translate-x-1/2 text-6xl">🛰️</div>
             <div className="absolute top-16 left-10 text-4xl animate-bounce">🎬</div>
             <div className="absolute top-20 right-10 text-4xl animate-pulse">📄</div>
             <div className="absolute top-32 left-1/2 -translate-x-1/2 text-4xl animate-bounce" style={{animationDelay: '0.5s'}}>🛒</div>
          </div>
        </div>
      </section>

      {/* SOCIAL SECTION */}
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

      {/* TOOLS GRID */}
      <section id="tools" className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900">Our Premium Tools</h2>
          <p className="mt-3 text-slate-500">Handcrafted tools to make your digital life easier.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map(tool => {
            const cardContent = (
              <>
                <div className="w-14 h-14 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">{tool.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-indigo-600 transition">{tool.name}</h3>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed mb-6">{tool.description}</p>
                <div className="flex items-center gap-2 text-indigo-600 font-semibold text-sm">
                  Launch Tool <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                </div>
              </>
            );

            return tool.externalLink ? (
              <a key={tool.slug} href={tool.externalLink} target="_blank" rel="noopener noreferrer" className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-500 transition-all duration-300">
                {cardContent}
              </a>
            ) : (
              <Link key={tool.slug} to={/} className="group bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-indigo-500 transition-all duration-300">
                {cardContent}
              </Link>
            );
          })}
        </div>
      </section>

      {/* FEATURES */}
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
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition">
              <div className="mb-4"><Smartphone className="text-blue-500" size={28}/></div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Works Everywhere</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Mobile, tablet, desktop - our tools work beautifully on all devices.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition">
              <div className="mb-4"><Sparkles className="text-purple-500" size={28}/></div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Clean Design</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Simple, modern, distraction-free interface so you get things done.</p>
            </div>
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:shadow-md transition">
              <div className="mb-4"><TrendingUp className="text-indigo-600" size={28}/></div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Always Evolving</h3>
              <p className="text-slate-500 text-sm leading-relaxed">New tools added regularly. The platform grows with your needs.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}