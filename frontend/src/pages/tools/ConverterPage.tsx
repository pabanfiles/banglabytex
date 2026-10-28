import { useState } from 'react'
import { Upload, Download, ExternalLink } from 'lucide-react'
import { toast } from 'sonner'
import ToolPageLayout from '@/components/ToolPageLayout'
import { useToolData } from '@/hooks/useToolData'

interface Props {
  slug: string
  defaultTitle: string
  defaultDesc: string
  accept: string
  endpoint?: string
  comingSoon?: boolean
}

export default function ConverterPage({ slug, defaultTitle, defaultDesc, accept, endpoint, comingSoon }: Props) {
  const { toolData, faqs, relatedPosts } = useToolData(slug)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleConvert = async () => {
    if (!file) return toast.error('Select a file')
    if (comingSoon || !endpoint) return toast.error('This feature is coming soon.')
    
    setLoading(true)
    try {
      const fd = new FormData(); fd.append('file', file)
      const res = await fetch(`https://bangla-pdf-backend.onrender.com${endpoint}`, { method: 'POST', body: fd })
      if (!res.ok) throw new Error('Conversion failed')
      const blob = await res.blob()
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `converted-${file.name.split('.')[0]}`; a.click()
      toast.success('Converted!')
    } catch (e) { toast.error('Conversion failed. Try again.') } finally { setLoading(false) }
  }

  return (
    <ToolPageLayout title={toolData?.h1_title || defaultTitle} description={toolData?.intro_text || defaultDesc} category="Converters" faqs={faqs} relatedPosts={relatedPosts}>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 max-w-2xl mx-auto">
        <label className="border-2 border-dashed border-[#F97316] bg-[#FFF7ED] dark:bg-slate-900 rounded-2xl p-10 flex flex-col items-center cursor-pointer mb-6">
          <Upload className="text-[#F97316] mb-2" size={32} />
          <span className="text-lg font-semibold text-[#431407] dark:text-white">Select File</span>
          <span className="text-sm text-slate-500 mt-1">Format: {accept}</span>
          <input type="file" accept={accept} className="hidden" onChange={e => { if(e.target.files) setFile(e.target.files[0]) }} />
        </label>
        {file && <p className="mb-4 text-slate-600 dark:text-slate-400">Selected: {file.name}</p>}
        <button onClick={handleConvert} disabled={loading || !file} className="w-full py-4 bg-[#F97316] text-white font-bold rounded-full disabled:opacity-50 flex items-center justify-center gap-2">
          {loading ? 'Converting...' : comingSoon ? <><ExternalLink size={18}/> Coming Soon</> : <><Download size={18}/> Convert Now</>}
        </button>
      </div>
    </ToolPageLayout>
  )
}