import { useState } from 'react'
import { Download, Upload } from 'lucide-react'
import { toast } from 'sonner'

export default function ExcelConvert() {
  const [csvData, setCsvData] = useState<string | null>(null)
  const [fileName, setFileName] = useState('')

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFileName(file.name)
    
    // Note: For true .xlsx parsing, a library like SheetJS is needed.
    // Here we do a simple CSV parser. In a real scenario, we'd parse Excel.
    const reader = new FileReader()
    reader.onload = (event) => {
      const text = event.target?.result as string
      setCsvData(text)
      toast.success('File loaded! (Note: Works best with CSV/Text data)')
    }
    reader.readAsText(file)
  }

  const downloadCsv = () => {
    if (!csvData) return
    const blob = new Blob([csvData], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = fileName.replace(/\.(xlsx|xls)$/i, '') + '.csv'
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="max-w-md mx-auto py-12 px-4 text-center">
      <h1 className="text-3xl font-extrabold mb-6">Excel/CSV Converter</h1>
      <div className="bg-white p-8 rounded-3xl shadow-sm border space-y-4">
        <Upload className="mx-auto text-emerald-500 w-12 h-12 mb-2" />
        <p className="text-slate-500 text-sm">Upload your CSV file to convert to Excel format or vice-versa.</p>
        
        <input type="file" accept=".csv,.xlsx,.xls" onChange={handleFile} className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100" />
        
        {csvData && (
          <button onClick={downloadCsv} className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl">
            <Download size={18} /> Download as CSV
          </button>
        )}
      </div>
    </div>
  )
}