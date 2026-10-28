import { useState } from 'react'
import { Upload, Download } from 'lucide-react'
import { toast } from 'sonner'
import ToolPageLayout from '@/components/ToolPageLayout'
import { useToolData } from '@/hooks/useToolData'

export default function ImageWatermark() {
  const { toolData, faqs, relatedPosts } = useToolData('image-watermark')
  const [file, setFile] = useState<File | null>(null)
  const [text, setText] = useState('PPM Creator')

  const handleApply = () => {
    if(!file) return toast.error('Select an image')
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width; canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0)
      if(ctx) {
        ctx.font = 'bold 40px sans-serif'
        ctx.fillStyle = 'rgba(255,255,255,0.6)'
        ctx.fillText(text, 40, img.height - 40)
      }
      canvas.toBlob(blob => {
        if(blob) {
          const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'watermarked.jpg'; a.click()
          toast.success('Watermark added!')
        }
      }, 'image/jpeg', 0.9)
    }
  }

  return (
    <ToolPageLayout title={toolData?.h1_title || 'Image Watermark Tool'} description={toolData?.intro_text || 'Add text watermarks to your photos.'} category="Image Tools" faqs={faqs} relatedPosts={relatedPosts}>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 max-w-2xl mx-auto">
        <label className="border-2 border-dashed border-[#F97316] bg-[#FFF7ED] dark:bg-slate-900 rounded-2xl p-10 flex flex-col items-center cursor-pointer mb-6">
          <Upload className="text-[#F97316] mb-2" size={32} />
          <span className="text-lg font-semibold text-[#431407] dark:text-white">Select Image</span>
          <input type="file" accept="image/*" className="hidden" onChange={e => { if(e.target.files) setFile(e.target.files[0]) }} />
        </label>
        {file && (
          <div className="mb-6">
            <input type="text" value={text} onChange={e => setText(e.target.value)} className="w-full p-3 border rounded-xl" placeholder="Watermark text" />
          </div>
        )}
        <button onClick={handleApply} disabled={!file} className="w-full py-4 bg-[#F97316] text-white font-bold rounded-full disabled:opacity-50">
          <Download size={18} className="inline mr-2"/> Apply Watermark
        </button>
      </div>
    </ToolPageLayout>
  )
}