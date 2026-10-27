import { Link, Outlet, useLocation } from 'react-router-dom'
import { Facebook, Youtube, Instagram, Send, Share2, ArrowUp, Menu, X, Moon, Sun } from 'lucide-react'
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export default function RootLayout() {
  const { pathname } = useLocation()
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)

  // ডার্ক মোড টগল লজিক
  useEffect(() => {
    // Check local storage for dark mode preference
    const savedMode = localStorage.getItem('darkMode') === 'true'
    setIsDarkMode(savedMode)
    if (savedMode) document.documentElement.classList.add('dark')
  }, [])

  const toggleDarkMode = () => {
    const newMode = !isDarkMode
    setIsDarkMode(newMode)
    localStorage.setItem('darkMode', String(newMode))
    if (newMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // স্ক্রল প্রোগ্রেস
  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      setScrollProgress((window.scrollY / totalHeight) * 100)
      setIsVisible(window.scrollY > 200)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // ভিজিটর ট্র্যাকিং
  useEffect(() => {
    if (pathname !== '/hellowsaipatit') {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: pathname })
      }).catch(() => {})
    }
  }, [pathname])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const handleShare = async () => {
    if (navigator.share) {
      try { await navigator.share({ title: 'PPM Creator Tools', url: window.location.href }) } catch (err) {}
    } else {
      navigator.clipboard.writeText(window.location.href)
      toast.success('Link copied!')
    }
  }

  const socialLinks = [
    { name: 'Facebook', url: 'https://facebook.com/ppmcreator', icon: Facebook },
    { name: 'YouTube', url: 'https://youtube.com/@ppmcreator', icon: Youtube },
    { name: 'Instagram', url: 'https://instagram.com/ppmcreator', icon: Instagram },
    { name: 'Telegram', url: 'https://t.me/ppmcreator', icon: Send },
  ]

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'PDF Tools', path: '/pdf-tools' },
    { name: 'Image Tools', path: '/image-tools' },
    { name: 'Converters', path: '/converters' },
    { name: 'Blog', path: '/blog' },
  ]

  return (
    <div className="min-h-screen bg-[#FFF7ED] dark:bg-slate-900 flex flex-col relative transition-colors duration-300">
      {/* Scroll to top button */}
      {isVisible && (
        <button onClick={scrollToTop} className="fixed bottom-6 right-6 z-50 w-10 h-10 bg-white dark:bg-slate-800 rounded-full shadow-lg flex items-center justify-center border border-[#FFEDD5] dark:border-slate-700">
          <svg className="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#FFEDD5" strokeWidth="6" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="#F97316" strokeWidth="6" strokeDasharray={`${2 * Math.PI * 42}`} strokeDashoffset={`${2 * Math.PI * 42 * (1 - scrollProgress / 100)}`} strokeLinecap="round" />
          </svg>
          <ArrowUp size={16} className="text-[#F97316] relative z-10" />
        </button>
      )}

      {/* Header */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-[#FFEDD5] dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <svg width="32" height="32" viewBox="0 0 64 64" fill="none"><rect width="64" height="64" rx="16" fill="#F97316"/><rect x="14" y="16" width="6" height="32" rx="2" fill="#FFF"/><polygon points="26,16 26,48 50,32" fill="#FFF"/></svg>
            <span className="font-bold text-xl"><span className="text-[#431407] dark:text-white">PPM</span><span className="text-[#F97316]"> Creator</span></span>
          </Link>
          
          <nav className="hidden md:flex gap-6 text-sm font-semibold text-slate-600 dark:text-slate-300">
            {navLinks.map(link => (
              <Link key={link.name} to={link.path} className={`hover:text-[#F97316] transition-colors ${pathname === link.path ? 'text-[#F97316]' : ''}`}>{link.name}</Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button onClick={toggleDarkMode} className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition">
              {isDarkMode ? <Sun size={20}/> : <Moon size={20}/>}
            </button>
            <button onClick={handleShare} className="hidden sm:flex items-center gap-2 px-4 py-2 bg-[#FFF7ED] dark:bg-slate-800 text-[#F97316] rounded-full font-medium hover:bg-[#FFEDD5] dark:hover:bg-slate-700 transition">
              <Share2 size={16}/> Share
            </button>
            <button className="md:hidden p-2 text-slate-600 dark:text-slate-300" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              {isMobileMenuOpen ? <X size={24}/> : <Menu size={24}/>}
            </button>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-slate-900 border-t dark:border-slate-800 px-4 py-2 space-y-2">
            {navLinks.map(link => (
              <Link key={link.name} to={link.path} onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-slate-600 dark:text-slate-300">{link.name}</Link>
            ))}
          </div>
        )}
      </header>

      <main className="flex-1"><Outlet /></main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-900 border-t border-[#FFEDD5] dark:border-slate-800 pt-16 pb-8 px-6 mt-auto transition-colors">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            <div className="md:col-span-2">
              <div className="text-2xl font-bold mb-4"><span className="text-[#431407] dark:text-white">PPM</span><span className="text-[#F97316]"> Creator Tools</span></div>
              <p className="text-slate-500 dark:text-slate-400 text-sm mb-6 max-w-xs">A free collection of online tools and short trending videos in Bengali. Fast, private and no signup needed.</p>
              <div className="flex gap-3">
                {socialLinks.map(social => (
                  <a key={social.name} href={social.url} target="_blank" rel="noreferrer" className="w-10 h-10 rounded-full bg-[#FFF7ED] dark:bg-slate-800 text-[#F97316] flex items-center justify-center hover:bg-[#F97316] hover:text-white transition">
                    <social.icon size={18}/>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-bold text-[#431407] dark:text-white mb-4">Popular Tools</h4>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li><Link to="/pdf-merge" className="hover:text-[#F97316]">Merge PDF</Link></li>
                <li><Link to="/image-compress" className="hover:text-[#F97316]">Compress Image</Link></li>
                <li><Link to="/age-calculator" className="hover:text-[#F97316]">Age Calculator</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-[#431407] dark:text-white mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm text-slate-500 dark:text-slate-400">
                <li><Link to="/about" className="hover:text-[#F97316]">About Us</Link></li>
                <li><Link to="/contact" className="hover:text-[#F97316]">Contact</Link></li>
                <li><Link to="/privacy-policy" className="hover:text-[#F97316]">Privacy Policy</Link></li>
                <li><Link to="/terms" className="hover:text-[#F97316]">Terms of Use</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-[#FFEDD5] dark:border-slate-800 pt-6 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400">
            <p>© 2026 PPM Creator. All rights reserved.</p>
            <p>Made with <span className="text-[#F97316]">❤</span> in India</p>
          </div>
        </div>
      </footer>
    </div>
  )
}