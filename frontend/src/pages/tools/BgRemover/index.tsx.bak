import { useState } from 'react'
import { Upload, Download } from 'lucide-react'
import { toast } from 'sonner'
import ToolPageLayout from '@/components/ToolPageLayout'
import { useToolData } from '@/hooks/useToolData'

export default function BgRemover() {
  const { toolData, faqs, relatedPosts } = useToolData('bg-remover')
  const [file, setFile] = useState<File | null>(null)

  const handleRemove = () => {
    if(!file) return toast.error('Select an image')
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width; canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0)
      const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height)
      const data = imageData?.data
      if(data) {
        // Basic white background removal (Threshold)
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i], g = data[i+1], b = data[i+2]
          if (r > 200 && g > 200 && b > 200) data[i+3] = 0; // Make transparent
        }
        ctx?.putImageData(imageData!, 0, 0)
      }
      canvas.toBlob(blob => {
        if(blob) {
          const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'no-bg.png'; a.click()
          toast.success('Background removed (White threshold)!')
        }
      }, 'image/png')
    }
  }

  return (
    <ToolPageLayout title={toolData?.h1_title || 'Background Remover (Free)'} description={toolData?.intro_text || 'Remove white or light backgrounds from your images.'} category="Image Tools" faqs={faqs} relatedPosts={relatedPosts}>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 max-w-2xl mx-auto">
        <label className="border-2 border-dashed border-[#F97316] bg-[#FFF7ED] dark:bg-slate-900 rounded-2xl p-10 flex flex-col items-center cursor-pointer mb-6">
          <Upload className="text-[#F97316] mb-2" size={32} />
          <span className="text-lg font-semibold text-[#431407] dark:text-white">Select Image</span>
          <input type="file" accept="image/*" className="hidden" onChange={e => { if(e.target.files) setFile(e.target.files[0]) }} />
        </label>
        <button onClick={handleRemove} disabled={!file} className="w-full py-4 bg-[#F97316] text-white font-bold rounded-full disabled:opacity-50">
          <Download size={18} className="inline mr-2"/> Remove Background
        </button>
      </div>
    </ToolPageLayout>
  )
}