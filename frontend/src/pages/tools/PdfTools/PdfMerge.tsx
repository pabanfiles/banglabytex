import { ExternalLink } from 'lucide-react'
import { useToolData } from '@/hooks/useToolData'
import ToolPageLayout from '@/components/ToolPageLayout'

export default function PdfMerge() {
  const { toolData, faqs, relatedPosts } = useToolData('pdf-merge')

  return (
    <ToolPageLayout 
      title={toolData?.h1_title || 'Merge PDF Files Online Free'}
      description={toolData?.intro_text || 'Combine multiple PDF documents into one single file easily.'}
      category="PDF Tools"
      faqs={faqs}
      relatedPosts={relatedPosts}
    >
      <div className="bg-white dark:bg-slate-800 p-10 rounded-3xl shadow-lg border border-[#FFEDD5] dark:border-slate-700 text-center transition-colors">
        <h2 className="text-2xl font-bold text-[#431407] dark:text-white mb-4">Ready to merge your PDFs?</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-8">Click the button below to open our secure PDF merging tool.</p>
        <a href="/pdf-tools.html?tool=merge" className="inline-flex items-center gap-2 px-10 py-4 bg-[#F97316] text-white font-bold rounded-full shadow-xl hover:bg-[#EA580C] transition">
          Open Merge Tool <ExternalLink size={18}/>
        </a>
      </div>
    </ToolPageLayout>
  )
}