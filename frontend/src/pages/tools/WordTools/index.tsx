import { ArrowRight, FileText, FileSpreadsheet, FileInput } from 'lucide-react'

const WORD_TOOLS = [
  { id: 'pdf2docx', name: 'PDF to Word', desc: 'Editable .docx file', icon: FileText, href: '/pdf-tools.html?tool=pdf2docx' },
  { id: 'pdf2xlsx', name: 'PDF to Excel', desc: 'Extract tables to .xlsx', icon: FileSpreadsheet, href: '/pdf-tools.html?tool=pdf2xlsx' },
  { id: 'office2pdf', name: 'Office to PDF', desc: 'Word/Excel/PPT to PDF', icon: FileInput, href: '/pdf-tools.html?tool=office2pdf' },
]

export default function WordTools() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">📝 Word & Office Tools</h1>
        <p className="text-slate-500">Convert documents easily.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {WORD_TOOLS.map((tool) => {
          const Icon = tool.icon
          return (
            <a key={tool.id} href={tool.href} className="group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 hover:border-emerald-500 transition-all duration-300 flex flex-col h-full">
              <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-emerald-600">{tool.name}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">{tool.desc}</p>
              <div className="mt-auto">
                <div className="inline-flex items-center justify-center gap-2 bg-emerald-500 group-hover:bg-emerald-600 text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-colors shadow-md shadow-emerald-500/20 w-full">
                  Open Tool <ArrowRight size={16} />
                </div>
              </div>
            </a>
          )
        })}
      </div>
    </div>
  )
}