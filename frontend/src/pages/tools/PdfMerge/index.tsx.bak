import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import { toast } from 'sonner'
import { Upload, X, Download, Loader2 } from 'lucide-react'
import ToolPageLayout from '@/components/ToolPageLayout'
import { useToolData } from '@/hooks/useToolData'

export default function PdfMerge() {
  const { toolData, faqs, relatedPosts } = useToolData('pdf-merge')
  const [files, setFiles] = useState<File[]>([])
  const [merging, setMerging] = useState(false)

  const handleMerge = async () => {
    if (files.length < 2) return toast.error('Select at least 2 PDFs.')
    setMerging(true)
    try {
      const mergedPdf = await PDFDocument.create()
      for (const file of files) {
        const pdf = await PDFDocument.load(await file.arrayBuffer())
        const pages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        pages.forEach(p => mergedPdf.addPage(p))
      }
      const blob = new Blob([await mergedPdf.save()], { type: 'application/pdf' })
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'merged.pdf'; a.click()
      toast.success('Merged!')
    } catch (e) { toast.error('Error merging') } finally { setMerging(false) }
  }

  return (
    <ToolPageLayout title={toolData?.h1_title || 'Merge PDF'} description={toolData?.intro_text || 'Combine PDFs easily.'} category="PDF Tools" faqs={faqs} relatedPosts={relatedPosts}>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 max-w-2xl mx-auto">
        <label className="border-2 border-dashed border-[#F97316] bg-[#FFF7ED] dark:bg-slate-900 rounded-2xl p-10 flex flex-col items-center cursor-pointer mb-6">
          <Upload className="text-[#F97316] mb-2" size={32} />
          <span className="text-lg font-semibold text-[#431407] dark:text-white">Select PDF Files</span>
          <input type="file" multiple accept="application/pdf" className="hidden" onChange={e => e.target.files && setFiles([...files, ...Array.from(e.target.files)])} />
        </label>
        {files.map((f, i) => (
          <div key={i} className="flex justify-between p-3 bg-slate-50 dark:bg-slate-700 rounded-lg mb-2">
            <span className="truncate">{f.name}</span>
            <button onClick={() => setFiles(files.filter((_, idx) => idx !== i))} className="text-red-500"><X size={18}/></button>
          </div>
        ))}
        <button onClick={handleMerge} disabled={merging || files.length < 2} className="w-full py-4 mt-4 bg-[#F97316] text-white font-bold rounded-full disabled:opacity-50">
          {merging ? <Loader2 className="animate-spin mx-auto"/> : <><Download size={18} className="inline mr-2"/> Merge PDFs</>}
        </button>
      </div>
    </ToolPageLayout>
  )
}