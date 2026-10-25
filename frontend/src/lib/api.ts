import axios from 'axios'

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api', timeout: 30000 })

export interface MediaFormat { id: string; quality: string; ext: string; size?: number; url: string; type: string; }
export interface MediaResult { platform: string; type: string; title: string; author?: string; thumbnail?: string; caption?: string; hashtags?: string[]; formats: MediaFormat[]; watchUrl?: string; }

export async function extractMedia(url: string): Promise<MediaResult> {
  const { data } = await api.post('/extract', { url })
  return data
}

export function startDownload(url: string) {
  const a = document.createElement('a'); a.href = url; a.target = '_blank'; a.rel = 'noopener noreferrer'; a.click();
}