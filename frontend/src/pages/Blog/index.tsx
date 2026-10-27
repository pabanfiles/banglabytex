import { Link } from 'react-router-dom'

export default function Blog() {
  const posts = [
    { title: 'How to Merge PDF Files for Free', slug: 'merge-pdf-files-free', date: 'Oct 26, 2026', desc: 'Learn how to combine multiple PDF files into one single document easily without spending money on expensive software.' },
    { title: 'How to Compress Images Without Losing Quality', slug: 'compress-images-without-quality-loss', date: 'Oct 25, 2026', desc: 'Speed up your website and save storage space by optimizing your images properly using our free tools.' },
    { title: 'Why You Need a CV Maker in 2026', slug: 'why-use-cv-maker', date: 'Oct 24, 2026', desc: 'Create professional, stand-out resumes in minutes using our live-preview CV builder.' }
  ]

  return (
    <div className="max-w-5xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-extrabold text-[#431407] mb-8 text-center">PPM Creator Blog</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {posts.map(post => (
          <div key={post.slug} className="bg-white rounded-3xl shadow-sm border border-[#FFEDD5] p-6 hover:shadow-xl transition-all group">
            <p className="text-sm text-[#F97316] font-semibold mb-2">{post.date}</p>
            <h2 className="text-2xl font-bold text-[#431407] mb-3 group-hover:text-[#F97316] transition-colors">{post.title}</h2>
            <p className="text-slate-500 mb-4">{post.desc}</p>
            <Link to={`/blog/${post.slug}`} className="text-[#F97316] font-semibold flex items-center gap-2">Read Article &rarr;</Link>
          </div>
        ))}
      </div>
    </div>
  )
}