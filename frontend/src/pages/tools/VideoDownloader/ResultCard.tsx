import { Download, ExternalLink, Copy } from 'lucide-react'
import { toast } from 'sonner'
import { downloadMedia, type MediaResult } from '@/lib/api'

export default function ResultCard({ data }: { data: MediaResult }) {
  const copyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied!`)
  }
  const isYouTube = data.platform.toLowerCase() === 'youtube'

  return (
    <div className="mt-6 bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden">
      <div className="flex gap-4 p-5 border-b border-slate-100">
        {data.thumbnail && (
          <img src={data.thumbnail} alt={data.title} className="w-32 h-32 object-cover rounded-xl bg-slate-100" loading="lazy" />
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="px-2 py-0.5 bg-brand-50 text-brand-600 rounded font-medium uppercase">{data.platform}</span>
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
            <button onClick={() => copyText(data.caption!, 'Caption')} className="text-xs text-brand-600 hover:underline flex items-center gap-1">
              <Copy size={12} /> Copy
            </button>
          </div>
          <p className="text-sm text-slate-700 line-clamp-3">{data.caption}</p>
        </div>
      )}

      <div className="p-5 space-y-2">
        {isYouTube ? (
          <a href={data.watchUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-red-600 text-white font-semibold rounded-xl hover:bg-red-700">
            <ExternalLink size={18} /> Watch on YouTube
          </a>
        ) : (
          data.formats.map((f, i) => (
            <button key={i} onClick={() => downloadMedia(f.url, `${data.platform}-${f.quality}.${f.ext}`)} className="flex items-center justify-between w-full px-4 py-3 bg-brand-600 text-white font-medium rounded-xl hover:bg-brand-700 transition">
              <span className="flex items-center gap-2"><Download size={18} /> {f.quality} {f.ext.toUpperCase()}</span>
              {f.size && f.size > 0 && <span className="text-sm opacity-90">{(f.size / 1024 / 1024).toFixed(1)} MB</span>}
            </button>
          ))
        )}
      </div>
    </div>
  )
}