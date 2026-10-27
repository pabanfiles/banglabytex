import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'

export default function SinglePost() {
  const { slug } = useParams()
  const [post, setPost] = useState<any>(null)

  useEffect(() => {
    fetch(`/api/posts`)
      .then(res => res.json())
      .then(data => {
        const found = data.find((p: any) => p.slug === slug)
        setPost(found)
      })
  }, [slug])

  if (!post) return <div className="text-center py-20">Loading or Not Found...</div>

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <Link to="/blog" className="text-[#F97316] font-semibold mb-6 inline-block hover:underline">&larr; Back to Blog</Link>
      
      <h1 className="text-4xl font-extrabold text-[#431407] mb-4">{post.title}</h1>
      <p className="text-sm text-slate-500 mb-8">{new Date(post.created_at).toLocaleDateString()}</p>
      
      {/* HTML ট্যাগ ছাড়া শুধু সাধারণ টেক্সট (Newline সাপোর্ট করবে) */}
      <div className="text-slate-700 leading-relaxed text-lg whitespace-pre-wrap font-sans">
        {post.content}
      </div>
    </div>
  )
}