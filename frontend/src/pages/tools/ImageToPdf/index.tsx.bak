import { useState } from 'react'
import { Upload, Download } from 'lucide-react'
import { PDFDocument } from 'pdf-lib'
import { toast } from 'sonner'
import ToolPageLayout from '@/components/ToolPageLayout'
import { useToolData } from '@/hooks/useToolData'

export default function ImageToPdf() {
  const { toolData, faqs, relatedPosts } = useToolData('image-to-pdf')
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)

  const handleConvert = async () => {
    if (files.length === 0) return toast.error('Select images')
    setLoading(true)
    try {
      const pdf = await PDFDocument.create()
      for (const file of files) {
        const img = await file.arrayBuffer()
        const image = file.type === 'image/png' ? await pdf.embedPng(img) : await pdf.embedJpg(img)
        const page = pdf.addPage([image.width, image.height])
        page.drawImage(image, { x: 0, y: 0, width: image.width, height: image.height })
      }
      const bytes = await pdf.save()
      const a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([bytes], {type:'application/pdf'})); a.download = 'images.pdf'; a.click()
      toast.success('PDF Created!')
    } catch(e) { toast.error('Failed') } finally { setLoading(false) }
  }

  return (
    <ToolPageLayout title={toolData?.h1_title || 'Image to PDF Converter'} description={toolData?.intro_text || 'Convert your images into a single PDF file.'} category="Image Tools" faqs={faqs} relatedPosts={relatedPosts}>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 max-w-2xl mx-auto">
        <label className="border-2 border-dashed border-[#F97316] bg-[#FFF7ED] dark:bg-slate-900 rounded-2xl p-10 flex flex-col items-center cursor-pointer mb-6">
          <Upload className="text-[#F97316] mb-2" size={32} />
          <span className="text-lg font-semibold text-[#431407] dark:text-white">Select Images</span>
          <input type="file" multiple accept="image/*" className="hidden" onChange={e => { if(e.target.files) setFiles([...files, ...Array.from(e.target.files)]) }} />
        </label>
        {files.length > 0 && <p className="mb-4 text-slate-600">{files.length} images selected</p>}
        <button onClick={handleConvert} disabled={loading || files.length === 0} className="w-full py-4 bg-[#F97316] text-white font-bold rounded-full disabled:opacity-50">
          {loading ? 'Converting...' : <><Download size={18} className="inline mr-2"/> Convert to PDF</>}
        </button>
      </div>
    </ToolPageLayout>
  )
}