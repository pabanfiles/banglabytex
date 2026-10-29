import { useState } from 'react'
import { Upload, Download, Lock } from 'lucide-react'
import { toast } from 'sonner'
import ToolPageLayout from '@/components/ToolPageLayout'
import { useToolData } from '@/hooks/useToolData'

export default function PdfProtect() {
  const { toolData, faqs, relatedPosts } = useToolData('pdf-protect')
  const [file, setFile] = useState<File | null>(null)
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleProtect = async () => {
    if (!file || !password) return toast.error('Select file and enter password')
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('password', password)
      
      const res = await fetch('https://bangla-pdf-backend.onrender.com/api/pdf/protect', {
        method: 'POST',
        body: formData
      })
      if (!res.ok) throw new Error('Protection failed')
      
      const blob = await res.blob()
      const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'protected.pdf'; a.click()
      toast.success('PDF Protected successfully!')
    } catch (err) {
      toast.error('Failed to protect PDF. Check backend connection.')
    } finally { setLoading(false) }
  }

  return (
    <ToolPageLayout title={toolData?.h1_title || 'Protect PDF with Password'} description={toolData?.intro_text || 'Add a strong password to your PDF.'} category="PDF Tools" faqs={faqs} relatedPosts={relatedPosts}>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 max-w-2xl mx-auto">
        <label className="border-2 border-dashed border-[#F97316] bg-[#FFF7ED] dark:bg-slate-900 rounded-2xl p-10 flex flex-col items-center cursor-pointer mb-6">
          <Upload className="text-[#F97316] mb-2" size={32} />
          <span className="text-lg font-semibold text-[#431407] dark:text-white">Select PDF File</span>
          <input type="file" accept="application/pdf" className="hidden" onChange={e => { if(e.target.files) setFile(e.target.files[0]) }} />
        </label>
        
        {file && <p className="mb-4 text-slate-600 dark:text-slate-400">Selected: {file.name}</p>}
        
        <input 
          type="password" 
          placeholder="Enter Password" 
          value={password} 
          onChange={e => setPassword(e.target.value)} 
          className="w-full p-4 border rounded-xl mb-4 dark:bg-slate-900 dark:border-slate-700 dark:text-white" 
        />
        
        <button 
          onClick={handleProtect} 
          disabled={loading || !file || !password} 
          className="w-full py-4 bg-[#F97316] text-white font-bold rounded-full disabled:opacity-50 flex justify-center items-center gap-2"
        >
          {loading ? 'Processing...' : <><Lock size={18}/> Protect PDF</>}
        </button>
      </div>
    </ToolPageLayout>
  )
}