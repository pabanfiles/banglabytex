import { useState, useEffect, useRef } from 'react'
import { toast } from 'sonner'
import { Lock, LogOut, FileText, Settings, LayoutDashboard, Plus, X, BarChart3, Wrench, Eye, Menu, Save, Bold, Italic, Link as LinkIcon, Image as ImageIcon, Type, Trash2, Upload } from 'lucide-react'

export default function AdminPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [totpCode, setTotpCode] = useState('')
  const [show2FA, setShow2FA] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [isCreatingPost, setIsCreatingPost] = useState(false)
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  
  const [posts, setPosts] = useState<any[]>([])
  const [tools, setTools] = useState<any[]>([])
  const [stats, setStats] = useState({ visitors: 0, toolUsage: 0 })
  
  const [formData, setFormData] = useState({ title: '', slug: '', content: '', excerpt: '', thumbnail: '' })
  
  const [editingTool, setEditingTool] = useState<any>(null)
  const [toolFaqs, setToolFaqs] = useState<{q: string, a: string}[]>([])
  const [newPassword, setNewPassword] = useState('')

  // Media Upload States
  const [showMediaModal, setShowMediaModal] = useState(false)
  const [mediaUrl, setMediaUrl] = useState('')
  const [mediaText, setMediaText] = useState('')
  const [isUploading, setIsUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (username === 'admin' && password === 'Ppm@Demo2026') {
      setIsLoggedIn(true)
      toast.success('Welcome Admin!')
    } else {
      toast.error('Invalid credentials')
    }
  }

  useEffect(() => {
    if (isLoggedIn) {
      fetch('/api/analytics').then(r => r.json()).then(d => { if(d.visitors !== undefined) setStats(d) }).catch(()=>{})
      fetch('/api/posts').then(r => r.json()).then(d => { if(Array.isArray(d)) setPosts(d) }).catch(()=>{})
      fetch('/api/tools').then(r => r.json()).then(d => { if(Array.isArray(d)) setTools(d) }).catch(()=>{})
    }
  }, [isLoggedIn])

  // Free Image Upload via ImgBB (Demo Key - You should get your own)
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    
    const formDataUpload = new FormData()
    formDataUpload.append('image', file)
    
    try {
      // Using a public demo key for ImgBB
      const res = await fetch('https://api.imgbb.com/1/upload?key=c5b3a8d6d5e2a4d2e3f1a0b9c8d7e6f5', {
        method: 'POST',
        body: formDataUpload
      })
      const data = await res.json()
      if (data.success) {
        setMediaUrl(data.data.url)
        toast.success('Image uploaded!')
      } else {
        toast.error('Upload failed. Try pasting URL instead.')
      }
    } catch (err) {
      toast.error('Upload failed. Check internet.')
    } finally {
      setIsUploading(false)
    }
  }

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/posts', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(formData) })
    toast.success('Post published!')
    setIsCreatingPost(false)
    setFormData({ title: '', slug: '', content: '', excerpt: '', thumbnail: '' })
    fetch('/api/posts').then(r => r.json()).then(d => { if(Array.isArray(d)) setPosts(d) })
  }

  const insertMedia = () => {
    if (mediaUrl) {
      let html = ''
      if (mediaText) {
        html = `<a href="${mediaUrl}" target="_blank" className="text-orange-500 underline">${mediaText}</a>`
      } else {
        html = `<img src="${mediaUrl}" alt="Image" className="w-full rounded-lg my-4" />`
      }
      setFormData(prev => ({ ...prev, content: prev.content + '\n' + html + '\n' }))
      setShowMediaModal(false)
      setMediaUrl('')
      setMediaText('')
    }
  }

  const handleEditToolClick = (tool: any) => {
    setEditingTool(tool)
    try {
      const parsed = JSON.parse(tool.faq_json || '[]')
      setToolFaqs(Array.isArray(parsed) ? parsed : [])
    } catch { setToolFaqs([]) }
  }

  const handleUpdateTool = async (e: React.FormEvent) => {
    e.preventDefault()
    const dataToSave = { ...editingTool, faq_json: JSON.stringify(toolFaqs) }
    await fetch('/api/tools', { method: 'PUT', headers: {'Content-Type':'application/json'}, body: JSON.stringify(dataToSave) })
    toast.success('Tool updated!')
    setEditingTool(null)
    fetch('/api/tools').then(r => r.json()).then(d => { if(Array.isArray(d)) setTools(d) })
  }

  const addFaq = () => setToolFaqs([...toolFaqs, { q: '', a: '' }])
  const updateFaq = (index: number, field: 'q' | 'a', value: string) => {
    const newFaqs = [...toolFaqs]
    newFaqs[index][field] = value
    setToolFaqs(newFaqs)
  }
  const removeFaq = (index: number) => setToolFaqs(toolFaqs.filter((_, i) => i !== index))

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
            <input type="text" placeholder="Username" value={username} onChange={e => setUsername(e.target.value)} className="w-full p-3 border border-[#FFEDD5] rounded-xl outline-none" required />
            <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} className="w-full p-3 border border-[#FFEDD5] rounded-xl outline-none" required />
            
            {show2FA && (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <p className="text-sm font-semibold mb-2">Scan this QR Code with Google Authenticator</p>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=otpauth://totp/PPM%20Admin?secret=JBSWY3DPEHPK3PXP&issuer=PPMCreator" alt="2FA QR" className="mx-auto rounded-lg mb-3" />
                <input type="text" placeholder="Enter 6-digit code" value={totpCode} onChange={e => setTotpCode(e.target.value)} maxLength={6} className="w-full p-3 border border-slate-300 rounded-xl text-center font-mono text-lg tracking-widest outline-none" required />
              </div>
            )}
            
            <button type="submit" className="w-full py-3 bg-[#F97316] text-white font-bold rounded-xl hover:bg-[#ea580c]">{show2FA ? 'Verify & Login' : 'Login'}</button>
          </div>
        </form>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative">
      {/* Media Modal */}
      {showMediaModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Insert Link or Image</h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-semibold">Upload from Device</label>
                <div className="mt-1 flex gap-2">
                  <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileUpload} className="hidden" />
                  <button type="button" onClick={() => fileInputRef.current?.click()} className="flex-1 py-2 bg-slate-100 rounded-lg font-medium flex items-center justify-center gap-2 hover:bg-slate-200">
                    <Upload size={18}/> {isUploading ? 'Uploading...' : 'Choose Image'}
                  </button>
                </div>
              </div>
              
              <div className="relative text-center">
                <span className="bg-white px-2 text-xs text-slate-400 relative z-10">OR PASTE URL</span>
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-200"></div></div>
              </div>

              <div>
                <label className="text-sm font-semibold">Image / Link URL</label>
                <input type="text" value={mediaUrl} onChange={e => setMediaUrl(e.target.value)} placeholder="https://example.com/image.jpg" className="w-full p-2 border rounded mt-1" />
              </div>
              <div>
                <label className="text-sm font-semibold">Button Text (Leave empty for Image)</label>
                <input type="text" value={mediaText} onChange={e => setMediaText(e.target.value)} placeholder="Click here to buy..." className="w-full p-2 border rounded mt-1" />
              </div>
              <div className="flex gap-2 justify-end mt-6">
                <button onClick={() => setShowMediaModal(false)} className="px-4 py-2 text-slate-600 font-medium">Cancel</button>
                <button onClick={insertMedia} className="px-4 py-2 bg-[#F97316] text-white rounded font-bold">Insert</button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="md:hidden bg-white p-4 flex items-center justify-between border-b">
        <div className="text-xl font-bold text-[#431407]"><span className="text-[#F97316]">PPM</span> Admin</div>
        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)}><Menu /></button>
      </div>

      <div className={`w-full md:w-64 bg-white border-r border-slate-200 p-4 shrink-0 absolute md:relative top-16 md:top-0 h-[calc(100vh-64px)] md:h-screen z-30 transition-transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        <div className="hidden md:block text-xl font-bold text-[#431407] mb-8 px-4"><span className="text-[#F97316]">PPM</span> Admin</div>
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

      <div className="flex-1 p-6 md:p-10 h-screen overflow-y-auto">
        
        {activeTab === 'dashboard' && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Dashboard Overview</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-2xl border flex items-center justify-between">
                <div><p className="text-slate-500">Total Visitors</p><p className="text-3xl font-bold text-[#F97316]">{stats.visitors}</p></div>
                <BarChart3 size={40} className="text-[#FFEDD5]"/>
              </div>
              <div className="bg-white p-6 rounded-2xl border flex items-center justify-between">
                <div><p className="text-slate-500">Tool Usage</p><p className="text-3xl font-bold text-[#F97316]">{stats.toolUsage}</p></div>
                <Wrench size={40} className="text-[#FFEDD5]"/>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'posts' && !isCreatingPost && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Blog Posts</h1>
              <button onClick={() => setIsCreatingPost(true)} className="px-4 py-2 bg-[#F97316] text-white rounded-xl font-medium">+ New Post</button>
            </div>
            <div className="grid gap-4">
              {posts.map(post => (
                <div key={post.id} className="bg-white p-4 rounded-xl border flex justify-between items-center">
                  <div><p className="font-bold">{post.title}</p><p className="text-sm text-slate-500">/{post.slug}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'posts' && isCreatingPost && (
          <div className="bg-white p-6 rounded-2xl border">
            <div className="flex justify-between mb-6">
              <h1 className="text-2xl font-bold">Write New Post</h1>
              <button onClick={() => setIsCreatingPost(false)}><X size={24}/></button>
            </div>
            <form onSubmit={handleCreatePost} className="space-y-4">
              <div>
                <label className="text-sm font-semibold text-slate-700">Title</label>
                <input type="text" placeholder="Post Title" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full p-2 border rounded mt-1" required />
              </div>
              <div>
                <label className="text-sm font-semibold text-slate-700">Slug (URL)</label>
                <input type="text" placeholder="url-slug" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full p-2 border rounded mt-1" required />
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border">
                <h4 className="text-sm font-bold text-slate-700 mb-2">SEO Optimization</h4>
                <div className="space-y-3">
                  <div>
                    <label className="text-xs text-slate-500">Meta Title (Max 60 chars)</label>
                    <input type="text" placeholder="SEO Title" maxLength={60} className="w-full p-2 border rounded mt-1 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Meta Description (Max 160 chars)</label>
                    <textarea rows={2} placeholder="SEO Description" maxLength={160} className="w-full p-2 border rounded mt-1 text-sm" />
                  </div>
                </div>
              </div>
              
              {/* Thumbnail Upload */}
              <div>
                <label className="text-sm font-semibold mb-2 block">Thumbnail Image (Optional)</label>
                <div className="flex gap-2">
                  <input type="text" placeholder="Thumbnail URL (or upload below)" value={formData.thumbnail} onChange={e => setFormData({...formData, thumbnail: e.target.value})} className="flex-1 p-2 border rounded" />
                  <button type="button" onClick={() => {
                    setMediaUrl(formData.thumbnail);
                    setShowMediaModal(true);
                    setTimeout(() => {
                      const interval = setInterval(() => {
                        if (mediaUrl) { setFormData({...formData, thumbnail: mediaUrl}); clearInterval(interval); setShowMediaModal(false);}
                      }, 500);
                    }, 500);
                  }} className="px-4 py-2 bg-slate-100 rounded-lg font-medium"><Upload size={18}/></button>
                </div>
              </div>

              <div>
                <div className="flex gap-2 p-2 bg-slate-50 border border-b-0 rounded-t-lg">
                  <button type="button" onClick={() => insertTag('h1')} className="p-1 hover:bg-slate-200 rounded" title="Heading"><Type size={18}/></button>
                  <button type="button" onClick={() => insertTag('b')} className="p-1 hover:bg-slate-200 rounded font-bold" title="Bold"><Bold size={18}/></button>
                  <button type="button" onClick={() => insertTag('i')} className="p-1 hover:bg-slate-200 rounded italic" title="Italic"><Italic size={18}/></button>
                  
                  <div className="w-px h-6 bg-slate-300 mx-1"></div>
                  
                  <button type="button" onClick={() => setShowMediaModal(true)} className="p-1 hover:bg-slate-200 rounded text-slate-700" title="Add Link or Image"><LinkIcon size={18}/></button>
                  <button type="button" onClick={() => {setMediaUrl(''); setMediaText(''); setShowMediaModal(true);}} className="p-1 hover:bg-slate-200 rounded text-slate-700" title="Add Image"><ImageIcon size={18}/></button>
                </div>
                <textarea rows={10} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full p-4 border rounded-b-xl font-mono text-sm" placeholder="Write your post content here normally..." required />
              </div>
              
              <button type="submit" className="px-6 py-2 bg-[#F97316] text-white rounded font-bold">Publish</button>
            </form>
          </div>
        )}

        {activeTab === 'tools' && !editingTool && (
          <div>
            <h1 className="text-3xl font-bold mb-6">Manage Tools</h1>
            <div className="grid gap-4">
              {tools.map(tool => (
                <div key={tool.slug} className="bg-white p-4 rounded-xl border flex justify-between items-center">
                  <div><p className="font-bold">{tool.h1_title}</p><p className="text-sm text-slate-500">/{tool.slug}</p></div>
                  <button onClick={() => handleEditToolClick(tool)} className="px-4 py-2 bg-slate-100 rounded-lg hover:bg-slate-200">Edit</button>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'tools' && editingTool && (
          <div className="bg-white p-6 rounded-2xl border">
            <div className="flex justify-between mb-6">
              <h1 className="text-2xl font-bold">Edit Tool: {editingTool.slug}</h1>
              <button onClick={() => setEditingTool(null)}><X size={24}/></button>
            </div>
            <form onSubmit={handleUpdateTool} className="space-y-4">
              <div>
                <label className="font-semibold text-sm">H1 Title</label>
                <input type="text" value={editingTool.h1_title || ''} onChange={e => setEditingTool({...editingTool, h1_title: e.target.value})} className="w-full p-2 border rounded mt-1" />
              </div>
              <div>
                <label className="font-semibold text-sm">Intro Text</label>
                <textarea rows={3} value={editingTool.intro_text || ''} onChange={e => setEditingTool({...editingTool, intro_text: e.target.value})} className="w-full p-2 border rounded mt-1" />
              </div>
              
              <div className="border-t pt-4 mt-4">
                <div className="flex justify-between items-center mb-3">
                  <label className="font-semibold text-sm">FAQ</label>
                  <button type="button" onClick={addFaq} className="text-xs flex items-center gap-1 bg-emerald-50 text-emerald-600 px-2 py-1 rounded"><Plus size={14}/> Add FAQ</button>
                </div>
                {toolFaqs.map((faq, index) => (
                  <div key={index} className="bg-slate-50 p-3 rounded-xl mb-3 border relative">
                    <button type="button" onClick={() => removeFaq(index)} className="absolute top-2 right-2 text-red-500 hover:bg-red-50 p-1 rounded"><Trash2 size={16}/></button>
                    <div className="mb-2 pr-8">
                      <input type="text" value={faq.q} onChange={e => updateFaq(index, 'q', e.target.value)} className="w-full p-2 border rounded mt-1 text-sm" placeholder="Question" />
                    </div>
                    <div>
                      <textarea rows={2} value={faq.a} onChange={e => updateFaq(index, 'a', e.target.value)} className="w-full p-2 border rounded mt-1 text-sm" placeholder="Answer" />
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 border-t">
                <button type="submit" className="px-6 py-2 bg-[#F97316] text-white rounded font-bold flex items-center gap-2"><Save size={18}/> Save Changes</button>
              </div>
            </form>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-white p-6 rounded-2xl border max-w-lg">
            <h1 className="text-2xl font-bold mb-6">Settings</h1>
            <form onSubmit={handleChangePassword} className="space-y-4">
              <input type="password" placeholder="New Password" value={newPassword} onChange={e => setNewPassword(e.target.value)} className="w-full p-2 border rounded" required />
              <button type="submit" className="px-6 py-2 bg-[#F97316] text-white rounded">Update Password</button>
            </form>
          </div>
        )}

      </div>
    </div>
  )
}