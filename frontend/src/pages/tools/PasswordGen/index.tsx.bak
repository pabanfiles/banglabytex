import { useState } from 'react'
import { Copy, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import ToolPageLayout from '@/components/ToolPageLayout'
import { useToolData } from '@/hooks/useToolData'

export default function PasswordGen() {
  const { toolData, faqs, relatedPosts } = useToolData('password-generator')
  const [pass, setPass] = useState('')
  const [len, setLen] = useState(16)

  const generate = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()'
    let p = ''
    for (let i = 0; i < len; i++) p += chars.charAt(Math.floor(Math.random() * chars.length))
    setPass(p)
  }

  return (
    <ToolPageLayout title={toolData?.h1_title || 'Password Generator'} description={toolData?.intro_text || 'Create strong, random passwords instantly.'} category="Utility" faqs={faqs} relatedPosts={relatedPosts}>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 max-w-2xl mx-auto">
        <div className="flex items-center gap-2 mb-6">
          <input readOnly value={pass} className="flex-1 p-4 border rounded-xl font-mono text-lg" placeholder="Click Generate..." />
          <button onClick={() => { navigator.clipboard.writeText(pass); toast.success('Copied!') }} className="p-4 bg-slate-800 text-white rounded-xl"><Copy size={18}/></button>
        </div>
        <div className="mb-6">
          <label className="text-sm font-semibold">Length: {len}</label>
          <input type="range" min="8" max="32" value={len} onChange={e => setLen(Number(e.target.value))} className="w-full" />
        </div>
        <button onClick={generate} className="w-full py-4 bg-[#F97316] text-white font-bold rounded-full flex items-center justify-center gap-2"><RefreshCw size={18}/> Generate Password</button>
      </div>
    </ToolPageLayout>
  )
}