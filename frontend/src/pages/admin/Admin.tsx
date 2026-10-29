import { useState } from 'react'
import { toast } from 'sonner'
import { Plus, Trash2, Edit } from 'lucide-react'

export default function Admin() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (email === 'admin@ppmcreator.com' && pass === 'admin123') {
      setIsLoggedIn(true)
      toast.success('Welcome to Admin Panel')
    } else {
      toast.error('Invalid credentials')
    }
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center bg-slate-100 p-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
          <h2 className="text-2xl font-bold text-center text-slate-900 mb-6">Admin Login</h2>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-slate-700">Email</label>
              <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full mt-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="admin@ppmcreator.com" />
            </div>
            <div>
              <label className="text-sm font-medium text-slate-700">Password</label>
              <input type="password" required value={pass} onChange={e => setPass(e.target.value)} className="w-full mt-1 px-4 py-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-brand-500 outline-none" placeholder="••••••••" />
            </div>
            <button type="submit" className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 mt-2">Login</button>
          </div>
          <p className="text-xs text-center text-slate-400 mt-4">Demo: admin@ppmcreator.com / admin123</p>
        </form>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
        <button onClick={() => setIsLoggedIn(false)} className="text-sm text-red-600 font-medium">Logout</button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium">Total Tools</h3>
          <p className="text-4xl font-bold text-slate-900 mt-2">2</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium">Total Visitors</h3>
          <p className="text-4xl font-bold text-slate-900 mt-2">1,245</p>
        </div>
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="text-slate-500 text-sm font-medium">Active Status</h3>
          <p className="text-4xl font-bold text-green-600 mt-2">Online</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900">Manage Tools</h2>
          <button onClick={() => toast.info('Add Tool Modal — Coming Soon')} className="px-4 py-2 bg-brand-600 text-white rounded-lg flex items-center gap-2 text-sm font-medium hover:bg-brand-700">
            <Plus size={16} /> Add New Tool
          </button>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="px-6 py-4">Tool Name</th>
              <th className="px-6 py-4">Slug</th>
              <th className="px-6 py-4">Category</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            <tr>
              <td className="px-6 py-4 font-medium text-slate-900">Video Downloader</td>
              <td className="px-6 py-4 text-slate-500">/video-downloader</td>
              <td className="px-6 py-4"><span className="px-2 py-1 bg-purple-50 text-purple-700 rounded text-xs font-medium">Media</span></td>
              <td className="px-6 py-4 text-right flex justify-end gap-2">
                <button className="p-2 text-slate-400 hover:text-brand-600"><Edit size={16}/></button>
                <button className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
              </td>
            </tr>
            <tr>
              <td className="px-6 py-4 font-medium text-slate-900">PDF Editor</td>
              <td className="px-6 py-4 text-slate-500">/pdf-editor</td>
              <td className="px-6 py-4"><span className="px-2 py-1 bg-blue-50 text-blue-700 rounded text-xs font-medium">Productivity</span></td>
              <td className="px-6 py-4 text-right flex justify-end gap-2">
                <button className="p-2 text-slate-400 hover:text-brand-600"><Edit size={16}/></button>
                <button className="p-2 text-slate-400 hover:text-red-600"><Trash2 size={16}/></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}