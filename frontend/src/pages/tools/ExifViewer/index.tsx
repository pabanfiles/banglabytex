import { useState } from 'react'
import { Upload } from 'lucide-react'
import { toast } from 'sonner'
import ToolPageLayout from '@/components/ToolPageLayout'
import { useToolData } from '@/hooks/useToolData'

export default function ExifViewer() {
  const { toolData, faqs, relatedPosts } = useToolData('exif-viewer')
  const [file, setFile] = useState<File | null>(null)
  const [info, setInfo] = useState<any>(null)

  const handleView = () => {
    if(!file) return toast.error('Select an image')
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      setInfo({ width: img.width, height: img.height, type: file.type, size: (file.size/1024).toFixed(2) + ' KB' })
      toast.info('Basic metadata loaded. (Full EXIF requires library)')
    }
  }

  return (
    <ToolPageLayout title={toolData?.h1_title || 'Image Metadata Viewer'} description={toolData?.intro_text || 'View basic EXIF data of your images.'} category="Image Tools" faqs={faqs} relatedPosts={relatedPosts}>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 max-w-2xl mx-auto">
        <label className="border-2 border-dashed border-[#F97316] bg-[#FFF7ED] dark:bg-slate-900 rounded-2xl p-10 flex flex-col items-center cursor-pointer mb-6">
          <Upload className="text-[#F97316] mb-2" size={32} />
          <span className="text-lg font-semibold text-[#431407] dark:text-white">Select Image</span>
          <input type="file" accept="image/*" className="hidden" onChange={e => { if(e.target.files) setFile(e.target.files[0]) }} />
        </label>
        <button onClick={handleView} disabled={!file} className="w-full py-4 bg-[#F97316] text-white font-bold rounded-full disabled:opacity-50 mb-4">View Metadata</button>
        {info && (
          <div className="bg-slate-100 dark:bg-slate-900 p-4 rounded-xl space-y-2 text-sm">
            <p><b>Width:</b> {info.width}px</p>
            <p><b>Height:</b> {info.height}px</p>
            <p><b>Format:</b> {info.type}</p>
            <p><b>Size:</b> {info.size}</p>
          </div>
        )}
      </div>
    </ToolPageLayout>
  )
}