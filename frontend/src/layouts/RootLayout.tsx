import { Link, Outlet, useLocation } from 'react-router-dom'
import { Home as HomeIcon, Facebook, Youtube, Instagram, Send, Share2, ArrowUp } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export default function RootLayout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  // স্ক্রল পার্সেন্টেজ ট্র্যাকিং
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      const progress = (window.scrollY / totalHeight) * 100
      setScrollProgress(progress)
      setIsVisible(window.scrollY > 200) // ২০০ পিক্সেল স্ক্রল করলে বাটন দেখাবে
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // শেয়ার ফাংশন
  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'BanglaByteX - All-in-One Tools',
          text: 'Check out BanglaByteX for free video downloading, PDF editing, and more!',
          url: window.location.href,
        })
      } catch (err) {
        console.log('Error sharing:', err)
      }
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied to clipboard!')
    }
  }

  const socialLinks = [
    { name: 'Facebook', url: 'https://www.facebook.com/banglabytex', icon: Facebook },
    { name: 'YouTube', url: 'https://www.youtube.com/@banglabytex', icon: Youtube },
    { name: 'Instagram', url: 'https://www.instagram.com/banglabytex', icon: Instagram },
    { name: 'Telegram', url: 'https://t.me/banglabytex', icon: Send },
  ]

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative">
      
      {/* Circular Scroll Progress (Bottom Right) */}
      {isVisible && (
        <button 
          onClick={scrollToTop}
          className="fixed bottom-6 right-6 z-[100] w-10 h-10 bg-white rounded-full shadow-2xl flex items-center justify-center cursor-pointer hover:-translate-y-1 transition-transform border border-slate-100"
          title="Scroll to top"
        >
          {/* SVG Circular Progress */}
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            {/* Background Circle */}
            <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="6" />
            {/* Progress Circle */}
            <circle 
              cx="50" cy="50" r="42" 
              fill="none" 
              stroke="#10b981" 
              strokeWidth="6" 
              strokeDasharray={`${2 * Math.PI * 42}`} 
              strokeDashoffset={`${2 * Math.PI * 42 * (1 - scrollProgress / 100)}`} 
              strokeLinecap="round"
              className="transition-all duration-150 ease-out"
            />
          </svg>
          <ArrowUp size={16} className="text-emerald-500 relative z-10" />
        </button>
      )}

      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-emerald-600">
            <span className="text-2xl">⚡</span> BanglaByteX
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {!isHome && (
              <Link to="/" className="flex items-center gap-1 text-slate-600 hover:text-emerald-600">
                <HomeIcon size={16} /> Home
              </Link>
            )}
            <button onClick={handleShare} className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-600 rounded-full font-medium hover:bg-emerald-100 transition">
              <Share2 size={16} /> Share
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1"><Outlet /></main>

      <footer className="mt-16 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            
            <div className="text-center md:text-left">
              <Link to="/" className="flex items-center justify-center md:justify-start gap-2 font-bold text-2xl text-emerald-600 mb-2">
                <span className="text-3xl">⚡</span> BanglaByteX
              </Link>
              <p className="text-sm text-slate-500 max-w-xs">Your all-in-one digital tools hub. Fast, free, and forever growing.</p>
            </div>

            <div className="flex gap-6 text-sm font-medium text-slate-600">
              <Link to="/about" className="hover:text-emerald-600 transition">About</Link>
              <Link to="/contact" className="hover:text-emerald-600 transition">Contact</Link>
              <Link to="/privacy-policy" className="hover:text-emerald-600 transition">Privacy</Link>
              <Link to="/terms" className="hover:text-emerald-600 transition">Terms</Link>
            </div>

            <div className="flex gap-3">
              {socialLinks.map((social) => {
                const Icon = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm hover:shadow-md hover:-translate-y-1"
                  >
                    <Icon size={18} />
                  </a>
                )
              })}
            </div>
          </div>

          <div className="border-t border-slate-100 mt-10 pt-6 text-center text-sm text-slate-400">
            © {new Date().getFullYear()} BanglaByteX. All rights reserved. Made with ❤️ in India
          </div>
        </div>
      </footer>
    </div>
  )
}