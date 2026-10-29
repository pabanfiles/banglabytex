import { useState } from 'react'
import { Upload, Copy } from 'lucide-react'
import { toast } from 'sonner'
import ToolPageLayout from '@/components/ToolPageLayout'
import { useToolData } from '@/hooks/useToolData'

export default function ImageColorPicker() {
  const { toolData, faqs, relatedPosts } = useToolData('image-color-picker')
  const [file, setFile] = useState<File | null>(null)
  const [hex, setHex] = useState('#FFFFFF')

  const handlePick = (e: React.MouseEvent<HTMLImageElement>) => {
    if(!file) return
    const img = e.currentTarget
    const canvas = document.createElement('canvas')
    canvas.width = img.naturalWidth; canvas.height = img.naturalHeight
    const ctx = canvas.getContext('2d')
    ctx?.drawImage(img, 0, 0)
    const rect = img.getBoundingClientRect()
    const x = (e.clientX - rect.left) * (img.naturalWidth / rect.width)
    const y = (e.clientY - rect.top) * (img.naturalHeight / rect.height)
    const pixel = ctx?.getImageData(x, y, 1, 1).data
    if(pixel) {
      const hexVal = '#' + [pixel[0], pixel[1], pixel[2]].map(x => x.toString(16).padStart(2, '0')).join('').toUpperCase()
      setHex(hexVal)
    }
  }

  return (
    <ToolPageLayout title={toolData?.h1_title || 'Image Color Picker'} description={toolData?.intro_text || 'Pick any color from your image and get the HEX code.'} category="Image Tools" faqs={faqs} relatedPosts={relatedPosts}>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 max-w-2xl mx-auto">
        <label className="border-2 border-dashed border-[#F97316] bg-[#FFF7ED] dark:bg-slate-900 rounded-2xl p-10 flex flex-col items-center cursor-pointer mb-6">
          <Upload className="text-[#F97316] mb-2" size={32} />
          <span className="text-lg font-semibold text-[#431407] dark:text-white">Upload Image</span>
          <input type="file" accept="image/*" className="hidden" onChange={e => { if(e.target.files) setFile(e.target.files[0]) }} />
        </label>
        {file && (
          <div className="mb-6">
            <img src={URL.createObjectURL(file)} onClick={handlePick} className="w-full max-h-64 object-contain cursor-crosshair rounded-xl" />
            <div className="mt-4 flex items-center gap-4">
              <div className="w-10 h-10 rounded-full border shadow" style={{backgroundColor: hex}}></div>
              <span className="font-mono font-bold text-xl">{hex}</span>
              <button onClick={() => {navigator.clipboard.writeText(hex); toast.success('Copied!')}} className="ml-auto text-[#F97316]"><Copy size={18}/></button>
            </div>
          </div>
        )}
      </div>
    </ToolPageLayout>
  )
}