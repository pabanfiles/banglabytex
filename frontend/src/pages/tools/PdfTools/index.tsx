import { useToolsData } from '@/hooks/useToolsData'
import { ArrowRight, FileText, Layers, Scissors, RotateCw, Trash2, Minimize2, Droplets, Hash, Lock, Unlock, ScanText, Type } from 'lucide-react'

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
  const { getToolBySlug, loading } = useToolsData()`n  const tool = getToolBySlug('pdf-tools')`n  const dynamicTitle = tool?.h1_title || 'PDF Tools'`n  const dynamicIntro = tool?.intro_text || 'All your PDF needs in one place.'

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">📄 PDF Tools</h1>
        <p className="text-slate-500">All your PDF needs in one place.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {PDF_TOOLS.map((tool) => {
          const Icon = tool.icon
          return (
            <a key={tool.id} href={tool.href} className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-emerald-500 transition-all duration-300 flex flex-col h-full">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Icon size={24} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-emerald-600">{tool.name}</h3>
              <p className="text-sm text-slate-500 flex-grow mb-4">{tool.desc}</p>
              <div className="flex items-center gap-2 text-emerald-500 font-semibold text-sm">
                Open Tool <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}