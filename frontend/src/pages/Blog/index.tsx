import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

export default function Blog() {
  const [posts, setPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/posts')
      .then(res => res.json())
      .then(data => { if(Array.isArray(data)) setPosts(data) })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-extrabold text-[#431407] mb-8 text-center">PPM Creator Blog</h1>
      
      {loading ? (
        <p className="text-center text-slate-500">Loading posts...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {posts.map(post => (
            <div key={post.slug} className="bg-white rounded-3xl shadow-sm border border-[#FFEDD5] overflow-hidden hover:shadow-xl transition-all group">
              {/* Thumbnail Image */}
              {post.thumbnail && (
                <div className="h-48 w-full overflow-hidden bg-slate-100">
                  <img src={post.thumbnail} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                </div>
              )}
              
              <div className="p-6">
                <p className="text-sm text-[#F97316] font-semibold mb-2">{new Date(post.created_at).toLocaleDateString()}</p>
                <h2 className="text-2xl font-bold text-[#431407] mb-3 group-hover:text-[#F97316] transition-colors line-clamp-2">{post.title}</h2>
                <p className="text-slate-500 mb-4 line-clamp-3">{post.excerpt || 'Click to read more...'}</p>
                <Link to={`/blog/${post.slug}`} className="text-[#F97316] font-semibold flex items-center gap-2">Read Article &rarr;</Link>
              </div>
            </div>
          ))}
          {posts.length === 0 && <p className="col-span-2 text-center text-slate-500">No posts published yet.</p>}
        </div>
      )}
    </div>
  )
}