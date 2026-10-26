import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { tools } from '@/config/toolsRegistry'
import { ArrowRight, Sparkles, Zap, Shield, Heart, Smartphone, TrendingUp } from 'lucide-react'
import SocialLinks from '@/components/SocialLinks'

export default function Home() {
  return (
    <div className="bg-slate-50 min-h-screen overflow-x-hidden">
      <section className="relative bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 text-white pt-24 pb-40 rounded-b-[3rem] md:rounded-b-[5rem] overflow-hidden">
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
            Everything You Need, <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">In One Place</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg md:text-xl text-teal-50 max-w-2xl mb-10"
          >
            Download videos, edit PDFs, and grab the best deals - all from one fast, free, and beautifully simple platform.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <a href="#tools" className="px-8 py-3.5 bg-white text-emerald-600 font-bold rounded-full transition-all shadow-xl hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-2">
              Explore Tools <ArrowRight size={18} />
            </a>
          </motion.div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 -mt-20 relative z-20">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-3xl shadow-xl border border-slate-100 p-6 md:p-10 flex flex-col items-center justify-center gap-6 text-center"
        >
          <h3 className="text-2xl font-bold text-slate-900">Stay Connected with BanglaByteX</h3>
          <p className="text-slate-500 text-sm max-w-lg">Join our community for updates, tips, and new tool releases.</p>
          <SocialLinks />
        </motion.div>
      </section>

      <section id="tools" className="max-w-7xl mx-auto px-4 py-24">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Our Premium Tools</h2>
          <p className="text-slate-500 text-lg">Handcrafted tools to make your digital life easier.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tools.map((tool, i) => {
            const cardContent = (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group bg-white p-8 rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
              >
                <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-2xl flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform">{tool.icon}</div>
                <h3 className="text-xl font-bold text-slate-900 group-hover:text-emerald-600 transition-colors mb-2">{tool.name}</h3>
                <p className="text-slate-500 mt-2 text-sm leading-relaxed mb-6 flex-grow">{tool.description}</p>
                
                <div className="mt-auto pt-4">
                  <div className="inline-flex items-center justify-center gap-2 bg-emerald-500 group-hover:bg-emerald-600 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-colors shadow-md shadow-emerald-500/20 w-full">
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

      <section className="bg-white py-24 border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3">Why BanglaByteX?</h2>
            <p className="text-slate-500 text-lg">Built with care, powered by modern tech.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-md transition text-center">
              <div className="flex justify-center mb-4"><Zap className="text-yellow-500" size={36}/></div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Lightning Fast</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Optimized for speed - every tool loads instantly, no waiting.</p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-md transition text-center">
              <div className="flex justify-center mb-4"><Shield className="text-emerald-500" size={36}/></div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Privacy First</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Your data stays yours. We do not store, sell, or share your files.</p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-md transition text-center">
              <div className="flex justify-center mb-4"><Heart className="text-red-500" size={36}/></div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">100% Free</h3>
              <p className="text-slate-500 text-sm leading-relaxed">All tools are free to use - no hidden charges, no premium traps.</p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-md transition text-center">
              <div className="flex justify-center mb-4"><Smartphone className="text-blue-500" size={36}/></div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Works Everywhere</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Mobile, tablet, desktop - our tools work beautifully on all devices.</p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-md transition text-center">
              <div className="flex justify-center mb-4"><Sparkles className="text-purple-500" size={36}/></div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Clean Design</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Simple, modern, distraction-free interface so you get things done.</p>
            </div>
            <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-md transition text-center">
              <div className="flex justify-center mb-4"><TrendingUp className="text-emerald-600" size={36}/></div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Always Evolving</h3>
              <p className="text-slate-500 text-sm leading-relaxed">New tools added regularly. The platform grows with your needs.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}