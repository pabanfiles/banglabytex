import { useState } from 'react'
import { Upload, Download } from 'lucide-react'
import { toast } from 'sonner'
import ToolPageLayout from '@/components/ToolPageLayout'
import { useToolData } from '@/hooks/useToolData'

export default function ImageConvert() {
  const { toolData, faqs, relatedPosts } = useToolData('image-convert')
  const [file, setFile] = useState<File | null>(null)
  const [format, setFormat] = useState('png')

  const handleConvert = () => {
    if (!file) return toast.error('Select an image')
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      canvas.getContext('2d')?.drawImage(img, 0, 0)
      canvas.toBlob(blob => {
        if(blob) {
          const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `converted.${format}`; a.click()
          toast.success(`Converted to ${format.toUpperCase()}`)
        }
      }, `image/${format}`, 0.9)
    }
  }

  return (
    <ToolPageLayout title={toolData?.h1_title || 'Image Converter (JPG, PNG, WebP)'} description={toolData?.intro_text || 'Convert your images to different formats instantly.'} category="Image Tools" faqs={faqs} relatedPosts={relatedPosts}>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 max-w-2xl mx-auto">
        <label className="border-2 border-dashed border-[#F97316] bg-[#FFF7ED] dark:bg-slate-900 rounded-2xl p-10 flex flex-col items-center cursor-pointer mb-6">
          <Upload className="text-[#F97316] mb-2" size={32} />
          <span className="text-lg font-semibold text-[#431407] dark:text-white">Select Image</span>
          <input type="file" accept="image/*" className="hidden" onChange={e => { if(e.target.files) setFile(e.target.files[0]) }} />
        </label>
        {file && (
          <div className="mb-6">
            <label className="text-sm font-semibold">Convert To</label>
            <select value={format} onChange={e => setFormat(e.target.value)} className="w-full p-3 border rounded-xl mt-1">
              <option value="png">PNG</option>
              <option value="jpeg">JPG</option>
              <option value="webp">WebP</option>
            </select>
          </div>
        )}
        <button onClick={handleConvert} disabled={!file} className="w-full py-4 bg-[#F97316] text-white font-bold rounded-full disabled:opacity-50">
          <Download size={18} className="inline mr-2"/> Convert Image
        </button>
      </div>
    </ToolPageLayout>
  )
}