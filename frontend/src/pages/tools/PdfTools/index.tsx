import { Link } from 'react-router-dom'
import { ArrowRight, FileText, Layers, Scissors, RotateCw, Trash2, Image as ImageIcon, Droplets, Hash, Type, Minimize2, Lock, Unlock, ScanText, FileSpreadsheet } from 'lucide-react'

const PDF_TOOLS = [
  { id: 'edit', name: 'Edit PDF Text', desc: 'Change text with live preview', icon: FileText, href: '/pdf-editor.html' },
  { id: 'merge', name: 'Merge PDF', desc: 'Combine multiple PDFs into one', icon: Layers, href: '/pdf-tools.html' },
  { id: 'split', name: 'Split PDF', desc: 'Separate one PDF into multiple files', icon: Scissors, href: '/pdf-tools.html' },
  { id: 'rotate', name: 'Rotate PDF', desc: 'Rotate all or specific pages', icon: RotateCw, href: '/pdf-tools.html' },
  { id: 'delete', name: 'Delete Pages', desc: 'Remove unwanted pages', icon: Trash2, href: '/pdf-tools.html' },
  { id: 'img2pdf', name: 'Images to PDF', desc: 'Convert JPG/PNG to PDF', icon: ImageIcon, href: '/pdf-tools.html' },
  { id: 'pdf2img', name: 'PDF to Images', desc: 'Extract pages as images', icon: ImageIcon, href: '/pdf-tools.html' },
  { id: 'watermark', name: 'Watermark', desc: 'Add text watermark', icon: Droplets, href: '/pdf-tools.html' },
  { id: 'pagenum', name: 'Page Numbers', desc: 'Add page numbers automatically', icon: Hash, href: '/pdf-tools.html' },
  { id: 'pdf2text', name: 'PDF to Text', desc: 'Extract text from PDF', icon: Type, href: '/pdf-tools.html' },
  { id: 'compress', name: 'Compress PDF', desc: 'Reduce file size without losing quality', icon: Minimize2, href: '/pdf-tools.html' },
  { id: 'protect', name: 'Protect PDF', desc: 'Add password to PDF', icon: Lock, href: '/pdf-tools.html' },
  { id: 'unlock', name: 'Unlock PDF', desc: 'Remove password from PDF', icon: Unlock, href: '/pdf-tools.html' },
  { id: 'ocr', name: 'OCR PDF', desc: 'Extract text from scanned PDFs', icon: ScanText, href: '/pdf-tools.html' },
  { id: 'convert', name: 'PDF to Word/Excel', desc: 'Convert to editable formats', icon: FileSpreadsheet, href: '/pdf-tools.html' },
]

export default function PdfTools() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4">
          📄 All PDF <span className="text-emerald-500">Tools</span>
        </h1>
        <p className="text-lg text-slate-500 max-w-2xl mx-auto">
          Free, fast, and secure PDF tools. Files never leave your browser.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {PDF_TOOLS.map((tool) => {
          const Icon = tool.icon;
          return (
            <a 
              key={tool.id} 
              href={tool.href}
              className="group bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
            >
              <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Icon size={28} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 group-hover:text-emerald-600 transition-colors mb-2">{tool.name}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">{tool.desc}</p>
              <div className="mt-auto">
                <div className="inline-flex items-center justify-center gap-2 bg-emerald-500 group-hover:bg-emerald-600 text-white px-5 py-2.5 rounded-full font-semibold text-sm transition-colors shadow-md shadow-emerald-500/20 w-full">
                  Open Tool <ArrowRight size={16} />
                </div>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  )
}