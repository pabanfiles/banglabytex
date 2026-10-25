import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Link2, Download, Loader2 } from 'lucide-react'
import { extractMedia, type MediaResult } from '@/lib/api'
import ResultCard from './ResultCard'

const SUPPORTED = ['Facebook', 'Instagram', 'TikTok', 'Twitter/X', 'Reddit', 'Pinterest', 'Vimeo', 'YouTube']

export default function VideoDownloader() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState<MediaResult | null>(null)

  const { mutate, isPending } = useMutation({
    mutationFn: extractMedia,
    onSuccess: (data) => { setResult(data); toast.success('Media found!') },
    onError: (err: any) => { toast.error(err?.response?.data?.error || 'Failed to extract. Check URL.') },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault(); if (!url.trim()) return; setResult(null); mutate(url.trim())
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">🎬 Video Downloader</h1>
        <p className="mt-3 text-slate-600">Paste a URL from any supported platform. Fast, free, no signup.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input type="url" value={url} onChange={e => setUrl(e.target.value)} placeholder="https://www.instagram.com/reel/..." className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none" required />
          </div>
          <button type="submit" disabled={isPending || !url.trim()} className="px-6 py-3.5 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-50 flex items-center justify-center gap-2">
            {isPending ? <><Loader2 className="animate-spin" size={20} /> Fetching...</> : <><Download size={20} /> Fetch</>}
          </button>
        </div>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {SUPPORTED.map(p => <span key={p} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">{p}</span>)}
        </div>
      </form>

      {result && <ResultCard data={result} />}
    </div>
  )
}