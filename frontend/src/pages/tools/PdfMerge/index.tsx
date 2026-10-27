import { useState } from 'react'
import { PDFDocument } from 'pdf-lib'
import { toast } from 'sonner'
import { Upload, X, Download, Loader2 } from 'lucide-react'

export default function PdfMerge() {
  const [files, setFiles] = useState<File[]>([])
  const [merging, setMerging] = useState(false)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles([...files, ...Array.from(e.target.files)])
    }
  }

  const removeFile = (index: number) => {
    setFiles(files.filter((_, i) => i !== index))
  }

  const handleMerge = async () => {
    if (files.length < 2) {
      toast.error('Please select at least 2 PDF files.')
      return
    }
    setMerging(true)
    try {
      const mergedPdf = await PDFDocument.create()
      for (const file of files) {
        const arrayBuffer = await file.arrayBuffer()
        const pdf = await PDFDocument.load(arrayBuffer)
        const copiedPages = await mergedPdf.copyPages(pdf, pdf.getPageIndices())
        copiedPages.forEach((page) => mergedPdf.addPage(page))
      }
      const pdfBytes = await mergedPdf.save()
      const blob = new Blob([pdfBytes], { type: 'application/pdf' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'merged.pdf'
      a.click()
      URL.revokeObjectURL(url)
      toast.success('Merged successfully!')
    } catch (error) {
      toast.error('Failed to merge PDFs. Make sure they are valid.')
    } finally {
      setMerging(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-extrabold text-[#431407] mb-4 text-center">Merge PDF Files</h1>
      <p className="text-slate-600 text-center mb-8">Combine multiple PDFs into one file instantly.</p>

      <div className="bg-white p-8 rounded-3xl shadow-lg border border-slate-100">
        <label className="border-2 border-dashed border-[#F97316] bg-[#FFF7ED] rounded-2xl p-10 flex flex-col items-center justify-center cursor-pointer hover:bg-[#FFEDD5] transition mb-6">
          <Upload className="text-[#F97316] mb-4" size={40} />
          <span className="text-lg font-semibold text-[#431407]">Click to upload PDFs</span>
          <span className="text-sm text-slate-500 mt-1">Select 2 or more files</span>
          <input type="file" multiple accept="application/pdf" className="hidden" onChange={handleFileChange} />
        </label>

        {files.length > 0 && (
          <div className="space-y-3 mb-6">
            {files.map((file, i) => (
              <div key={i} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="truncate font-medium text-slate-700">{file.name}</span>
                <button onClick={() => removeFile(i)} className="text-red-500 hover:bg-red-50 p-1 rounded"><X size={18}/></button>
              </div>
            ))}
          </div>
        )}

        <button 
          onClick={handleMerge} 
          disabled={merging || files.length < 2}
          className="w-full py-4 bg-[#F97316] text-white font-bold rounded-full hover:bg-[#EA580C] transition disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {merging ? <><Loader2 className="animate-spin" size={20}/> Merging...</> : <><Download size={20}/> Merge PDFs</>}
        </button>
      </div>
    </div>
  )
}