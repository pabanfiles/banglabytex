import { useState, useEffect } from 'react'

export interface ToolData {
  slug: string
  h1_title: string
  intro_text: string
  faq_json: string
  is_active: number
}

export function useToolsData() {
  const [tools, setTools] = useState<ToolData[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/tools')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setTools(data)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const getToolBySlug = (slug: string) => tools.find(t => t.slug === slug)

  return { tools, loading, getToolBySlug }
}