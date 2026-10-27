import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Zap, Shield, Heart, Search, Facebook, Youtube, Instagram, Send } from 'lucide-react'
import { useState, useEffect } from 'react'

const ALL_TOOLS = [
  { slug: 'pdf-editor', name: 'PDF Editor', description: 'Edit PDF text, images, and links.', icon: '📝', link: '/pdf-editor.html' },
  { slug: 'pdf-merge', name: 'Merge PDF', description: 'Combine multiple PDFs into one.', icon: '🔗', link: '/pdf-merge' },
  { slug: 'pdf-compress', name: 'Compress PDF', description: 'Reduce PDF file size instantly.', icon: '📉', link: '/pdf-tools.html?tool=comp' },
  { slug: 'pdf-split', name: 'Split PDF', description: 'Separate one PDF into multiple files.', icon: '✂️', link: '/pdf-tools.html?tool=split' },
  { slug: 'image-compress', name: 'Image Compressor', description: 'Reduce JPG, PNG, WebP file size.', icon: '🖼️', link: '/pdf-tools.html?tool=comp' },
  { slug: 'image-convert', name: 'Image Converter', description: 'Convert PNG to JPG, WebP, and more.', icon: '🔄', link: '/pdf-tools.html?tool=img2pdf' },
  { slug: 'age-calculator', name: 'Age Calculator', description: 'Calculate your exact age easily.', icon: '🎂', link: '/age-calculator' },
  { slug: 'percentage-calculator', name: 'Percentage Calculator', description: 'Find percentages instantly.', icon: '🧮', link: '/percentage-calc' },
  { slug: 'qr-generator', name: 'QR Code Generator', description: 'Create custom QR codes for free.', icon: '📱', link: '/qr-code-gen' },
  { slug: 'video-downloader', name: 'Video Downloader', description: 'Download social media videos.', icon: '🎬', link: '/video-downloader' },
]

