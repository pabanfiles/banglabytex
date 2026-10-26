import { Link, Outlet, useLocation } from 'react-router-dom'
import { Home as HomeIcon } from 'lucide-react'
import GlobalDisclaimer from '../components/GlobalDisclaimer'

export default function RootLayout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl text-brand-600">
            <span className="text-2xl">⚡</span> BanglaByteX
          </Link>
          <nav className="flex items-center gap-4 text-sm">
            {!isHome && (
              <Link to="/" className="flex items-center gap-1 text-slate-600 hover:text-brand-600">
                <HomeIcon size={16} /> Home
              </Link>
            )}
            <Link to="/video-downloader" className="px-3 py-1.5 bg-brand-600 text-white rounded-lg hover:bg-brand-700">
              Video Downloader
            </Link>
          </nav>
        </div>
      </header>

      <main className="flex-1"><Outlet /></main>

      <footer className="mt-16 border-t border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-sm text-slate-500">
          <div className="mb-4 flex justify-center gap-6">
            <Link to="/about" className="hover:text-brand-600">About</Link>
            <Link to="/contact" className="hover:text-brand-600">Contact</Link>
            <Link to="/privacy-policy" className="hover:text-brand-600">Privacy</Link>
            <Link to="/terms" className="hover:text-brand-600">Terms</Link>
          </div>
          © {new Date().getFullYear()} BanglaByteX. All rights reserved. Made with ❤️ in India
        </div>
      </footer>

      {/* Global Disclaimer (সব পেজের নিচে দেখাবে) */}
      <GlobalDisclaimer />
    </div>
  )
}