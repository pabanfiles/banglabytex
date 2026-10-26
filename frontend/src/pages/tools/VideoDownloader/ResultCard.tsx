import { Download, ExternalLink, Copy, Loader2, Music } from 'lucide-react'
import { toast } from 'sonner'
import { useState } from 'react'
import type { MediaResult } from '@/lib/api'

export default function ResultCard({ data }: { data: MediaResult }) {
  const [downloading, setDownloading] = useState<string | null>(null)
  const API_URL = import.meta.env.VITE_API_URL || '/api'

  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied!`)
  }

  const handleDownload = async (url: string, quality: string, ext: string) => {
    setDownloading(url)
    toast.loading('Starting download...', { id: 'dl' })
    try {
      const filename = `${data.platform}-${quality}.${ext}`
      const proxyUrl = `${API_URL}/download?url=${encodeURIComponent(url)}&filename=${encodeURIComponent(filename)}`
      const a = document.createElement('a')
      a.href = proxyUrl
      a.download = filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      toast.success('Download started!', { id: 'dl' })
    } catch (err) {
      toast.error('Download failed', { id: 'dl' })
    } finally {
      setTimeout(() => setDownloading(null), 2000)
    }
  }

  const formatSize = (bytes?: number) => {
    if (!bytes || bytes <= 0) return null
    return (bytes / 1024 / 1024).toFixed(1) + ' MB'
  }

  return (
    <div className="mt-6 bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
      <div className="flex gap-4 p-5 border-b border-slate-100">
        {data.thumbnail && <img src={data.thumbnail} alt={data.title} className="w-32 h-32 object-cover rounded-xl bg-slate-100" loading="lazy" />}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded font-medium uppercase">{data.platform}</span>
            <span className="capitalize">{data.type}</span>
          </div>
          <h3 className="font-semibold text-slate-900 line-clamp-2">{data.title}</h3>
          {data.author && <p className="text-sm text-slate-500 mt-0.5">by {data.author}</p>}
        </div>
      </div>

      {data.caption && (
        <div className="p-5 border-b border-slate-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-500 uppercase">Caption</span>
            <button onClick={() => copyText(data.caption!, 'Caption')} className="text-xs text-emerald-600 hover:underline flex items-center gap-1">
              <Copy size={12} /> Copy
            </button>
          </div>
          <p className="text-sm text-slate-700 line-clamp-3">{data.caption}</p>
        </div>
      )}

      <div className="p-5 space-y-4">
        <div>
          <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">📹 Video</h4>
          <div className="space-y-2">
            {data.formats.map((f, i) => (
              <button 
                key={i} 
                onClick={() => handleDownload(f.url, f.quality, f.ext)} 
                disabled={downloading === f.url} 
                className="flex items-center justify-between w-full px-4 py-3 bg-emerald-500 text-white font-medium rounded-full hover:bg-emerald-600 transition-all disabled:opacity-80 shadow-md shadow-emerald-500/20"
              >
                <span className="flex items-center gap-2">
                  {downloading === f.url ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
                  {f.quality} {f.ext.toUpperCase()}
                </span>
                {formatSize(f.size) && <span className="text-sm opacity-90">{formatSize(f.size)}</span>}
              </button>
            ))}
          </div>
        </div>

        {data.audioFormats && data.audioFormats.length > 0 && (
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase mb-2">🎵 Audio Only</h4>
            <div className="space-y-2">
              {data.audioFormats.map((f, i) => (
                <button 
                  key={i} 
                  onClick={() => handleDownload(f.url, f.quality, f.ext)} 
                  disabled={downloading === f.url} 
                  className="flex items-center justify-between w-full px-4 py-3 bg-slate-800 text-white font-medium rounded-full hover:bg-slate-900 transition-all disabled:opacity-80"
                >
                  <span className="flex items-center gap-2">
                    {downloading === f.url ? <Loader2 size={18} className="animate-spin" /> : <Music size={18} />}
                    {f.quality} {f.ext.toUpperCase()}
                  </span>
                  {formatSize(f.size) && <span className="text-sm opacity-90">{formatSize(f.size)}</span>}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}