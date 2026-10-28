import { Link } from 'react-router-dom'
import { ChevronRight, BookOpen, ChevronDown, ChevronUp } from 'lucide-react'
import { useState } from 'react'

interface ToolPageLayoutProps {
  title: string
  description: string
  category: string
  faqs: { q: string, a: string }[]
  relatedPosts: any[]
  children: React.ReactNode
}

export default function ToolPageLayout({ title, description, category, faqs, relatedPosts, children }: ToolPageLayoutProps) {
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0)

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index)
  }

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
      <div className="mb-8">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400 font-medium mb-2">
          <span className="text-2xl">⚡</span> PPM Creator Tools 
          <span className="text-[#F97316]">| {title}</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-extrabold mb-4 text-[#431407] dark:text-white">{title}</h1>
        <p className="text-lg text-slate-600 dark:text-slate-300">{description}</p>
      </div>

      {/* Main Tool UI */}
      <div className="mb-16">
        {children}
      </div>

      {/* SEO Content Block (Replaces the blog system for tools) */}
      <div className="prose prose-slate dark:prose-invert max-w-none mb-16 bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-sm">
        <h2 className="text-2xl font-bold text-[#431407] dark:text-white mb-4">Why Choose PPM Creator for {title}?</h2>
        <p className="text-slate-600 dark:text-slate-400 mb-4">
          At PPM Creator Tools, we prioritize your privacy and speed. Our {title} processes your files directly in your browser (or securely via our optimized servers), ensuring your data never gets leaked. Whether you are a student, a professional, or just someone looking to get things done quickly, this tool is designed for you.
        </p>
        <h3 className="text-xl font-bold text-[#431407] dark:text-white mb-2">How to use {title}?</h3>
        <ol className="list-decimal pl-5 text-slate-600 dark:text-slate-400 mb-4 space-y-2">
          <li>Select or drop your file into the designated area above.</li>
          <li>Adjust the settings or parameters if applicable.</li>
          <li>Click the action button to process your file.</li>
          <li>Download your final result instantly.</li>
        </ol>
        <p className="text-slate-600 dark:text-slate-400">
          Looking for other tools? Try our <Link to="/pdf-merge" className="text-[#F97316] hover:underline">Merge PDF</Link>, <Link to="/image-compress" className="text-[#F97316] hover:underline">Image Compressor</Link>, or <Link to="/video-downloader" className="text-[#F97316] hover:underline">Video Downloader</Link> for all your daily needs. 
        </p>
      </div>

      {/* FAQ Section (Dropdown Accordion) */}
      {faqs.length > 0 && (
        <div className="bg-white dark:bg-slate-800 p-6 md:p-8 rounded-3xl border border-[#FFEDD5] dark:border-slate-700 shadow-sm mb-12 transition-colors">
          <h2 className="text-2xl font-bold text-[#431407] dark:text-white mb-6">Frequently Asked Questions</h2>
          <div className="space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                <button 
                  onClick={() => toggleFaq(index)}
                  className="w-full flex justify-between items-center p-4 text-left font-bold text-slate-800 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-700 transition"
                >
                  <span>{faq.q}</span>
                  {openFaqIndex === index ? <ChevronUp size={20} className="text-[#F97316]"/> : <ChevronDown size={20} className="text-slate-400"/>}
                </button>
                {openFaqIndex === index && (
                  <div className="p-4 pt-0 text-slate-600 dark:text-slate-400 border-t border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-800/50">
                    {faq.a}
                  </div>
                )}
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