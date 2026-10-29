import { useState } from 'react'
import { Upload, Download, RotateCw, RotateCcw, FlipHorizontal, FlipVertical } from 'lucide-react'
import { toast } from 'sonner'
import ToolPageLayout from '@/components/ToolPageLayout'
import { useToolData } from '@/hooks/useToolData'

export default function ImageRotate() {
  const { toolData, faqs, relatedPosts } = useToolData('image-rotate')
  const [file, setFile] = useState<File | null>(null)
  const [rotation, setRotation] = useState(0)
  const [flipH, setFlipH] = useState(false)
  const [flipV, setFlipV] = useState(false)

  const handleApply = () => {
    if(!file) return toast.error('Select an image')
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      const isRotated = rotation === 90 || rotation === 270
      canvas.width = isRotated ? img.height : img.width
      canvas.height = isRotated ? img.width : img.height
      const ctx = canvas.getContext('2d')
      if(ctx) {
        ctx.translate(canvas.width/2, canvas.height/2)
        ctx.rotate(rotation * Math.PI / 180)
        ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1)
        ctx.drawImage(img, -img.width/2, -img.height/2)
      }
      canvas.toBlob(blob => {
        if(blob) {
          const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'rotated.png'; a.click()
          toast.success('Applied successfully!')
        }
      }, 'image/png')
    }
  }

  return (
    <ToolPageLayout title={toolData?.h1_title || 'Image Rotate & Flip'} description={toolData?.intro_text || 'Rotate or flip your images easily.'} category="Image Tools" faqs={faqs} relatedPosts={relatedPosts}>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 max-w-2xl mx-auto">
        <label className="border-2 border-dashed border-[#F97316] bg-[#FFF7ED] dark:bg-slate-900 rounded-2xl p-10 flex flex-col items-center cursor-pointer mb-6">
          <Upload className="text-[#F97316] mb-2" size={32} />
          <span className="text-lg font-semibold text-[#431407] dark:text-white">Select Image</span>
          <input type="file" accept="image/*" className="hidden" onChange={e => { if(e.target.files) setFile(e.target.files[0]) }} />
        </label>
        {file && (
          <div className="flex flex-wrap gap-3 mb-6 justify-center">
            <button onClick={() => setRotation(r => (r + 90) % 360)} className="px-4 py-2 bg-slate-100 rounded-lg flex items-center gap-2"><RotateCw size={16}/> 90°</button>
            <button onClick={() => setRotation(r => (r + 270) % 360)} className="px-4 py-2 bg-slate-100 rounded-lg flex items-center gap-2"><RotateCcw size={16}/> -90°</button>
            <button onClick={() => setFlipH(!flipH)} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${flipH ? 'bg-[#F97316] text-white' : 'bg-slate-100'}`}><FlipHorizontal size={16}/> Flip H</button>
            <button onClick={() => setFlipV(!flipV)} className={`px-4 py-2 rounded-lg flex items-center gap-2 ${flipV ? 'bg-[#F97316] text-white' : 'bg-slate-100'}`}><FlipVertical size={16}/> Flip V</button>
          </div>
        )}
        <button onClick={handleApply} disabled={!file} className="w-full py-4 bg-[#F97316] text-white font-bold rounded-full disabled:opacity-50">
          <Download size={18} className="inline mr-2"/> Apply & Download
        </button>
      </div>
    </ToolPageLayout>
  )
}