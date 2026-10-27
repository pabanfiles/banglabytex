import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, FileText, Layers, Scissors, RotateCw, Trash2, Image as ImageIcon, Minimize2, Droplets, Hash, Lock, Unlock, ScanText, Type } from 'lucide-react'

const PDF_TOOLS = [
  { id: 'edit', name: 'Edit PDF Text', desc: 'Change text with live preview', icon: FileText, href: '/pdf-editor.html' },
  { id: 'merge', name: 'Merge PDF', desc: 'Combine multiple PDFs into one', icon: Layers, href: '/pdf-tools.html?tool=merge' },
  { id: 'split', name: 'Split PDF', desc: 'Separate one PDF into multiple files', icon: Scissors, href: '/pdf-tools.html?tool=split' },
  { id: 'rotate', name: 'Rotate PDF', desc: 'Rotate pages easily', icon: RotateCw, href: '/pdf-tools.html?tool=rotate' },
  { id: 'delete', name: 'Delete Pages', desc: 'Remove unwanted pages', icon: Trash2, href: '/pdf-tools.html?tool=del' },
  { id: 'compress', name: 'Compress PDF', desc: 'Reduce file size', icon: Minimize2, href: '/pdf-tools.html?tool=comp' },
  { id: 'watermark', name: 'Watermark', desc: 'Add text watermark', icon: Droplets, href: '/pdf-tools.html?tool=wm' },
  { id: 'pagenum', name: 'Page Numbers', desc: 'Add page numbers', icon: Hash, href: '/pdf-tools.html?tool=num' },
  { id: 'protect', name: 'Protect PDF', desc: 'Add password', icon: Lock, href: '/pdf-tools.html?tool=protect' },
  { id: 'unlock', name: 'Unlock PDF', desc: 'Remove password', icon: Unlock, href: '/pdf-tools.html?tool=unlock' },
  { id: 'ocr', name: 'OCR PDF', desc: 'Extract text from scans', icon: ScanText, href: '/pdf-tools.html?tool=ocr' },
  { id: 'pdf2text', name: 'PDF to Text', desc: 'Extract all text', icon: Type, href: '/pdf-tools.html?tool=txt' },
]

export default function PdfTools() {
  const [toolData, setToolData] = useState<any>(null)

  useEffect(() => {
    fetch('/api/tools')
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) {
          const pdfTool = data.find(t => t.slug === 'pdf-tools')
          if(pdfTool) setToolData(pdfTool)
        }
      })
      .catch(() => {})
  }, [])

  const dynamicTitle = toolData?.h1_title || 'PDF Tools'
  const dynamicIntro = toolData?.intro_text || 'All your PDF needs in one place.'
  
  let faqs = []
  try {
    faqs = JSON.parse(toolData?.faq_json || '[]')
  } catch(e) {}

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-[#431407] mb-4">📄 {dynamicTitle}</h1>
        <p className="text-slate-500 text-lg">{dynamicIntro}</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {PDF_TOOLS.map((tool) => {
          const Icon = tool.icon
          return (
            <a key={tool.id} href={tool.href} className="group bg-white p-6 rounded-2xl border border-[#FFEDD5] shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-[#F97316] transition-all duration-300 flex flex-col h-full">
              <div className="w-12 h-12 bg-[#FFF7ED] text-[#F97316] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-[#431407] mb-2 group-hover:text-[#F97316]">{tool.name}</h3>
              <p className="text-sm text-slate-500 flex-grow mb-4">{tool.desc}</p>
              <div className="flex items-center gap-2 text-[#F97316] font-semibold text-sm">
                Open Tool <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          )
        })}
      </div>

      {/* Dynamic FAQ Section */}
      {faqs.length > 0 && (
        <div className="mt-16 bg-white p-8 rounded-3xl border border-[#FFEDD5] shadow-sm">
          <h2 className="text-2xl font-bold text-[#431407] mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq: any, index: number) => (
              <div key={index}>
                <h3 className="text-lg font-bold text-slate-800">{faq.q}</h3>
                <p className="text-slate-600 mt-1">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}