export default function Home() {
  const [search, setSearch] = useState('')
  const [recentPosts, setRecentPosts] = useState<any[]>([])

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) setRecentPosts(data.slice(0, 5))
      })
      .catch(() => {})
  }, [])

  const filteredTools = ALL_TOOLS.filter(t => 
    t.name.toLowerCase().includes(search.toLowerCase()) || 
    t.description.toLowerCase().includes(search.toLowerCase())
  )

  const socialLinks = [
    { url: 'https://facebook.com/ppmcreator', icon: Facebook },
    { url: 'https://youtube.com/@ppmcreator', icon: Youtube },
    { url: 'https://instagram.com/ppmcreator', icon: Instagram },
    { url: 'https://t.me/ppmcreator', icon: Send },
  ]

  return (
    <div className="bg-[#FFF7ED] min-h-screen overflow-x-hidden">
      {/* HERO SECTION */}
      <section className="relative bg-gradient-to-br from-[#F97316] via-[#EA580C] to-[#C2410C] text-white pt-24 pb-40 rounded-b-[3rem] md:rounded-b-[5rem]">
        <div className="max-w-7xl mx-auto px-4 relative z-10 flex flex-col items-center text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 backdrop-blur-md text-white text-sm font-medium mb-6 border border-white/30">
            <Sparkles size={16} /> All-in-One Digital Hub
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight mb-6 max-w-3xl leading-tight drop-shadow-sm">
            Free Online Tools <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-yellow-400">for Everyone</span>
          </h1>
          <p className="text-lg md:text-xl text-orange-50 max-w-2xl mb-10">
            PDF, image, document and file tools that work fast in your browser. No signup. No limits.
          </p>
          <a href="#tools" className="px-8 py-3.5 bg-white text-[#F97316] font-bold rounded-full transition-all shadow-xl hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center gap-2">
            Explore Tools <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* SEARCH & SOCIAL */}
      <section className="max-w-4xl mx-auto px-4 -mt-20 relative z-20 space-y-6">
        <div className="bg-white rounded-3xl shadow-2xl p-2 border border-slate-100">
          <div className="relative">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={22} />
            <input type="text" placeholder="Search for tools..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-14 pr-6 py-4 rounded-2xl text-slate-900 text-lg outline-none focus:bg-slate-50 transition-colors" />
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-lg border border-slate-100 p-6 md:p-8 flex flex-col items-center justify-center gap-4 text-center">
          <h3 className="text-xl font-bold text-slate-900">Stay Connected</h3>
          <div className="flex gap-3">
            {socialLinks.map((social, i) => (
              <a key={i} href={social.url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#FFF7ED] text-[#F97316] flex items-center justify-center hover:bg-[#F97316] hover:text-white transition">
                <social.icon size={18}/>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* TOOLS GRID */}
      <section id="tools" className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#431407] mb-3">PPM Creator Tools</h2>
          <p className="text-slate-500 text-lg">Handcrafted tools to make your digital life easier.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredTools.map((tool) => (
            <a key={tool.slug} href={tool.link} className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#F97316] transition-all duration-300 flex flex-col h-full">
              <div className="w-14 h-14 bg-[#FFF7ED] text-[#F97316] rounded-xl flex items-center justify-center text-3xl mb-4 group-hover:scale-110 transition-transform">{tool.icon}</div>
              <h3 className="text-lg font-bold text-[#431407] group-hover:text-[#F97316] transition-colors mb-2">{tool.name}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">{tool.description}</p>
              <div className="mt-auto">
                <div className="inline-flex items-center justify-center gap-2 bg-[#F97316] group-hover:bg-[#EA580C] text-white px-5 py-2 rounded-full font-semibold text-sm transition-colors shadow-md w-full">
                  Open Tool <ArrowRight size={16} />
                </div>
              </div>
            </a>
          ))}
          {filteredTools.length === 0 && <p className="col-span-full text-center text-slate-500 py-10">No tools found for "{search}"</p>}
        </div>
      </section>

      {/* LATEST BLOG POSTS */}
      {recentPosts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16 border-t border-slate-200">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#431407] mb-2">Latest Articles</h2>
            <p className="text-slate-500">Read our latest tips and guides.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentPosts.map((post) => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition">
                <h3 className="text-xl font-bold text-[#431407] mb-2">{post.title}</h3>
                <p className="text-slate-500 text-sm line-clamp-3">{post.content.substring(0, 100)}...</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FEATURES */}
      <section className="bg-white py-24 border-t border-slate-100 mt-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#431407] mb-3">Why PPM Creator?</h2>
            <p className="text-slate-500 text-lg">Built with care, powered by modern tech.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-[#FFF7ED] border border-[#FFEDD5] hover:shadow-md transition text-center">
              <div className="flex justify-center mb-4"><Zap className="text-[#F97316]" size={36}/></div>
              <h3 className="text-lg font-bold text-[#431407] mb-2">Lightning Fast</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Optimized for speed - every tool loads instantly.</p>
            </div>
            <div className="p-8 rounded-3xl bg-[#FFF7ED] border border-[#FFEDD5] hover:shadow-md transition text-center">
              <div className="flex justify-center mb-4"><Shield className="text-[#F97316]" size={36}/></div>
              <h3 className="text-lg font-bold text-[#431407] mb-2">Privacy First</h3>
              <p className="text-slate-500 text-sm leading-relaxed">Your data stays yours. We do not store your files.</p>
            </div>
            <div className="p-8 rounded-3xl bg-[#FFF7ED] border border-[#FFEDD5] hover:shadow-md transition text-center">
              <div className="flex justify-center mb-4"><Heart className="text-[#F97316]" size={36}/></div>
              <h3 className="text-lg font-bold text-[#431407] mb-2">100% Free</h3>
              <p className="text-slate-500 text-sm leading-relaxed">All tools are free to use - no hidden charges.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}