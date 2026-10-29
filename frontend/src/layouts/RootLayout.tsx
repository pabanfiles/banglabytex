import { Outlet, useLocation, Link } from 'react-router-dom'
import { Facebook, Youtube, Instagram, Send, ArrowUp, X } from 'lucide-react'
import { useState, useEffect } from 'react'
import Header from '../components/Header'

export default function RootLayout() {
  const { pathname } = useLocation()
  const [scrollProgress, setScrollProgress] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight
      setScrollProgress(totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0)
      setIsVisible(window.scrollY > 200)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (pathname !== '/hellowsaipatit') {
      fetch('/api/analytics', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ page: pathname })
      }).catch(() => {})
    }
  }, [pathname])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  const socialLinks = [
    { name: 'Facebook', url: 'https://facebook.com/ppmcreator', icon: Facebook },
    { name: 'YouTube', url: 'https://youtube.com/@ppmcreator', icon: Youtube },
    { name: 'Instagram', url: 'https://instagram.com/ppmcreator', icon: Instagram },
    { name: 'Telegram', url: 'https://t.me/ppmcreator', icon: Send },
  ]

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF9', display: 'flex', flexDirection: 'column' }}>
      {isVisible && (
        <button onClick={scrollToTop} aria-label="Scroll to top" style={{ position: 'fixed', bottom: 24, right: 24, zIndex: 50, width: 40, height: 40, background: '#fff', borderRadius: '50%', boxShadow: '0 4px 12px rgba(0,0,0,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #e7e5e4', cursor: 'pointer' }}>
          <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 100 100">
            <circle cx="50" cy="50" r="42" fill="none" stroke="#FFEDD5" strokeWidth="6" />
            <circle cx="50" cy="50" r="42" fill="none" stroke="#F97316" strokeWidth="6" strokeDasharray={`${2 * Math.PI * 42}`} strokeDashoffset={`${2 * Math.PI * 42 * (1 - scrollProgress / 100)}`} strokeLinecap="round" />
          </svg>
          <ArrowUp size={16} style={{ color: '#F97316', position: 'relative', zIndex: 10 }} />
        </button>
      )}

      <Header />

      <main style={{ flex: 1 }}><Outlet /></main>

      <footer style={{ background: '#fff', borderTop: '1px solid #e7e5e4', paddingTop: 60, paddingBottom: 32, paddingLeft: 24, paddingRight: 24, marginTop: 'auto' }}>
        <div style={{ maxWidth: 1180, margin: '0 auto' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 32, marginBottom: 48 }}>
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 16, color: '#1c1917' }}>PPM Creator</div>
              <p style={{ color: '#6b7280', fontSize: 13, marginBottom: 20, maxWidth: 320 }}>Free browser-based tools for images, PDFs and everyday tasks. No signup, files stay on your device.</p>
              <div style={{ display: 'flex', gap: 10 }}>
                {socialLinks.map((social) => (
                  <a key={social.name} href={social.url} target="_blank" rel="noreferrer" aria-label={social.name} style={{ width: 38, height: 38, borderRadius: '50%', background: '#FFF7ED', color: '#F97316', display: 'flex', alignItems: 'center', justifyContent: 'center', textDecoration: 'none' }}>
                    <social.icon size={16} />
                  </a>
                ))}
              </div>
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#1c1917' }}>Popular tools</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13, color: '#6b7280' }}>
                <li style={{ marginBottom: 8 }}><Link to="/image-compress" style={{ color: '#6b7280', textDecoration: 'none' }}>Image Compressor</Link></li>
                <li style={{ marginBottom: 8 }}><Link to="/pdf-merge" style={{ color: '#6b7280', textDecoration: 'none' }}>Merge PDF</Link></li>
                <li style={{ marginBottom: 8 }}><Link to="/pdf-compress" style={{ color: '#6b7280', textDecoration: 'none' }}>Compress PDF</Link></li>
                <li><Link to="/age-calculator" style={{ color: '#6b7280', textDecoration: 'none' }}>Age Calculator</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#1c1917' }}>Categories</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13 }}>
                <li style={{ marginBottom: 8 }}><Link to="/image-tools" style={{ color: '#6b7280', textDecoration: 'none' }}>Image Tools</Link></li>
                <li style={{ marginBottom: 8 }}><Link to="/pdf-tools" style={{ color: '#6b7280', textDecoration: 'none' }}>PDF Tools</Link></li>
                <li style={{ marginBottom: 8 }}><Link to="/calculators" style={{ color: '#6b7280', textDecoration: 'none' }}>Calculators</Link></li>
                <li><Link to="/text-tools" style={{ color: '#6b7280', textDecoration: 'none' }}>Text Tools</Link></li>
              </ul>
            </div>
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, color: '#1c1917' }}>Company</h4>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, fontSize: 13 }}>
                <li style={{ marginBottom: 8 }}><Link to="/about" style={{ color: '#6b7280', textDecoration: 'none' }}>About</Link></li>
                <li style={{ marginBottom: 8 }}><Link to="/contact" style={{ color: '#6b7280', textDecoration: 'none' }}>Contact</Link></li>
                <li style={{ marginBottom: 8 }}><Link to="/privacy-policy" style={{ color: '#6b7280', textDecoration: 'none' }}>Privacy</Link></li>
                <li style={{ marginBottom: 8 }}><Link to="/terms" style={{ color: '#6b7280', textDecoration: 'none' }}>Terms</Link></li>
                <li><Link to="/sitemap" style={{ color: '#6b7280', textDecoration: 'none' }}>Sitemap</Link></li>
              </ul>
            </div>
          </div>
          <div style={{ borderTop: '1px solid #e7e5e4', paddingTop: 20, display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', fontSize: 12, color: '#9ca3af' }}>
            <p style={{ margin: 0 }}>2026 PPM Creator. All rights reserved.</p>
            <p style={{ margin: 0 }}>Made in India</p>
          </div>
        </div>
      </footer>
    </div>
  )
}