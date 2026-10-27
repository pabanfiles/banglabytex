import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'
import { Link2, Download, Loader2, ShieldCheck } from 'lucide-react'
import { extractMedia, type MediaResult } from '@/lib/api'
import ResultCard from './ResultCard'

const SUPPORTED = ['Facebook', 'Instagram', 'TikTok', 'Twitter/X', 'Threads', 'Reddit', 'Pinterest', 'Vimeo', 'Snapchat', 'LinkedIn', 'Dailymotion']

export default function VideoDownloader() {
  const [url, setUrl] = useState('')
  const [result, setResult] = useState<MediaResult | null>(null)
  const [agreed, setAgreed] = useState(false)

  const { mutate, isPending } = useMutation({
    mutationFn: extractMedia,
    onSuccess: (data) => {
      setResult(data)
      toast.success('Media found!')
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.error || 'Failed to extract. Check URL.')
    },
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    if (!agreed) {
      toast.error('Please agree to the Disclaimer before downloading.')
      return
    }
    setResult(null)
    mutate(url.trim())
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-[#431407] dark:text-white">🎬 Video Downloader</h1>
        <p className="mt-3 text-slate-600 dark:text-slate-400">Paste URL from any platform. Fast, free, no signup.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg p-6 border border-slate-100 dark:border-slate-700">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://www.instagram.com/reel/..."
              className="w-full pl-12 pr-4 py-3.5 border border-slate-200 dark:border-slate-600 rounded-xl focus:ring-2 focus:ring-[#F97316] bg-transparent dark:text-white outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isPending || !url.trim()}
            className="px-6 py-3.5 bg-[#F97316] text-white font-semibold rounded-xl hover:bg-[#EA580C] disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isPending ? <><Loader2 className="animate-spin" size={20} /> Fetching...</> : <><Download size={20} /> Fetch</>}
          </button>
        </div>

        <div className="mt-4 flex items-start gap-3 bg-slate-50 dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
          <input 
            type="checkbox" 
            id="agree" 
            checked={agreed} 
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-5 h-5 accent-[#F97316] cursor-pointer"
          />
          <label htmlFor="agree" className="text-sm text-slate-600 dark:text-slate-400 cursor-pointer">
            I agree that I am solely responsible for the content I download and confirm that I have the right to download it.
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {SUPPORTED.map(p => (
            <span key={p} className="text-xs px-2 py-1 bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded">{p}</span>
          ))}
        </div>
      </form>

      {result && <ResultCard data={result} />}

      <div className="mt-10 bg-[#FFF7ED] dark:bg-slate-800 border border-[#FFEDD5] dark:border-slate-700 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2 text-[#F97316] font-semibold">
          <ShieldCheck size={20} /> Disclaimer & Copyright Notice
        </div>
        <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          PPM Creator does not host, store, or distribute any copyrighted media. All videos and audio files are fetched directly from third-party platforms. Users are solely responsible for how they use the downloaded files.
        </p>
      </div>
    </div>
  )
}