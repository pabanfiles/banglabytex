import { useState } from 'react'
import { toast } from 'sonner'
import { Upload, Download } from 'lucide-react'
import ToolPageLayout from '@/components/ToolPageLayout'
import { useToolData } from '@/hooks/useToolData'

export default function CsvToJson() {
  const { toolData, faqs, relatedPosts } = useToolData('csv-to-json')
  const [file, setFile] = useState<File | null>(null)

  const handleConvert = async () => {
    if(!file) return toast.error('Select a CSV file')
    const text = await file.text()
    const lines = text.split('\n').filter(l => l.trim())
    const headers = lines[0].split(',').map(h => h.trim())
    const json = lines.slice(1).map(line => {
      const values = line.split(',')
      const obj: any = {}
      headers.forEach((h, i) => { obj[h] = values[i]?.trim() || '' })
      return obj
    })
    const blob = new Blob([JSON.stringify(json, null, 2)], { type: 'application/json' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'data.json'; a.click()
    toast.success('Converted!')
  }

  return (
    <ToolPageLayout title={toolData?.h1_title || 'CSV to JSON Converter'} description={toolData?.intro_text || 'Convert CSV data to JSON format.'} category="Converters" faqs={faqs} relatedPosts={relatedPosts}>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 max-w-2xl mx-auto">
        <label className="border-2 border-dashed border-[#F97316] bg-[#FFF7ED] dark:bg-slate-900 rounded-2xl p-10 flex flex-col items-center cursor-pointer mb-6">
          <Upload className="text-[#F97316] mb-2" size={32} />
          <span className="text-lg font-semibold text-[#431407] dark:text-white">Select CSV File</span>
          <input type="file" accept=".csv" className="hidden" onChange={e => { if(e.target.files) setFile(e.target.files[0]) }} />
        </label>
        {file && <p className="mb-4 text-slate-600 dark:text-slate-400">Selected: {file.name}</p>}
        <button onClick={handleConvert} disabled={!file} className="w-full py-4 bg-[#F97316] text-white font-bold rounded-full disabled:opacity-50">
          <Download size={18} className="inline mr-2"/> Convert to JSON
        </button>
      </div>
    </ToolPageLayout>
  )
}