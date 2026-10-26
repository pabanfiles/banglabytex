import { useState } from 'react'
import { Search } from 'lucide-react'

export default function YoutubeMeta() {
  const [url, setUrl] = useState('')
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const fetchMeta = async () => {
    setLoading(true)
    try {
      const res = await fetch(`https://noembed.com/embed?url=${url}`)
      const json = await res.json()
      setData(json)
    } catch (err) {
      alert('Failed to fetch metadata')
    }
    setLoading(false)
  }

  return (
    <div className="max-w-3xl mx-auto py-12 px-4">
      <h1 className="text-3xl font-bold mb-6 text-center">YouTube Metadata Extractor</h1>
      <div className="bg-white p-6 rounded-2xl shadow-sm border flex gap-3">
        <input type="text" value={url} onChange={e => setUrl(e.target.value)} placeholder="Paste YouTube Video Link" className="flex-1 p-3 border rounded-xl" />
        <button onClick={fetchMeta} disabled={loading} className="px-6 py-3 bg-emerald-500 text-white font-bold rounded-xl">{loading ? 'Fetching...' : 'Extract'}</button>
      </div>

      {data && !data.error && (
        <div className="mt-6 bg-white p-6 rounded-2xl shadow-sm border">
          <img src={data.thumbnail_url} alt="Thumb" className="w-full rounded-xl mb-4" />
          <h2 className="text-2xl font-bold mb-2">{data.title}</h2>
          <p className="text-slate-500 mb-4">By {data.author_name}</p>
          <a href={data.thumbnail_url} target="_blank" download className="inline-block px-6 py-2 bg-slate-900 text-white rounded-lg">Download Thumbnail</a>
        </div>
      )}
    </div>
  )
}