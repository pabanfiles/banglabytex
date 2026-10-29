import { useState } from 'react'
import { Upload, Copy, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import ToolPageLayout from '@/components/ToolPageLayout'
import { useToolData } from '@/hooks/useToolData'

export default function ImageToText() {
  const { toolData, faqs, relatedPosts } = useToolData('image-to-text')
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('')
  const [loading, setLoading] = useState(false)

  const handleExtract = async () => {
    if(!file) return toast.error('Select an image')
    setLoading(true)
    try {
      // Dynamically load Tesseract.js from CDN
      const script = document.createElement('script')
      script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js'
      document.head.appendChild(script)
      
      script.onload = async () => {
        // @ts-ignore
        const worker = await Tesseract.createWorker('eng+ben')
        const ret = await worker.recognize(file)
        setText(ret.data.text)
        await worker.terminate()
        toast.success('Text extracted!')
        setLoading(false)
      }
    } catch(e) {
      toast.error('Failed to extract text')
      setLoading(false)
    }
  }

  return (
    <ToolPageLayout title={toolData?.h1_title || 'Image to Text (OCR)'} description={toolData?.intro_text || 'Extract text from images using OCR.'} category="Image Tools" faqs={faqs} relatedPosts={relatedPosts}>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 max-w-2xl mx-auto">
        <label className="border-2 border-dashed border-[#F97316] bg-[#FFF7ED] dark:bg-slate-900 rounded-2xl p-10 flex flex-col items-center cursor-pointer mb-6">
          <Upload className="text-[#F97316] mb-2" size={32} />
          <span className="text-lg font-semibold text-[#431407] dark:text-white">Select Image with Text</span>
          <span className="text-sm text-slate-500 mt-1">Supports English & Bengali (Beta)</span>
          <input type="file" accept="image/*" className="hidden" onChange={e => { if(e.target.files) setFile(e.target.files[0]) }} />
        </label>
        
        <button onClick={handleExtract} disabled={loading || !file} className="w-full py-4 bg-[#F97316] text-white font-bold rounded-full disabled:opacity-50 mb-4 flex justify-center items-center gap-2">
          {loading ? <><Loader2 className="animate-spin" size={20}/> Extracting...</> : 'Extract Text'}
        </button>
        
        {text && (
          <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-xl relative">
            <textarea readOnly value={text} rows={8} className="w-full bg-transparent text-sm outline-none resize-none"></textarea>
            <button onClick={() => {navigator.clipboard.writeText(text); toast.success('Copied!')}} className="absolute top-2 right-2 p-2 bg-white rounded-lg shadow"><Copy size={16}/></button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  )
}