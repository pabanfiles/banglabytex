import { useState, useEffect } from 'react'
import { toast } from 'sonner'
import { Lock, LogOut, FileText, Settings, LayoutDashboard, Plus, X, BarChart3, Wrench, Eye, Menu, Save } from 'lucide-react'

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  // Data States
  const [posts, setPosts] = useState<any[]>([])
  const [tools, setTools] = useState<any[]>([])
  const [stats, setStats] = useState({ visitors: 0, toolUsage: 0 })
  
  // Form States
  const [formData, setFormData] = useState({ title: '', slug: '', content: '', excerpt: '', meta_title: '', meta_description: '' })
  const [editingTool, setEditingTool] = useState<any>(null)
  const [newPassword, setNewPassword] = useState('')

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

  // Fetch Data
  useEffect(() => {
    if (isLoggedIn) {
      fetch('/api/analytics').then(r => r.json()).then(d => { if(d.visitors !== undefined) setStats(d) }).catch(()=>{})
      fetch('/api/posts').then(r => r.json()).then(d => { if(Array.isArray(d)) setPosts(d) }).catch(()=>{})
      fetch('/api/tools').then(r => r.json()).then(d => { if(Array.isArray(d)) setTools(d) }).catch(()=>{})
    }
  }, [isLoggedIn])

  // Create Post
  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/posts', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(formData) })
      toast.success('Post published successfully!')
      setIsCreatingPost(false)
      setFormData({ title: '', slug: '', content: '', excerpt: '', meta_title: '', meta_description: '' })
      fetch('/api/posts').then(r => r.json()).then(d => { if(Array.isArray(d)) setPosts(d) })
    } catch(err) {
      toast.error('Failed to save post')
    }
  }

  // Update Tool
  const handleUpdateTool = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/tools', { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(editingTool) })
      toast.success('Tool updated!')
      setEditingTool(null)
    } catch(err) {
      toast.error('Failed to update tool')
    }
  }

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/update-password', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ newPassword }) })
      toast.success('Password updated!')
      setNewPassword('')
    } catch(err) {
      toast.error('Failed to update password')
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
        <div className="hidden md:block text-xl font-bold text-[#431407] mb-8 px-4">
          <span className="text-[#F97316]">PPM</span> Admin
        </div>
        <nav className="space-y-2">
          {[
            { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
            { id: 'posts', icon: FileText, label: 'Blog Posts' },
            { id: 'tools', icon: Wrench, label: 'Manage Tools' },
            { id: 'settings', icon: Settings, label: 'Settings' },
          ].map(item => (
            <button key={item.id} onClick={() => { setActiveTab(item.id); setIsCreatingPost(false); setIsSidebarOpen(false); setEditingTool(null); }} className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium ${activeTab === item.id ? 'bg-[#FFF7ED] text-[#F97316]' : 'text-slate-600 hover:bg-slate-50'}`}>
              <item.icon size={18}/> {item.label}
            </button>
          ))}
        </nav>
        <button onClick={() => setIsLoggedIn(false)} className="w-full mt-8 flex items-center gap-3 px-4 py-3 rounded-xl text-red-600 font-medium hover:bg-red-50"><LogOut size={18}/> Logout</button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 md:p-10 h-screen overflow-y-auto">
        
        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-slate-500">Total Live Visitors</p>
                  <p className="text-3xl font-bold text-[#F97316]">{stats.visitors}</p>
                </div>
                <BarChart3 size={40} className="text-[#FFEDD5]"/>
              </div>
              <div className="bg-white p-6 rounded-2xl border shadow-sm flex items-center justify-between">
                <div>
                  <p className="text-slate-500">Total Tool Usage</p>
                  <p className="text-3xl font-bold text-[#F97316]">{stats.toolUsage}</p>
                </div>
                <Wrench size={40} className="text-[#FFEDD5]"/>
              </div>
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === 'posts' && !isCreatingPost && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold text-slate-800">Blog Posts</h1>
              <button onClick={() => setIsCreatingPost(true)} className="flex items-center gap-2 px-4 py-2 bg-[#F97316] text-white rounded-xl font-medium"><Plus size={18}/> New Post</button>
            </div>
            <div className="grid gap-4">
              {posts.map(post => (
                <div key={post.id} className="bg-white p-4 rounded-xl border flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800">{post.title}</p>
                    <p className="text-sm text-slate-500">/{post.slug}</p>
                  </div>
                  <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg"><Eye size={18}/></button>
                </div>
              ))}
              {posts.length === 0 && <p className="text-slate-500 text-center py-4">No posts yet.</p>}
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
              <div>
                <label className="text-sm font-semibold text-slate-700">Post Title</label>
                <input type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-3 border rounded-xl mt-1" required />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">URL Slug</label>
                <input type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value.toLowerCase().replace(/ /g, '-')})} className="w-full p-3 border rounded-xl mt-1" required />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Content (HTML/Text)</label>
                <textarea rows={10} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full p-4 border rounded-xl font-mono text-sm mt-1" placeholder="Write your content here... <h2>Heading</h2> <p>Paragraph</p>" required />
              </div>
              <button type="submit" className="px-6 py-3 bg-[#F97316] text-white font-bold rounded-lg hover:bg-[#ea580c] flex items-center gap-2"><Save size={18}/> Publish Post</button>
            </form>
          </div>
        )}

        {/* Tools Tab */}
        {activeTab === 'tools' && !editingTool && (
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-6">Manage Tools</h1>
            <div className="grid gap-4">
              {tools.map(tool => (
                <div key={tool.slug} className="bg-white p-4 rounded-xl border flex justify-between items-center">
                  <div>
                    <p className="font-bold text-slate-800">{tool.h1_title}</p>
                    <p className="text-sm text-slate-500">/{tool.slug}</p>
                  </div>
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
              <button onClick={() => setEditingTool(null)} className="text-slate-400 hover:text-red-500"><X size={24}/></button>
            </div>
            <form onSubmit={handleUpdateTool} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">H1 Title</label>
                <input type="text" value={editingTool.h1_title} onChange={e => setEditingTool({...editingTool, h1_title: e.target.value})} className="w-full p-3 border rounded-xl mt-1" />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Intro Text</label>
                <textarea rows={4} value={editingTool.intro_text} onChange={e => setEditingTool({...editingTool, intro_text: e.target.value})} className="w-full p-3 border rounded-xl mt-1" />
              </div>
              <button type="submit" className="px-6 py-3 bg-[#F97316] text-white font-bold rounded-lg flex items-center gap-2"><Save size={18}/> Save Changes</button>
            </form>
          </div>
        )}

        {/* Settings Tab */}
        {activeTab === 'settings' && (
          <div className="bg-white p-6 rounded-2xl shadow-sm border max-w-lg">
            <h1 className="text-2xl font-bold mb-6">Account Settings</h1>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">New Password</label>
                <input type="password" placeholder="Enter new password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-3 border rounded-xl mt-1" required />
              </div>
              <button type="submit" className="px-6 py-3 bg-[#F97316] text-white font-bold rounded-lg flex items-center gap-2"><Save size={18}/> Update Password</button>
            </form>
          </div>
        )}

      </div>
    </div>
  )
}