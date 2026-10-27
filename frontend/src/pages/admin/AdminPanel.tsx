import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Lock, LogOut, FileText, Settings, LayoutDashboard, Plus, X } from 'lucide-react'

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')

  // Post Manager State
  const [posts, setPosts] = useState<any[]>([])
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({ title: '', slug: '', content: '', excerpt: '', meta_title: '', meta_description: '' })

  // Fetch Posts
  const fetchPosts = async () => {
    try {
      const res = await fetch('/api/posts')
      const data = await res.json()
      if (Array.isArray(data)) setPosts(data)
    } catch (err) {
      toast.error('Failed to load posts')
    }
  }

  useEffect(() => {
    if (isLoggedIn) fetchPosts()
  }, [isLoggedIn])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      if (res.ok) {
        setIsLoggedIn(true)
        toast.success('Login successful!')
      } else {
        toast.error('Invalid credentials')
      }
    } catch (err) {
      toast.error('Network error')
    }
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        toast.success('Post created successfully!')
        setIsCreating(false)
        setFormData({ title: '', slug: '', content: '', excerpt: '', meta_title: '', meta_description: '' })
        fetchPosts()
      } else {
        toast.error('Failed to create post')
      }
    } catch (err) {
      toast.error('Network error')
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFF7ED] px-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-md border border-[#FFEDD5]">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-[#FFF7ED] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Lock className="text-[#F97316]" size={32} />
            </div>
            <h1 className="text-2xl font-bold text-[#431407]">Admin Login</h1>
          </div>
          <div className="space-y-4">
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-3 border border-[#FFEDD5] rounded-xl outline-none focus:ring-2 focus:ring-[#F97316]" required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 border border-[#FFEDD5] rounded-xl outline-none focus:ring-2 focus:ring-[#F97316]" required />
            <button type="submit" className="w-full py-3 bg-[#F97316] text-white font-bold rounded-xl hover:bg-[#ea580c] transition">Login</button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white border-r border-slate-200 p-4">
        <div className="text-xl font-bold text-[#431407] mb-8 px-4">Admin Panel</div>
        <nav className="space-y-2">
          <button onClick={() => { setActiveTab('dashboard'); setIsCreating(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${activeTab === 'dashboard' ? 'bg-[#FFF7ED] text-[#F97316]' : 'text-slate-600 hover:bg-slate-50'}`}><LayoutDashboard size={18}/> Dashboard</button>
          <button onClick={() => { setActiveTab('posts'); setIsCreating(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${activeTab === 'posts' ? 'bg-[#FFF7ED] text-[#F97316]' : 'text-slate-600 hover:bg-slate-50'}`}><FileText size={18}/> Blog Posts</button>
        </nav>
        <button onClick={() => setIsLoggedIn(false)} className="w-full mt-8 flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 font-medium hover:bg-red-50"><LogOut size={18}/> Logout</button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 md:p-10">
        {activeTab === 'dashboard' && (
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border shadow-sm"><p className="text-slate-500">Total Published Posts</p><p className="text-3xl font-bold text-[#F97316]">{posts.length}</p></div>
            </div>
          </div>
        )}

        {activeTab === 'posts' && !isCreating && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-slate-800">Blog Posts</h1>
              <button onClick={() => setIsCreating(true)} className="flex items-center gap-2 px-4 py-2 bg-[#F97316] text-white rounded-xl font-medium"><Plus size={18}/> New Post</button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b">
                  <tr><th className="p-4">Title</th><th className="p-4">Slug</th><th className="p-4">Date</th></tr>
                </thead>
                <tbody>
                  {posts.map(post => (
                    <tr key={post.id} className="border-b hover:bg-slate-50">
                      <td className="p-4 font-medium">{post.title}</td>
                      <td className="p-4 text-slate-500">/{post.slug}</td>
                      <td className="p-4 text-sm text-slate-500">{new Date(post.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                  {posts.length === 0 && <tr><td colSpan={3} className="p-6 text-center text-slate-500">No posts yet. Create one!</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'posts' && isCreating && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-slate-800">Create New Post</h1>
              <button onClick={() => setIsCreating(false)} className="text-slate-400 hover:text-red-500"><X size={24}/></button>
            </div>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold">Title</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded-lg mt-1" required />
                </div>
                <div>
                  <label className="text-sm font-semibold">Slug (URL)</label>
                  <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} className="w-full p-2 border rounded-lg mt-1" required />
                </div>
              </div>
              <div>
                <label className="text-sm font-semibold">Excerpt (Short Desc)</label>
                <input type="text" value={formData.excerpt} onChange={e => setFormData({...formData, excerpt: e.target.value})} className="w-full p-2 border rounded-lg mt-1" />
              </div>
              <div>
                <label className="text-sm font-semibold">Content</label>
                <textarea rows={6} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full p-2 border rounded-lg mt-1" required />
              </div>
              <button type="submit" className="px-6 py-2 bg-[#F97316] text-white font-bold rounded-lg">Publish Post</button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}