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
      toast.error('Please agree to the Terms and Disclaimer before downloading.')
      return
    }
    setResult(null)
    mutate(url.trim())
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900">🎬 Video Downloader</h1>
        <p className="mt-3 text-slate-600">Paste URL from any platform. Fast, free, no signup.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 border border-slate-100">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Link2 className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
            <input
              type="url"
              value={url}
              onChange={e => setUrl(e.target.value)}
              placeholder="https://www.instagram.com/reel/..."
              className="w-full pl-12 pr-4 py-3.5 border border-slate-200 rounded-xl focus:ring-2 focus:ring-brand-500 outline-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={isPending || !url.trim()}
            className="px-6 py-3.5 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isPending ? <><Loader2 className="animate-spin" size={20} /> Fetching...</> : <><Download size={20} /> Fetch</>}
          </button>
        </div>

        {/* Agree Checkbox */}
        <div className="mt-4 flex items-start gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200">
          <input 
            type="checkbox" 
            id="agree" 
            checked={agreed} 
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-1 w-5 h-5 accent-emerald-500 cursor-pointer"
          />
          <label htmlFor="agree" className="text-sm text-slate-600 cursor-pointer">
            I agree that I am solely responsible for the content I download and confirm that I have the right to download it. 
            <span className="block mt-1 text-xs text-slate-500">
              By checking this box, you agree to our <a href="/terms" className="text-brand-600 hover:underline">Terms of Use</a> and <a href="/privacy-policy" className="text-brand-600 hover:underline">Privacy Policy</a>.
            </span>
          </label>
        </div>

        <div className="mt-4 flex flex-wrap gap-1.5">
          {SUPPORTED.map(p => (
            <span key={p} className="text-xs px-2 py-1 bg-slate-100 text-slate-600 rounded">{p}</span>
          ))}
        </div>
      </form>

      {result && <ResultCard data={result} />}

      {/* Disclaimer Section */}
      <div className="mt-10 bg-emerald-50 border border-emerald-100 rounded-xl p-5">
        <div className="flex items-center gap-2 mb-2 text-emerald-700 font-semibold">
          <ShieldCheck size={20} /> Disclaimer & Copyright Notice
        </div>
        <p className="text-sm text-emerald-800 leading-relaxed">
          BanglaByteX does not host, store, or distribute any copyrighted media. All videos and audio files are fetched directly from third-party platforms (Facebook, Instagram, TikTok, etc.). 
          We strictly do not support downloading private content or content without the owner's permission. Users are solely responsible for how they use the downloaded files. 
          If you are a copyright owner and believe your content is being accessed improperly, please contact us at <strong>support@banglabytex.com</strong> for immediate removal.
        </p>
      </div>
    </div>
  )
}