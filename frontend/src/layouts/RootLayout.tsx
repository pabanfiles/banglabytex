import { Link, Outlet, useLocation } from 'react-router-dom'
import { Home as HomeIcon } from 'lucide-react'
import SocialLinks from '../components/SocialLinks'

export default function RootLayout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
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
          </nav>
        </div>
      </header>

      <main className="flex-1"><Outlet /></main>

      <footer className="mt-16 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-10">
          <div className="flex flex-col items-center gap-6">
            <h3 className="text-xl font-bold text-slate-900">Stay Connected</h3>
            <SocialLinks />
            
            <div className="flex justify-center gap-6 text-sm text-slate-600 mt-4">
              <Link to="/about" className="hover:text-emerald-600">About</Link>
              <Link to="/contact" className="hover:text-emerald-600">Contact</Link>
              <Link to="/privacy-policy" className="hover:text-emerald-600">Privacy</Link>
              <Link to="/terms" className="hover:text-emerald-600">Terms</Link>
            </div>
            
            <p className="text-sm text-slate-500 mt-4">
              © {new Date().getFullYear()} BanglaByteX. All rights reserved. Made with ❤️ in India
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}