import { useState, useRef } from 'react'
import { Upload, Download } from 'lucide-react'
import { toast } from 'sonner'
import ToolPageLayout from '@/components/ToolPageLayout'
import { useToolData } from '@/hooks/useToolData'

export default function MemeGenerator() {
  const { toolData, faqs, relatedPosts } = useToolData('meme-generator')
  const [file, setFile] = useState<File | null>(null)
  const [topText, setTopText] = useState('')
  const [bottomText, setBottomText] = useState('')
  const canvasRef = useRef<HTMLCanvasElement>(null)

  const drawMeme = () => {
    if(!file) return toast.error('Select an image first')
    const img = new Image()
    img.src = URL.createObjectURL(file)
    img.onload = () => {
      const canvas = canvasRef.current
      if(!canvas) return
      const ctx = canvas.getContext('2d')
      if(!ctx) return
      
      canvas.width = img.width
      canvas.height = img.height
      ctx.drawImage(img, 0, 0)
      
      ctx.font = 'bold 50px Impact, sans-serif'
      ctx.fillStyle = 'white'
      ctx.strokeStyle = 'black'
      ctx.lineWidth = 3
      ctx.textAlign = 'center'
      
      if(topText) {
        ctx.textBaseline = 'top'
        ctx.strokeText(topText.toUpperCase(), canvas.width/2, 20)
        ctx.fillText(topText.toUpperCase(), canvas.width/2, 20)
      }
      if(bottomText) {
        ctx.textBaseline = 'bottom'
        ctx.strokeText(bottomText.toUpperCase(), canvas.width/2, canvas.height - 20)
        ctx.fillText(bottomText.toUpperCase(), canvas.width/2, canvas.height - 20)
      }
      toast.success('Meme generated!')
    }
  }

  const handleDownload = () => {
    const canvas = canvasRef.current
    if(!canvas) return
    const a = document.createElement('a'); a.href = canvas.toDataURL('image/png'); a.download = 'meme.png'; a.click()
    toast.success('Downloaded!')
  }

  return (
    <ToolPageLayout title={toolData?.h1_title || 'Meme Generator'} description={toolData?.intro_text || 'Create funny memes with custom text.'} category="Image Tools" faqs={faqs} relatedPosts={relatedPosts}>
      <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 max-w-2xl mx-auto">
        <label className="border-2 border-dashed border-[#F97316] bg-[#FFF7ED] dark:bg-slate-900 rounded-2xl p-10 flex flex-col items-center cursor-pointer mb-6">
          <Upload className="text-[#F97316] mb-2" size={32} />
          <span className="text-lg font-semibold text-[#431407] dark:text-white">Select Image</span>
          <input type="file" accept="image/*" className="hidden" onChange={e => { if(e.target.files) setFile(e.target.files[0]) }} />
        </label>
        
        {file && (
          <div className="space-y-4 mb-6">
            <input type="text" placeholder="Top Text" value={topText} onChange={e => setTopText(e.target.value)} className="w-full p-3 border rounded-xl" />
            <input type="text" placeholder="Bottom Text" value={bottomText} onChange={e => setBottomText(e.target.value)} className="w-full p-3 border rounded-xl" />
            <button onClick={drawMeme} className="w-full py-3 bg-slate-800 text-white rounded-xl font-bold">Preview Meme</button>
            <canvas ref={canvasRef} className="w-full rounded-xl shadow" />
          </div>
        )}
        
        <button onClick={handleDownload} disabled={!file} className="w-full py-4 bg-[#F97316] text-white font-bold rounded-full disabled:opacity-50">
          <Download size={18} className="inline mr-2"/> Download Meme
        </button>
      </div>
    </ToolPageLayout>
  )
}