import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Lock, LogOut, FileText, Settings, LayoutDashboard, Plus, X, BarChart3, ToolCase, Eye, Menu, Image as ImageIcon, Bold, Italic, Heading1, Heading2, Link as LinkIcon } from 'lucide-react'

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  const [posts, setPosts] = useState<any[]>([])
  const [stats, setStats] = useState({ visitors: 1245, toolUsage: 847 })
  
  const [formData, setFormData] = useState({ title: '', slug: '', content: '', excerpt: '', meta_title: '', meta_description: '' })

  // Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === 'admin' && password === 'Ppm@Demo2026') {
      setIsLoggedIn(true)
      toast.success('Welcome back, Admin!')
    } else {
      toast.error('Invalid credentials')
    }
  }

  // Fetch Posts
  useEffect(() => {
    if (isLoggedIn) {
      fetch('/api/posts').then(r => r.json()).then(d => { if(Array.isArray(d)) setPosts(d) })
    }
  }, [isLoggedIn])

  // Create Post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })
      if (res.ok) {
        toast.success('Post published successfully!')
        setIsCreatingPost(false)
        setFormData({ title: '', slug: '', content: '', excerpt: '', meta_title: '', meta_description: '' })
        fetch('/api/posts').then(r => r.json()).then(d => { if(Array.isArray(d)) setPosts(d) })
      } else {
        toast.error('Failed to save post')
      }
    } catch (err) {
      toast.error('Network error')
    }
  }

  // Insert HTML tag into content (Rich text simulation)
  const insertTag = (tag: string) => {
    setFormData(prev => ({ ...prev, content: prev.content + ` <${tag}></${tag}> ` }))
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
            <button type="submit" className="w-full py-3 bg-[#F97316] text-white font-bold rounded-xl hover:bg-[#ea580c] transition">Login to Dashboard</button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative">
      
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white p-4 flex items-center justify-between border-b">
        <div className="text-xl font-bold text-[#431407]"><span className="text-[#F97316]">PPM</span> Admin</div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}><Menu /></button>
      </div>

      {/* Sidebar */}
      <div className={`w-full md:w-64 bg-white border-r border-slate-200 p-4 shrink-0 absolute md:relative top-16 md:top-0 h-[calc(100vh-64px)] md:h-screen z-30 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="hidden md:block text-xl font-bold text-[#431407] mb-8 px-4 flex items-center gap-2">
          <span className="text-[#F97316]">PPM</span> Admin
        </div>
        <nav className="space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'posts', icon: FileText, label: 'Blog Posts' },
            { id: 'tools', icon: ToolCase, label: 'Manage Tools' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setIsCreatingPost(false); setIsSidebarOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${activeTab === item.id ? 'bg-[#FFF7ED] text-[#F97316]' : 'text-slate-600 hover:bg-slate-50'}`}>
              <item.icon size={18}/> {item.label}
            </button>
          ))}
        </nav>
        <button onClick={() => setIsLoggedIn(false)} className="w-full mt-8 flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 font-medium hover:bg-red-50"><LogOut size={18}/> Logout</button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 h-screen overflow-y-auto">
        
        {activeTab === 'dashboard' && (
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border shadow-sm"><p className="text-slate-500">Total Visitors</p><p className="text-3xl font-bold text-[#F97316]">{stats.visitors}</p></div>
              <div className="bg-white p-6 rounded-2xl border shadow-sm"><p className="text-slate-500">Tool Usage</p><p className="text-3xl font-bold text-[#F97316]">{stats.toolUsage}</p></div>
              <div className="bg-white p-6 rounded-2xl border shadow-sm"><p className="text-slate-500">Published Posts</p><p className="text-3xl font-bold text-[#F97316]">{posts.length}</p></div>
            </div>
          </div>
        )}

        {activeTab === 'posts' && !isCreatingPost && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-slate-800">Blog Posts</h1>
              <button onClick={() => setIsCreatingPost(true)} className="flex items-center gap-2 px-4 py-2 bg-[#F97316] text-white rounded-xl font-medium"><Plus size={18}/> New Post</button>
            </div>
            <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
              <table className="w-full text-left">
                <thead className="bg-slate-50 border-b"><tr><th className="p-4">Title</th><th className="p-4">Slug</th></tr></thead>
                <tbody>
                  {posts.map(post => (
                    <tr key={post.id} className="border-b hover:bg-slate-50"><td className="p-4 font-medium">{post.title}</td><td className="p-4 text-slate-500">/{post.slug}</td></tr>
                  ))}
                  {posts.length === 0 && <tr><td colSpan={2} className="p-6 text-center text-slate-500">No posts yet.</td></tr>}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'posts' && isCreatingPost && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-slate-800">Write New Post</h1>
              <button onClick={() => setIsCreatingPost(false)} className="text-slate-400 hover:text-red-500"><X size={24}/></button>
            </div>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-semibold">Post Title</label>
                  <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded-lg mt-1" required />
                </div>
                <div>
                  <label className="text-sm font-semibold">URL Slug</label>
                  <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} className="w-full p-2 border rounded-lg mt-1" required />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-semibold mb-2 block">Post Content (Rich Text / HTML)</label>
                
                {/* Fake Rich Text Toolbar */}
                <div className="flex gap-2 p-2 bg-slate-50 border border-b-0 rounded-t-lg flex-wrap">
                  <button type="button" onClick={() => insertTag('h1')} className="p-1 hover:bg-slate-200 rounded" title="Heading 1"><Heading1 size={18}/></button>
                  <button type="button" onClick={() => insertTag('h2')} className="p-1 hover:bg-slate-200 rounded" title="Heading 2"><Heading2 size={18}/></button>
                  <div className="w-px h-6 bg-slate-300 mx-1"></div>
                  <button type="button" onClick={() => insertTag('b')} className="p-1 hover:bg-slate-200 rounded font-bold" title="Bold"><Bold size={18}/></button>
                  <button type="button" onClick={() => insertTag('i')} className="p-1 hover:bg-slate-200 rounded italic" title="Italic"><Italic size={18}/></button>
                  <div className="w-px h-6 bg-slate-300 mx-1"></div>
                  <button type="button" onClick={() => insertTag('a href=""')} className="p-1 hover:bg-slate-200 rounded" title="Link"><LinkIcon size={18}/></button>
                  <button type="button" onClick={() => insertTag('img src="" alt="image"')} className="p-1 hover:bg-slate-200 rounded" title="Image"><ImageIcon size={18}/></button>
                </div>

                <textarea rows={12} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full p-4 border rounded-b-xl font-mono text-sm focus:ring-2 focus:ring-[#F97316] outline-none" placeholder="Write your blog content here..."></textarea>
              </div>

              <div className="pt-4">
                <button type="submit" className="px-6 py-3 bg-[#F97316] text-white font-bold rounded-lg hover:bg-[#ea580c]">Publish Post</button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'tools' && (
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Manage Tools</h1>
            <div className="bg-white rounded-2xl shadow-sm border p-6">
              <p className="text-slate-500 mb-4">Edit tool titles and descriptions.</p>
              <div className="space-y-4">
                {['PDF Tools', 'Image Tools', 'Video Downloader'].map(tool => (
                  <div key={tool} className="flex justify-between items-center p-4 border rounded-xl">
                    <span className="font-bold">{tool}</span>
                    <button className="px-4 py-2 bg-slate-100 font-medium rounded-lg hover:bg-slate-200">Edit</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border max-w-lg">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            <input type="password" placeholder="New Password" className="w-full p-2 border rounded mb-4" />
            <button className="px-6 py-2 bg-[#F97316] text-white rounded">Update</button>
          </div>
        )}

      </div>
    </div>
  )
}