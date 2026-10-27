import { useState, useEffect } from 'react'

export function useToolData(slug: string) {
  const [toolData, setToolData] = useState<any>(null)
  const [relatedPosts, setRelatedPosts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Fetch Tool Data
    fetch('/api/tools')
      .then(r => r.json())
      .then(data => {
        if(Array.isArray(data)) {
          const t = data.find(x => x.slug === slug)
          if(t) setToolData(t)
        }
      }).catch(()=>{})

    // Fetch Related Blog Posts
    fetch('/api/posts')
      .then(r => r.json())
      .then(data => {
        if(Array.isArray(data)) setRelatedPosts(data.slice(0, 2)) // Take 2 latest posts
      }).catch(()=>{})
      .finally(() => setLoading(false))
  }, [slug])

  let faqs = []
  try { faqs = JSON.parse(toolData?.faq_json || '[]') } catch(e) {}

  return { toolData, faqs, relatedPosts, loading }
}