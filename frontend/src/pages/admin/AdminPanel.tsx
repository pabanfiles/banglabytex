import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Lock, LogOut, FileText, Settings, LayoutDashboard, Plus, X, BarChart3, Wrench, Eye, Menu, Bold, Italic, Type, Link as LinkIcon, Image as ImageIcon, Save } from 'lucide-react'

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  // States
  const [posts, setPosts] = useState<any[]>([])
  const [tools, setTools] = useState<any[]>([])
  const [stats, setStats] = useState({ visitors: 0, toolUsage: 0 })
  const [editingTool, setEditingTool] = useState<any>(null)
  const [newPassword, setNewPassword] = useState('')
  const [formData, setFormData] = useState({ title: '', slug: '', content: '' })

  // Login
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === 'admin' && password === 'Ppm@Demo2026') {
      setIsLoggedIn(true)
      toast.success('Welcome Admin!')
    } else {
      toast.error('Invalid credentials')
    }
  }

  // Fetch Data
  useEffect(() => {
    if (isLoggedIn) {
      // Analytics
      fetch('/api/analytics').then(r => r.json()).then(d => { if(d.visitors !== undefined) setStats(d) }).catch(()=>{})
      // Posts
      fetch('/api/posts').then(r => r.json()).then(d => { if(Array.isArray(d)) setPosts(d) })
      // Tools
      fetch('/api/tools').then(r => r.json()).then(d => { if(Array.isArray(d)) setTools(d) })
    }
  }, [isLoggedIn])

  // Create Post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/posts', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(formData) })
    toast.success('Post published!')
    setIsCreatingPost(false)
    setFormData({ title: '', slug: '', content: '' })
  }

  // Update Tool
  const handleUpdateTool = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/tools', { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(editingTool) })
    toast.success('Tool updated!')
    setEditingTool(null)
  }

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/update-password', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ newPassword }) })
    toast.success('Password updated!')
    setNewPassword('')
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
        <div className="hidden md:block text-xl font-bold text-[#431407] mb-8 px-4"><span className="text-[#F97316]">PPM</span> Admin</div>
        <nav className="space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'posts', icon: FileText, label: 'Blog Posts' },
            { id: 'tools', icon: Wrench, label: 'Manage Tools' },
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center justify-between">
                <div><p className="text-slate-500">Total Live Visitors</p><p className="text-3xl font-bold text-[#F97316]">{stats.visitors}</p></div>
                <BarChart3 size={40} className="text-[#FFEDD5]"/>
              </div>
              <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center justify-between">
                <div><p className="text-slate-500">Total Tool Usage</p><p className="text-3xl font-bold text-[#F97316]">{stats.toolUsage}</p></div>
                <Wrench size={40} className="text-[#FFEDD5]"/>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'posts' && !isCreatingPost && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-slate-800">Blog Posts</h1>
              <button onClick={() => setIsCreatingPost(true)} className="flex items-center gap-2 px-4 py-2 bg-[#F97316] text-white rounded-xl font-medium"><Plus size={18}/> New Post</button>
            </div>
            <div className="grid gap-4">
              {posts.map(post => (
                <div key={post.id} className="bg-white p-4 rounded-xl border flex justify-between items-center">
                  <div><p className="font-bold">{post.title}</p><p className="text-sm text-slate-500">/{post.slug}</p></div>
                  <button className="text-blue-500"><Eye size={18}/></button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'posts' && isCreatingPost && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-slate-800">Write New Post</h1>
              <button onClick={() => setIsCreatingPost(false)}><X size={24}/></button>
            </div>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <input type="text" placeholder="Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded" required />
              <input type="text" placeholder="Slug" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full p-2 border rounded" required />
              <textarea rows={8} placeholder="Content here..." value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full p-4 border rounded" required />
              <button type="submit" className="px-6 py-2 bg-[#F97316] text-white rounded">Publish</button>
            </form>
          </div>
        )}

        {activeTab === 'tools' && !editingTool && (
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Manage Tools</h1>
            <div className="space-y-4">
              {tools.map(tool => (
                <div key={tool.slug} className="bg-white p-4 rounded-xl border flex justify-between items-center">
                  <div><p className="font-bold">{tool.h1_title}</p><p className="text-sm text-slate-500">/{tool.slug}</p></div>
                  <button onClick={() => setEditingTool(tool)} className="px-4 py-2 bg-slate-100 font-medium rounded-lg hover:bg-slate-200">Edit</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tools' && editingTool && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-slate-800">Edit Tool: {editingTool.slug}</h1>
              <button onClick={() => setEditingTool(null)}><X size={24}/></button>
            </div>
            <form onSubmit={handleUpdateTool} className="space-y-4">
              <div>
                <label className="text-sm font-semibold">H1 Title</label>
                <input type="text" value={editingTool.h1_title} onChange={e => setEditingTool({...editingTool, h1_title: e.target.value})} className="w-full p-2 border rounded mt-1" />
              </div>
              <div>
                <label className="text-sm font-semibold">Intro Text</label>
                <textarea rows={4} value={editingTool.intro_text} onChange={e => setEditingTool({...editingTool, intro_text: e.target.value})} className="w-full p-2 border rounded mt-1" />
              </div>
              <button type="submit" className="px-6 py-2 bg-[#F97316] text-white rounded">Save Changes</button>
            </form>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border max-w-lg">
            <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="text-sm font-semibold">Change Password</label>
                <input type="password" placeholder="Enter new password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-2 border rounded mt-1" required />
              </div>
              <button type="submit" className="px-6 py-2 bg-[#F97316] text-white rounded">Update Password</button>
            </form>
          </div>
        )}

      </div>
    </div>
  )
}