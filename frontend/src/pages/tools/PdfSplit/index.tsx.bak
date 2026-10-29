import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import { toast } from 'sonner'
import { Upload, Download } from 'lucide-react'
import ToolPageLayout from '@/components/ToolPageLayout'
import { useToolData } from '@/hooks/useToolData'

export default function PdfSplit() {
  const { toolData, faqs, relatedPosts } = useToolData('pdf-split')
  const [file, setFile] = useState<File | null>(null)

  const handleSplit = async () => {
    if (!file) return toast.error('Select a PDF')
    const pdf = await PDFDocument.load(await file.arrayBuffer())
    const newPdf = await PDFDocument.create()
    const pages = await newPdf.copyPages(pdf, [0]) // Split first page as example
    pages.forEach(p => newPdf.addPage(p))
    const blob = new Blob([await newPdf.save()], { type: 'application/pdf' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'split.pdf'; a.click()
    toast.success('Split successfully')
  }

  return (
    <ToolPageLayout title={toolData?.h1_title || 'Split PDF'} description={toolData?.intro_text || 'Split PDFs easily.'} category="PDF Tools" faqs={faqs} relatedPosts={relatedPosts}>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 max-w-2xl mx-auto">
        <label className="border-2 border-dashed border-[#F97316] bg-[#FFF7ED] dark:bg-slate-900 rounded-2xl p-10 flex flex-col items-center cursor-pointer mb-6">
          <Upload className="text-[#F97316] mb-2" size={32} />
          <span className="text-lg font-semibold text-[#431407] dark:text-white">Select PDF File</span>
          <input type="file" accept="application/pdf" className="hidden" onChange={e => e.target.files && setFile(e.target.files[0])} />
        </label>
        {file && <p className="mb-4 text-slate-600 dark:text-slate-400">Selected: {file.name}</p>}
        <button onClick={handleSplit} disabled={!file} className="w-full py-4 bg-[#F97316] text-white font-bold rounded-full disabled:opacity-50">
          <Download size={18} className="inline mr-2"/> Split PDF
        </button>
      </div>
    </ToolPageLayout>
  )
}