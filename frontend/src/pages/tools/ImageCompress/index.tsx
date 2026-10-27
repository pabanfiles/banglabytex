import { useState } from 'react'
import { toast } from 'sonner'
import { Upload, Download } from 'lucide-react'
import ToolPageLayout from '@/components/ToolPageLayout'
import { useToolData } from '@/hooks/useToolData'
import LivePreview from '@/components/LivePreview'

export default function ImageCompress() {
  const { toolData, faqs, relatedPosts } = useToolData('image-compress')
  const [file, setFile] = useState<File | null>(null)
  const [percent, setPercent] = useState(50)

  const handleCompress = async () => {
    if (!file) return toast.error('Select an image')
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      canvas.toBlob(blob => {
        if(blob) {
          const a = document.createElement('a')
          a.href = URL.createObjectURL(blob)
          a.download = 'compressed.jpg'
          a.click()
          toast.success('Compressed successfully')
        }
      }, 'image/jpeg', percent / 100)
    }
    img.src = URL.createObjectURL(file)
  }

  return (
    <ToolPageLayout title={toolData?.h1_title || 'Compress Image'} description={toolData?.intro_text || 'Reduce image size without losing quality.'} category="Image Tools" faqs={faqs} relatedPosts={relatedPosts}>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 max-w-2xl mx-auto">
        <label className="border-2 border-dashed border-[#F97316] bg-[#FFF7ED] dark:bg-slate-900 rounded-2xl p-10 flex flex-col items-center cursor-pointer mb-6">
          <Upload className="text-[#F97316] mb-2" size={32} />
          <span className="text-lg font-semibold text-[#431407] dark:text-white">Select Image</span>
          <input type="file" accept="image/*" className="hidden" onChange={e => { if(e.target.files) setFile(e.target.files[0]) }} />
        </label>
        
        {file && (
          <>
            <label className="block mb-2 font-semibold text-slate-700 dark:text-slate-300">Compression Level: {percent}%</label>
            <input type="range" min="10" max="90" value={percent} onChange={e => setPercent(parseInt(e.target.value))} className="w-full mb-4" />
            <LivePreview file={file} action="Compressed" />
          </>
        )}
        
        <button onClick={handleCompress} disabled={!file} className="w-full py-4 mt-4 bg-[#F97316] text-white font-bold rounded-full disabled:opacity-50">
          <Download size={18} className="inline mr-2"/> Compress Image
        </button>
      </div>
    </ToolPageLayout>
  )
}