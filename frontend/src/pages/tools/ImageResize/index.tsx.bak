import { useState } from 'react'
import { Upload, Download } from 'lucide-react'
import { toast } from 'sonner'
import ToolPageLayout from '@/components/ToolPageLayout'
import { useToolData } from '@/hooks/useToolData'

export default function ImageResize() {
  const { toolData, faqs, relatedPosts } = useToolData('image-resize')
  const [file, setFile] = useState<File | null>(null)
  const [width, setWidth] = useState(800)
  const [height, setHeight] = useState(600)

  const handleResize = () => {
    if (!file) return toast.error('Select an image')
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0, width, height)
      canvas.toBlob(blob => {
        if(blob) {
          const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'resized.jpg'; a.click()
          toast.success('Image resized!')
        }
      }, 'image/jpeg', 0.9)
    }
  }

  return (
    <ToolPageLayout title={toolData?.h1_title || 'Image Resizer Online Free'} description={toolData?.intro_text || 'Resize your images to exact dimensions easily.'} category="Image Tools" faqs={faqs} relatedPosts={relatedPosts}>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 max-w-2xl mx-auto">
        <label className="border-2 border-dashed border-[#F97316] bg-[#FFF7ED] dark:bg-slate-900 rounded-2xl p-10 flex flex-col items-center cursor-pointer mb-6">
          <Upload className="text-[#F97316] mb-2" size={32} />
          <span className="text-lg font-semibold text-[#431407] dark:text-white">Select Image</span>
          <input type="file" accept="image/*" className="hidden" onChange={e => { if(e.target.files) setFile(e.target.files[0]) }} />
        </label>
        {file && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div><label className="text-sm font-semibold">Width (px)</label><input type="number" value={width} onChange={e => setWidth(Number(e.target.value))} className="w-full p-3 border rounded-xl mt-1" /></div>
            <div><label className="text-sm font-semibold">Height (px)</label><input type="number" value={height} onChange={e => setHeight(Number(e.target.value))} className="w-full p-3 border rounded-xl mt-1" /></div>
          </div>
        )}
        <button onClick={handleResize} disabled={!file} className="w-full py-4 bg-[#F97316] text-white font-bold rounded-full disabled:opacity-50">
          <Download size={18} className="inline mr-2"/> Resize Image
        </button>
      </div>
    </ToolPageLayout>
  )
}