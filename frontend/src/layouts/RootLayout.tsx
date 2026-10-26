import { Link, Outlet, useLocation } from 'react-router-dom'
import { Menu, X } from 'lucide-react'
import { useState } from 'react'

export default function RootLayout() {
  const [isOpen, setIsOpen] = useState(false)
  const { pathname } = useLocation()

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-extrabold text-2xl text-brand-600 tracking-tight">
            ⚡ Bangla<span className="text-slate-800">ByteX</span>
          </Link>
          
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600">
            <Link to="/" className={pathname === '/' ? 'text-brand-600' : 'hover:text-brand-600'}>Home</Link>
            <Link to="/about" className={pathname === '/about' ? 'text-brand-600' : 'hover:text-brand-600'}>About</Link>
            <Link to="/contact" className={pathname === '/contact' ? 'text-brand-600' : 'hover:text-brand-600'}>Contact</Link>
            <Link to="/admin" className="px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition">Admin Panel</Link>
          </nav>

          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isOpen && (
          <div className="md:hidden bg-white border-t border-slate-100 p-4 flex flex-col gap-3 text-sm font-medium">
            <Link to="/" onClick={() => setIsOpen(false)}>Home</Link>
            <Link to="/about" onClick={() => setIsOpen(false)}>About</Link>
            <Link to="/contact" onClick={() => setIsOpen(false)}>Contact</Link>
            <Link to="/admin" onClick={() => setIsOpen(false)} className="text-brand-600">Admin Panel</Link>
          </div>
        )}
      </header>

      <main className="flex-1"><Outlet /></main>

      <footer className="bg-white border-t border-slate-200 py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="text-2xl font-extrabold text-brand-600 mb-4">⚡ BanglaByteX</div>
            <p className="text-slate-500 max-w-sm mb-4">Your all-in-one digital tools hub. Fast, free, and forever growing.</p>
            <p className="text-slate-400 text-sm">© 2026 BanglaByteX. All rights reserved.</p>
          </div>
          <div>
            <h4 className="font-bold mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link to="/about" className="hover:text-brand-600">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-brand-600">Contact</Link></li>
              <li><Link to="/privacy-policy" className="hover:text-brand-600">Privacy Policy</Link></li>
              <li><Link to="/terms" className="hover:text-brand-600">Terms of Use</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-bold mb-4">Connect</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-brand-600">Facebook</a></li>
              <li><a href="#" className="hover:text-brand-600">YouTube</a></li>
              <li><a href="#" className="hover:text-brand-600">Instagram</a></li>
              <li><a href="#" className="hover:text-brand-600">Telegram</a></li>
            </ul>
          </div>
        </div>
      </footer>
    </div>
  )
}