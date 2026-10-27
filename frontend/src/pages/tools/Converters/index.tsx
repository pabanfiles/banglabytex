import { Link } from 'react-router-dom'
import { ArrowRight, FileText, FileSpreadsheet, Code, FileJson, FileCode } from 'lucide-react'

const CONVERTER_TOOLS = [
  { id: 'word-to-excel', name: 'Word to Excel', desc: 'Convert Word docs to Excel sheets.', icon: FileSpreadsheet, link: '/word-tools' },
  { id: 'csv-to-json', name: 'CSV to JSON', desc: 'Convert CSV data to JSON format.', icon: FileJson, link: '/csv-to-json' },
  { id: 'html-to-text', name: 'HTML to Text', desc: 'Remove HTML tags and get plain text.', icon: Code, link: '/html-to-text' },
  { id: 'excel-convert', name: 'Excel Converter', desc: 'Convert Excel to CSV and vice versa.', icon: FileSpreadsheet, link: '/excel-convert' },
  { id: 'pdf-to-word', name: 'PDF to Word', desc: 'Convert PDF files to editable Word.', icon: FileText, link: '/word-tools' },
  { id: 'pdf-to-excel', name: 'PDF to Excel', desc: 'Convert PDF tables to Excel.', icon: FileSpreadsheet, link: '/word-tools' },
]

export default function Converters() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-[#431407] mb-4">🔄 Converters</h1>
        <p className="text-slate-500 text-lg">Convert documents and data between different formats easily.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CONVERTER_TOOLS.map((tool) => {
          const Icon = tool.icon
          return (
            <Link 
              key={tool.id} 
              to={tool.link}
              className="group bg-white p-8 rounded-3xl border border-[#FFEDD5] shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
            >
              <div className="w-14 h-14 bg-[#FFF7ED] text-[#F97316] rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform">
                <Icon size={28} />
              </div>
              <h3 className="text-xl font-bold text-[#431407] mb-2 group-hover:text-[#F97316] transition-colors">{tool.name}</h3>
              <p className="text-slate-500 text-sm flex-grow mb-6">{tool.desc}</p>
              <div className="mt-auto">
                <div className="inline-flex items-center justify-center gap-2 bg-[#F97316] group-hover:bg-[#ea580c] text-white px-6 py-2.5 rounded-full font-semibold text-sm transition-colors w-full">
                  Use Tool <ArrowRight size={16} />
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}