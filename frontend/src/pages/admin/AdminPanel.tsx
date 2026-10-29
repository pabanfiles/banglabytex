import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import PostsTab from './tabs/PostsTab'
import EditorTab from './tabs/EditorTab'
import ToolsTab from './tabs/ToolsTab'
import SettingsTab from './tabs/SettingsTab'
import AnalyticsTab from './tabs/AnalyticsTab'
import AccountTab from './tabs/AccountTab'

type Tab = 'posts' | 'editor' | 'tools' | 'settings' | 'analytics' | 'account'

export default function AdminPanel() {
  const [tab, setTab] = useState<Tab>('posts')
  const [editingId, setEditingId] = useState<number | null>(null)
  const nav = useNavigate()

  useEffect(() => {
    document.title = 'Admin - PPM Creator'
    document.body.style.background = '#FAFAF9'
    return () => { document.body.style.background = '' }
  }, [])

  const TABS: { id: Tab; label: string }[] = [
    { id: 'posts', label: 'Blog posts' },
    { id: 'editor', label: 'Post editor' },
    { id: 'tools', label: 'Tool pages & FAQ' },
    { id: 'settings', label: 'Site settings' },
    { id: 'analytics', label: 'Analytics' },
    { id: 'account', label: 'Account & security' },
  ]

  const editPost = (id: number) => { setEditingId(id); setTab('editor') }
  const newPost = () => { setEditingId(null); setTab('editor') }

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF9', color: '#1c1917', fontFamily: 'system-ui, -apple-system, Segoe UI, Roboto, sans-serif' }}>
      <header style={{ background: '#fff', borderBottom: '1px solid #e7e5e4', display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 18px', position: 'sticky', top: 0, zIndex: 5 }}>
        <div style={{ fontWeight: 600, fontSize: 16 }}>PPM <span style={{ color: '#F97316' }}>Creator</span> Admin</div>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <Link to="/" style={{ fontSize: 12, color: '#6b7280', textDecoration: 'none', border: '1px solid #e7e5e4', borderRadius: 99, padding: '4px 12px' }}>View site</Link>
          <span style={{ fontSize: 12, color: '#6b7280', border: '1px solid #e7e5e4', borderRadius: 99, padding: '3px 10px' }}>Admin</span>
        </div>
      </header>
      <nav style={{ display: 'flex', gap: 4, flexWrap: 'wrap', padding: '10px 18px', background: '#fff', borderBottom: '1px solid #e7e5e4' }}>
        {TABS.map((t) => (
          <button key={t.id} onClick={() => { if (t.id === 'editor' && tab !== 'editor') newPost(); else setTab(t.id) }} style={{ border: 0, background: tab === t.id ? '#FFF7ED' : 'none', padding: '7px 12px', borderRadius: 8, cursor: 'pointer', color: tab === t.id ? '#F97316' : '#6b7280', fontWeight: tab === t.id ? 600 : 400, font: 'inherit', fontSize: 14 }}>
            {t.label}
          </button>
        ))}
      </nav>
      <main style={{ padding: 18, maxWidth: 1180, margin: '0 auto' }}>
        {tab === 'posts' && <PostsTab onEdit={editPost} onNew={newPost} />}
        {tab === 'editor' && <EditorTab id={editingId} onBack={() => setTab('posts')} onSaved={() => setTab('posts')} />}
        {tab === 'tools' && <ToolsTab />}
        {tab === 'settings' && <SettingsTab />}
        {tab === 'analytics' && <AnalyticsTab />}
        {tab === 'account' && <AccountTab />}
      </main>
    </div>
  )
}