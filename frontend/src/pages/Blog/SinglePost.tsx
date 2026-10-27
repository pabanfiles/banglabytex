import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function SinglePost() {
  const { slug } = useParams()
  const [post, setPost] = useState<any>(null)
  const [relatedPosts, setRelatedPosts] = useState<any[]>([])

  useEffect(() => {
    fetch(`/api/posts`)
      .then(res => res.json())
      .then(data => {
        const found = data.find((p: any) => p.slug === slug)
        setPost(found)
        
        // রিলেটেড পোস্ট (বর্তমান পোস্ট বাদে অন্য ৩টি)
        if(found) {
          const others = data.filter((p: any) => p.slug !== slug).slice(0, 3)
          setRelatedPosts(others)
        }
      })
  }, [slug])

  if (!post) return <div className="text-center py-20 text-slate-500">Loading or Not Found...</div>

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <Link to="/blog" className="text-[#F97316] font-semibold mb-6 inline-block hover:underline">&larr; Back to Blog</Link>
      
      {post.thumbnail && (
        <img src={post.thumbnail} alt={post.title} className="w-full h-64 md:h-96 object-cover rounded-2xl mb-8 shadow-md" />
      )}

      <h1 className="text-4xl font-extrabold text-[#431407] mb-4">{post.title}</h1>
      <p className="text-sm text-slate-500 mb-8">{new Date(post.created_at).toLocaleDateString()}</p>
      
      {/* Content */}
      <div 
        className="prose prose-lg text-slate-700 leading-relaxed whitespace-pre-wrap font-sans mb-12"
        dangerouslySetInnerHTML={{ __html: post.content }} 
      />

      {/* CTA Tools */}
      <div className="bg-[#FFF7ED] border border-[#FFEDD5] rounded-2xl p-6 mb-12">
        <h3 className="text-xl font-bold text-[#431407] mb-4">Try Our Free Tools</h3>
        <div className="flex flex-wrap gap-3">
          <Link to="/pdf-tools" className="px-4 py-2 bg-white rounded-lg font-semibold text-[#F97316] shadow-sm hover:shadow-md transition">PDF Tools</Link>
          <Link to="/image-tools" className="px-4 py-2 bg-white rounded-lg font-semibold text-[#F97316] shadow-sm hover:shadow-md transition">Image Tools</Link>
          <Link to="/video-downloader" className="px-4 py-2 bg-white rounded-lg font-semibold text-[#F97316] shadow-sm hover:shadow-md transition">Video Downloader</Link>
        </div>
      </div>

      {/* Related Posts */}
      {relatedPosts.length > 0 && (
        <div className="border-t border-slate-200 pt-8">
          <h3 className="text-2xl font-bold text-[#431407] mb-6">Related Articles</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {relatedPosts.map(rp => (
              <Link key={rp.id} to={`/blog/${rp.slug}`} className="block p-4 bg-white rounded-xl border border-slate-100 hover:border-[#F97316] transition-colors group">
                <h4 className="font-bold text-slate-800 group-hover:text-[#F97316] mb-1 line-clamp-2">{rp.title}</h4>
                <p className="text-xs text-slate-500">{new Date(rp.created_at).toLocaleDateString()}</p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}