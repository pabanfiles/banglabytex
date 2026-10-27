import { useState } from 'react'
import { toast } from 'sonner'
import { Upload, Download } from 'lucide-react'
import ToolPageLayout from '@/components/ToolPageLayout'
import { useToolData } from '@/hooks/useToolData'

export default function OfficeToPdf() {
  const { toolData, faqs, relatedPosts } = useToolData('office-to-pdf')
  const [file, setFile] = useState<File | null>(null)

  const handleConvert = async () => {
    if(!file) return toast.error('Select a file')
    toast.success('Conversion requires backend. (Coming Soon)')
  }

  return (
    <ToolPageLayout title={toolData?.h1_title || 'Word / Excel to PDF'} description={toolData?.intro_text || 'Convert Office documents to PDF easily.'} category="Converters" faqs={faqs} relatedPosts={relatedPosts}>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 max-w-2xl mx-auto">
        <label className="border-2 border-dashed border-[#F97316] bg-[#FFF7ED] dark:bg-slate-900 rounded-2xl p-10 flex flex-col items-center cursor-pointer mb-6">
          <Upload className="text-[#F97316] mb-2" size={32} />
          <span className="text-lg font-semibold text-[#431407] dark:text-white">Select Word/Excel File</span>
          <input type="file" accept=".doc,.docx,.xls,.xlsx" className="hidden" onChange={e => { if(e.target.files) setFile(e.target.files[0]) }} />
        </label>
        {file && <p className="mb-4 text-slate-600 dark:text-slate-400">Selected: {file.name}</p>}
        <button onClick={handleConvert} disabled={!file} className="w-full py-4 bg-[#F97316] text-white font-bold rounded-full disabled:opacity-50">
          <Download size={18} className="inline mr-2"/> Convert to PDF
        </button>
      </div>
    </ToolPageLayout>
  )
}