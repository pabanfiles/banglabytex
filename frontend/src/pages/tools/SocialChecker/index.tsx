import { useState } from 'react'
import { Search, Globe, CheckCircle2, XCircle, Loader2, ExternalLink, User } from 'lucide-react'

const SOCIALS = [
  { name: 'Facebook', url: 'https://facebook.com/', icon: '📘' },
  { name: 'Instagram', url: 'https://instagram.com/', icon: '📸' },
  { name: 'YouTube', url: 'https://youtube.com/@', icon: '▶️' },
  { name: 'TikTok', url: 'https://tiktok.com/@', icon: '🎵' },
  { name: 'Twitter / X', url: 'https://x.com/', icon: '🐦' },
  { name: 'Threads', url: 'https://threads.net/@', icon: '🧵' },
  { name: 'Telegram', url: 'https://t.me/', icon: '✈️' },
  { name: 'Pinterest', url: 'https://pinterest.com/', icon: '📌' },
  { name: 'Reddit', url: 'https://reddit.com/user/', icon: '🤖' },
  { name: 'Snapchat', url: 'https://snapchat.com/add/', icon: '👻' },
  { name: 'Vimeo', url: 'https://vimeo.com/', icon: '🎥' },
  { name: 'Dailymotion', url: 'https://dailymotion.com/', icon: '📺' },
  { name: 'Spotify', url: 'https://open.spotify.com/user/', icon: '🎧' },
  { name: 'GitHub', url: 'https://github.com/', icon: '💻' },
  { name: 'LinkedIn', url: 'https://linkedin.com/in/', icon: '💼' },
]

const DOMAINS = ['.com', '.net', '.org', '.io', '.xyz', '.dev', '.app', '.co']

export default function SocialChecker() {
  const [handle, setHandle] = useState('')
  const [checking, setChecking] = useState(false)
  const [domainResults, setDomainResults] = useState<Record<string, string>>({})

  const checkDomains = async () => {
    if (!handle.trim()) return
    setChecking(true)
    const results: Record<string, string> = {}
    const cleanHandle = handle.trim().toLowerCase().replace(/[^a-z0-9]/g, '')

    for (const tld of DOMAINS) {
      const domain = `${cleanHandle}${tld}`
      try {
        const res = await fetch(`https://rdap.org/domain/${domain}`)
        if (res.status === 404) {
          results[domain] = 'available'
        } else if (res.ok) {
          results[domain] = 'taken'
        } else {
          results[domain] = 'unknown'
        }
      } catch (err) {
        results[domain] = 'error'
      }
    }
    setDomainResults(results)
    setChecking(false)
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-3">🔍 Social & Domain Checker</h1>
        <p className="text-slate-500">Check if your brand name is available everywhere.</p>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-lg border border-slate-100 mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="text"
              value={handle}
              onChange={(e) => setHandle(e.target.value)}
              placeholder="Enter username (e.g. banglabytex)"
              className="w-full pl-12 pr-4 py-4 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none text-lg"
              onKeyDown={(e) => e.key === 'Enter' && checkDomains()}
            />
          </div>
          <button
            onClick={checkDomains}
            disabled={checking || !handle.trim()}
            className="px-8 py-4 bg-emerald-500 text-white font-bold rounded-xl hover:bg-emerald-600 disabled:opacity-50 transition flex items-center justify-center gap-2"
          >
            {checking ? <Loader2 className="animate-spin" size={20} /> : <Globe size={20} />}
            Check Domains
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Social Media Section */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <User className="text-emerald-500" size={24} />
            <h2 className="text-2xl font-bold text-slate-900">Social Media Handles</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SOCIALS.map((social) => (
              <div key={social.name} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 hover:border-emerald-300 transition-colors">
                <span className="font-medium text-slate-700 flex items-center gap-2">
                  <span>{social.icon}</span> {social.name}
                </span>
                <a
                  href={`${social.url}${handle.trim().replace('@', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs font-bold text-white bg-emerald-500 hover:bg-emerald-600 px-4 py-2 rounded-full flex items-center gap-1 transition"
                >
                  Check <ExternalLink size={12} />
                </a>
              </div>
            ))}
          </div>
          <p className="text-xs text-slate-400 mt-6 text-center bg-slate-50 p-3 rounded-lg">
            Click "Check" to open the profile link directly in a new tab.
          </p>
        </div>

        {/* Domain Section */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <Globe className="text-emerald-500" size={24} />
            <h2 className="text-2xl font-bold text-slate-900">Domain Names</h2>
          </div>
          <div className="space-y-3">
            {DOMAINS.map((tld) => {
              const domain = `${handle.trim().toLowerCase().replace(/[^a-z0-9]/g, '')}${tld}`
              const status = domainResults[domain]
              return (
                <div key={tld} className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-100">
                  <span className="font-semibold text-slate-700">{domain || `${tld}`}</span>
                  {status === 'available' && <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-lg flex items-center gap-1"><CheckCircle2 size={14}/> Available</span>}
                  {status === 'taken' && <span className="text-xs font-bold text-red-600 bg-red-100 px-3 py-1.5 rounded-lg flex items-center gap-1"><XCircle size={14}/> Taken</span>}
                  {status === 'unknown' && <span className="text-xs font-bold text-amber-600 bg-amber-100 px-3 py-1.5 rounded-lg">Unknown</span>}
                  {status === 'error' && <span className="text-xs font-bold text-slate-500 bg-slate-200 px-3 py-1.5 rounded-lg">Error</span>}
                  {!status && <span className="text-xs text-slate-400 px-3 py-1.5">Waiting...</span>}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}