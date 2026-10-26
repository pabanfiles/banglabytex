import { ArrowRight, Image as ImageIcon, Minimize2, RotateCw } from 'lucide-react'

const IMAGE_TOOLS = [
  { id: 'img2pdf', name: 'Image to PDF', desc: 'Convert JPG/PNG to PDF', icon: ImageIcon, href: '/pdf-tools.html?tool=img2pdf' },
  { id: 'pdf2img', name: 'PDF to Image', desc: 'Extract pages as JPG/PNG', icon: ImageIcon, href: '/pdf-tools.html?tool=pdf2img' },
  { id: 'img-compress', name: 'Compress Image', desc: 'Reduce file size (Coming Soon)', icon: Minimize2, href: '#' },
  { id: 'img-resize', name: 'Resize Image', desc: 'Change dimensions (Coming Soon)', icon: ImageIcon, href: '#' },
  { id: 'img-convert', name: 'Image Converter', desc: 'PNG, JPG, WebP (Coming Soon)', icon: RotateCw, href: '#' },
]

export default function ImageTools() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-extrabold text-slate-900 mb-4">🖼️ Image Tools</h1>
        <p className="text-slate-500">Convert, compress and resize images.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {IMAGE_TOOLS.map((tool) => {
          const Icon = tool.icon
          const isComingSoon = tool.href === '#'
          const Wrapper = isComingSoon ? 'div' : 'a'
          const props = isComingSoon ? {} : { href: tool.href }
          return (
            <Wrapper key={tool.id} {...props} className={`group bg-white p-6 rounded-2xl border border-slate-100 shadow-sm transition-all duration-300 flex flex-col h-full ${isComingSoon ? 'opacity-60 cursor-not-allowed' : 'hover:shadow-xl hover:-translate-y-1 hover:border-emerald-500'}`}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${isComingSoon ? 'bg-slate-100 text-slate-400' : 'bg-emerald-50 text-emerald-500 group-hover:scale-110 transition-transform'}`}>
                <Icon size={24} />
              </div>
              <h3 className={`text-lg font-bold mb-2 ${isComingSoon ? 'text-slate-700' : 'text-slate-900 group-hover:text-emerald-600'}`}>{tool.name}</h3>
              <p className="text-sm text-slate-500 flex-grow mb-4">{tool.desc}</p>
              {!isComingSoon && <div className="flex items-center gap-2 text-emerald-500 font-semibold text-sm">Open Tool <ArrowRight size={16} /></div>}
            </Wrapper>
          )
        })}
      </div>
    </div>
  )
}