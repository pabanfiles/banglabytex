import { useState } from 'react'
import { Upload, Download } from 'lucide-react'
import { toast } from 'sonner'
import ToolPageLayout from '@/components/ToolPageLayout'
import { useToolData } from '@/hooks/useToolData'

export default function PassportPhoto() {
  const { toolData, faqs, relatedPosts } = useToolData('passport-photo')
  const [file, setFile] = useState<File | null>(null)

  const handleGenerate = () => {
    if(!file) return toast.error('Select an image')
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      // Passport standard: 413x531 pixels (35x45mm at 300dpi)
      canvas.width = 413; canvas.height = 531
      const ctx = canvas.getContext('2d')
      if(ctx) {
        // Center crop
        const minSize = Math.min(img.width, img.height)
        const sx = (img.width - minSize) / 2
        const sy = (img.height - minSize) / 2
        ctx.drawImage(img, sx, sy, minSize, minSize, 0, 0, 413, 531)
      }
      canvas.toBlob(blob => {
        if(blob) {
          const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'passport-photo.jpg'; a.click()
          toast.success('Passport Photo Generated!')
        }
      }, 'image/jpeg', 0.95)
    }
  }

  return (
    <ToolPageLayout title={toolData?.h1_title || 'Passport Size Photo Maker'} description={toolData?.intro_text || 'Create a perfect passport-size photo instantly.'} category="Image Tools" faqs={faqs} relatedPosts={relatedPosts}>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 max-w-2xl mx-auto">
        <label className="border-2 border-dashed border-[#F97316] bg-[#FFF7ED] dark:bg-slate-900 rounded-2xl p-10 flex flex-col items-center cursor-pointer mb-6">
          <Upload className="text-[#F97316] mb-2" size={32} />
          <span className="text-lg font-semibold text-[#431407] dark:text-white">Upload Your Photo</span>
          <span className="text-sm text-slate-500 mt-1">We will auto-crop to 35x45mm (413x531px)</span>
          <input type="file" accept="image/*" className="hidden" onChange={e => { if(e.target.files) setFile(e.target.files[0]) }} />
        </label>
        <button onClick={handleGenerate} disabled={!file} className="w-full py-4 bg-[#F97316] text-white font-bold rounded-full disabled:opacity-50">
          <Download size={18} className="inline mr-2"/> Generate Passport Photo
        </button>
      </div>
    </ToolPageLayout>
  )
}