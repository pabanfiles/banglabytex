import { Link, Outlet, useLocation } from 'react-router-dom'
import { Facebook, Youtube, Instagram, Send, Twitter, Share2, ArrowUp, Menu, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export default function RootLayout() {
  const { pathname } = useLocation()
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      setScrollProgress((window.scrollY / totalHeight) * 100)
      setIsVisible(window.scrollY > 200)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'PPM Creator Tools', url: window.location.href }) } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied!')
    }
  }

  return (
    <div className="min-h-screen bg-[#FFF7ED] flex flex-col font-sans">
      {isVisible && (
        <button onClick={scrollToTop} className="fixed bottom-6 right-6 z-50 w-10 h-10 bg-white rounded-full shadow-lg flex items-center justify-center border border-[#FFEDD5]">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#FFEDD5" strokeWidth="6" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="#F97316" strokeWidth="6" strokeDasharray={`${2 * Math.PI * 42}`} strokeDashoffset={`${2 * Math.PI * 42 * (1 - scrollProgress / 100)}`} strokeLinecap="round" />
          </svg>
          <ArrowUp size={16} className="text-[#F97316] relative z-10" />
        </button>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-[#FFEDD5]">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="16" fill="#F97316"/><rect x="14" y="16" width="6" height="32" rx="2" fill="#FFF"/><polygon points="26,16 26,48 50,32" fill="#FFF"/></svg>
            <span className="font-bold text-xl"><span className="text-[#431407]">PPM</span><span className="text-[#F97316]"> Creator Tools</span></span>
          </Link>
          <nav className="hidden md:flex gap-6 text-sm font-semibold text-slate-600">
            <Link to="/" className="hover:text-[#F97316]">Home</Link>
            <Link to="/pdf-tools" className="hover:text-[#F97316]">PDF Tools</Link>
            <Link to="/image-tools" className="hover:text-[#F97316]">Image Tools</Link>
            <Link to="/converters" className="hover:text-[#F97316]">Converters</Link>
            <Link to="/blog" className="hover:text-[#F97316]">Blog</Link>
          </nav>
          <div className="flex items-center gap-2">
            <button onClick={handleShare} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#FFF7ED] text-[#F97316] rounded-full font-medium hover:bg-[#FFEDD5]"><Share2 size={16}/> Share</button>
            <button className="md:hidden" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>{isMobileMenuOpen ? <X/> : <Menu/>}</button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white border-t px-4 py-2 space-y-2">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2">Home</Link>
            <Link to="/pdf-tools" onClick={() => setIsMobileMenuOpen(false)} className="block py-2">PDF Tools</Link>
            <Link to="/blog" onClick={() => setIsMobileMenuOpen(false)} className="block py-2">Blog</Link>
          </div>
        )}
      </header>

      <main className="flex-1"><Outlet /></main>

      {/* Footer */}
      <footer className="bg-white border-t border-[#FFEDD5] pt-16 pb-8 px-6 mt-auto">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="text-2xl font-bold mb-4"><span className="text-[#431407]">PPM</span><span className="text-[#F97316]"> Creator Tools</span></div>
              <p className="text-slate-500 text-sm mb-6">A free collection of online tools and short trending videos in Bengali. Fast, private and no signup needed.</p>
              <div className="flex gap-3">
                <a href="https://facebook.com/ppmcreator" className="w-10 h-10 rounded-full bg-[#FFF7ED] text-[#F97316] flex items-center justify-center hover:bg-[#F97316] hover:text-white transition"><Facebook size={18}/></a>
                <a href="https://instagram.com/ppmcreator" className="w-10 h-10 rounded-full bg-[#FFF7ED] text-[#F97316] flex items-center justify-center hover:bg-[#F97316] hover:text-white transition"><Instagram size={18}/></a>
                <a href="https://youtube.com/@ppmcreator" className="w-10 h-10 rounded-full bg-[#FFF7ED] text-[#F97316] flex items-center justify-center hover:bg-[#F97316] hover:text-white transition"><Youtube size={18}/></a>
                <a href="https://t.me/ppmcreator" className="w-10 h-10 rounded-full bg-[#FFF7ED] text-[#F97316] flex items-center justify-center hover:bg-[#F97316] hover:text-white transition"><Send size={18}/></a>
              </div>
            </div>
            <div>
              <h4 className="font-bold text-[#431407] mb-4">Popular Tools</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link to="/pdf-tools" className="hover:text-[#F97316]">Merge PDF</Link></li>
                <li><Link to="/image-tools" className="hover:text-[#F97316]">Image Compressor</Link></li>
                <li><Link to="/age-calc" className="hover:text-[#F97316]">Age Calculator</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#431407] mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-slate-500">
                <li><Link to="/about" className="hover:text-[#F97316]">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-[#F97316]">Contact</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-[#F97316]">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-[#F97316]">Terms of Use</Link></li>
                <li><Link to="/disclaimer" className="hover:text-[#F97316]">Disclaimer</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#FFEDD5] pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
            <p>© 2026 PPM Creator. All rights reserved.</p>
            <p>Made with <span className="text-[#F97316]">❤</span> in India</p>
          </div>
        </div>
      </footer>
    </div>
  )
}