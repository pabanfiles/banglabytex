import { useState } from 'react'
import { Upload, Copy } from 'lucide-react'
import { toast } from 'sonner'
import ToolPageLayout from '@/components/ToolPageLayout'
import { useToolData } from '@/hooks/useToolData'

export default function ImageToBase64() {
  const { toolData, faqs, relatedPosts } = useToolData('image-to-base64')
  const [file, setFile] = useState<File | null>(null)
  const [base64, setBase64] = useState('')

  const handleConvert = () => {
    if(!file) return toast.error('Select an image')
    const reader = new FileReader()
    reader.onload = () => setBase64(reader.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <ToolPageLayout title={toolData?.h1_title || 'Image to Base64 Converter'} description={toolData?.intro_text || 'Convert images to Base64 string for web development.'} category="Image Tools" faqs={faqs} relatedPosts={relatedPosts}>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 max-w-2xl mx-auto">
        <label className="border-2 border-dashed border-[#F97316] bg-[#FFF7ED] dark:bg-slate-900 rounded-2xl p-10 flex flex-col items-center cursor-pointer mb-6">
          <Upload className="text-[#F97316] mb-2" size={32} />
          <span className="text-lg font-semibold text-[#431407] dark:text-white">Select Image</span>
          <input type="file" accept="image/*" className="hidden" onChange={e => { if(e.target.files) setFile(e.target.files[0]) }} />
        </label>
        <button onClick={handleConvert} disabled={!file} className="w-full py-4 bg-[#F97316] text-white font-bold rounded-full disabled:opacity-50 mb-4">
          Convert to Base64
        </button>
        {base64 && (
          <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-xl relative">
            <textarea readOnly value={base64} rows={6} className="w-full bg-transparent text-xs font-mono outline-none resize-none"></textarea>
            <button onClick={() => {navigator.clipboard.writeText(base64); toast.success('Copied!')}} className="absolute top-2 right-2 p-2 bg-white rounded-lg shadow"><Copy size={16}/></button>
          </div>
        )}
      </div>
    </ToolPageLayout>
  )
}