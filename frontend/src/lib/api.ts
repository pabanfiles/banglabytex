import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 60000,
})

export interface MediaFormat {
  id: string
  quality: string
  ext: string
  size?: number
  url: string
  type: 'video' | 'audio' | 'image'
}

export interface MediaResult {
  platform: string
  type: 'video' | 'reel' | 'photo' | 'story' | 'audio'
  title: string
  author?: string
  thumbnail?: string
  duration?: number
  caption?: string
  hashtags?: string[]
  formats: MediaFormat[]
  audioFormats?: MediaFormat[]
  watchUrl?: string
}

export async function extractMedia(url: string): Promise<MediaResult> {
  const { data } = await api.post('/extract', { url })
  return data
}

export function startDownload(url: string) {
  const a = document.createElement('a')
  a.href = url
  a.target = '_blank'
  a.rel = 'noopener noreferrer'
  a.click()
}

export default api