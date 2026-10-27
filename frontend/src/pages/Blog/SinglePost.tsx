import { useParams, Link } from 'react-router-dom'

export default function SinglePost() {
  const { slug } = useParams()

  // ডেমো ডেটা (পরে ডাটাবেস থেকে আসবে)
  const post = {
    title: slug === 'merge-pdf-files-free' ? 'How to Merge PDF Files for Free' : 'Article Title',
    date: 'Oct 26, 2026',
    content: 'This is the full article content. In a real scenario, this would be fetched from the Cloudflare D1 database based on the slug. You can write hundreds of words here for SEO purposes.'
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <Link to="/blog" className="text-[#F97316] font-semibold mb-6 inline-block hover:underline">&larr; Back to Blog</Link>
      
      <h1 className="text-4xl font-extrabold text-[#431407] mb-4">{post.title}</h1>
      <p className="text-sm text-slate-500 mb-8">{post.date}</p>
      
      <div className="prose prose-lg text-slate-700 leading-relaxed">
        <p>{post.content}</p>
      </div>
    </div>
  )
}