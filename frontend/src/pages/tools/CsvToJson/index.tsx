import { useState } from 'react'
import { Copy } from 'lucide-react'
import { toast } from 'sonner'

export default function CsvToJson() {
  const [csv, setCsv] = useState('Name,Age,City\nJohn,25,NY\nJane,30,LA')
  const [json, setJson] = useState('')

  const convert = () => {
    try {
      const lines = csv.trim().split('\n').map(l => l.trim()).filter(Boolean)
      if (lines.length < 2) return toast.error('Need header and data')
      const headers = lines[0].split(',').map(h => h.trim())
      const result = lines.slice(1).map(line => {
        const values = line.split(',')
        const obj: any = {}
        headers.forEach((h, i) => { obj[h] = values[i]?.trim() || '' })
        return obj
      })
      setJson(JSON.stringify(result, null, 2))
      toast.success('Converted to JSON!')
    } catch (e) { toast.error('Invalid CSV') }
  }

  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-extrabold text-center mb-8">CSV to JSON</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-3xl shadow-sm border">
          <label className="font-semibold text-slate-700">CSV Data</label>
          <textarea value={csv} onChange={e => setCsv(e.target.value)} rows={10} className="w-full mt-2 p-4 border rounded-xl font-mono text-sm bg-slate-50" />
          <button onClick={convert} className="w-full mt-4 px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl">Convert to JSON</button>
        </div>
        <div className="bg-white p-6 rounded-3xl shadow-sm border">
          <div className="flex justify-between items-center">
            <label className="font-semibold text-slate-700">JSON Output</label>
            {json && <button onClick={() => { navigator.clipboard.writeText(json); toast.success('Copied!') }} className="text-emerald-600 text-sm flex items-center gap-1"><Copy size={14}/> Copy</button>}
          </div>
          <textarea value={json} readOnly rows={10} className="w-full mt-2 p-4 border rounded-xl font-mono text-sm bg-slate-900 text-emerald-400" />
        </div>
      </div>
    </div>
  )
}