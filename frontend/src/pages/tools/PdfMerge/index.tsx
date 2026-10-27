import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, ExternalLink } from 'lucide-react'
import { useToolData } from '@/hooks/useToolData'
import ToolPageLayout from '@/components/ToolPageLayout'
import { PDFDocument } from 'pdf-lib'
import { toast } from 'sonner'
import { Upload, X, Download, Loader2 } from 'lucide-react'

export default function PdfMerge() {
  const { toolData, faqs, relatedPosts } = useToolData('pdf-merge')
  const [files, setFiles] = useState<File[]>([])
  const [merging, setMerging] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) setFiles([...files, ...Array.from(e.target.files)])
  }
  const removeFile = (index: number) => setFiles(files.filter((_, i) => i !== index))

  const handleMerge = async () => {
    if (files.length < 2) return toast.error('Select at least 2 PDFs.')
    setMerging(true)
    try {
      const mergedPdf = await PDFDocument.create()
      for (const file of files) {
        const pdf = await PDFDocument.load(await file.arrayBuffer())
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach((page) => mergedPdf.addPage(page))
      }
      const blob = new Blob([await mergedPdf.save()], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a'); a.href = url; a.download = 'merged.pdf'; a.click()
      toast.success('Merged successfully!')
    } catch (e) { toast.error('Merge failed.') } finally { setMerging(false) }
  }

  return (
    <ToolPageLayout 
      title={toolData?.h1_title || 'Merge PDF Files Online Free'}
      description={toolData?.intro_text || 'Combine multiple PDF documents into one.'}
      category="PDF Tools"
      faqs={faqs}
      relatedPosts={relatedPosts}
    >
      <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100 max-w-2xl mx-auto">
        <label className="border-2 border-dashed border-[#F97316] bg-[#FFF7ED] rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-[#FFEDD5] transition mb-6">
          <Upload className="text-[#F97316] mb-4" size={40} />
          <span className="text-lg font-semibold text-[#431407]">Click to upload PDFs</span>
          <input type="file" multiple accept="application/pdf" className="hidden" onChange={handleFileChange} />
        </label>
        {files.length > 0 && (
          <div className="space-y-3 mb-6">
            {files.map((file, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="truncate">{file.name}</span>
                <button onClick={() => removeFile(i)} className="text-red-500"><X size={18}/></button>
              </div>
            ))}
          </div>
        )}
        <button onClick={handleMerge} disabled={merging || files.length < 2} className="w-full py-4 bg-[#F97316] text-white font-bold rounded-full hover:bg-[#EA580C] transition disabled:opacity-50 flex justify-center items-center gap-2">
          {merging ? <><Loader2 className="animate-spin" size={20}/> Merging...</> : <><Download size={20}/> Merge PDFs</>}
        </button>
      </div>
    </ToolPageLayout>
  )
}