import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { LogOut, User } from 'lucide-react'
import { toast } from 'sonner'

export default function Profile() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    fetch('/api/auth/profile')
      .then(res => {
        if (!res.ok) throw new Error('Not logged in')
        return res.json()
      })
      .then(data => setUser(data))
      .catch(() => navigate('/login'))
      .finally(() => setLoading(false))
  }, [navigate])

  const handleLogout = () => {
    document.cookie = 'user_email=; Max-Age=0; path=/;'
    toast.success('Logged out!')
    navigate('/')
  }

  if (loading) return <div className="text-center py-20">Loading profile...</div>
  if (!user) return null

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-700 p-8 text-center">
        <img src={user.avatar_url} alt="Avatar" className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-[#F97316]" />
        <h1 className="text-2xl font-bold text-[#431407] dark:text-white">{user.name}</h1>
        <p className="text-slate-500 mb-6">{user.email}</p>
        <div className="bg-slate-50 dark:bg-slate-900 rounded-xl p-4 mb-6">
          <p className="text-sm text-slate-500">Logged in via <b>{user.provider}</b></p>
          <p className="text-sm text-slate-500">Joined: {new Date(user.created_at).toLocaleDateString()}</p>
        </div>
        <button onClick={handleLogout} className="px-6 py-3 bg-red-500 text-white font-bold rounded-full hover:bg-red-600 flex items-center gap-2 mx-auto">
          <LogOut size={18}/> Logout
        </button>
      </div>
    </div>
  )
}