import { Link } from 'react-router-dom'
import { ChevronRight, BookOpen } from 'lucide-react'

interface ToolPageLayoutProps {
  title: string
  description: string
  category: string
  faqs: { q: string, a: string }[]
  relatedPosts: any[]
  children: React.ReactNode
}

export default function ToolPageLayout({ title, description, category, faqs, relatedPosts, children }: ToolPageLayoutProps) {
  return (
    <div className="max-w-4xl mx-auto py-12 px-4">
      {/* Breadcrumb */}
      <div className="text-sm text-slate-500 mb-4 flex items-center gap-1">
        <Link to="/" className="hover:text-[#F97316]">Home</Link> 
        <ChevronRight size={14}/> 
        <span className="text-[#F97316]">{category}</span>
        <ChevronRight size={14}/> 
        <span className="text-slate-400">{title}</span>
      </div>

      {/* Header */}
      <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-[#431407] dark:text-white">{title}</h1>
      <p className="text-lg text-slate-600 dark:text-slate-300 mb-8">{description}</p>

      {/* Main Tool UI */}
      <div className="mb-16">
        {children}
      </div>

      {/* FAQ Section */}
      {faqs.length > 0 && (
        <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-[#FFEDD5] dark:border-slate-700 shadow-sm mb-12 transition-colors">
          <h2 className="text-2xl font-bold text-[#431407] dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-slate-100 dark:border-slate-700 pb-4 last:border-0">
                <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-2">{faq.q}</h3>
                <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Related Blog Posts */}
      {relatedPosts.length > 0 && (
        <div className="mb-12">
          <div className="flex items-center gap-2 mb-6">
            <BookOpen className="text-[#F97316]" size={24}/>
            <h2 className="text-2xl font-bold text-[#431407] dark:text-white">Related Articles</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedPosts.map(post => (
              <Link key={post.id} to={`/blog/${post.slug}`} className="bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:border-[#F97316] transition-colors group">
                <h3 className="font-bold text-slate-800 dark:text-white group-hover:text-[#F97316] mb-1 line-clamp-2">{post.title}</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">{new Date(post.created_at).toLocaleDateString()}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}