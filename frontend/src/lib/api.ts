import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 60000, // 60s timeout for slow Render wakeups
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
  formats: MediaFormat[]`n  audioFormats?: MediaFormat[]
  watchUrl?: string
}

export async function extractMedia(url: string): Promise<MediaResult> {
  const { data } = await api.post('/extract', { url })
  return data
}

export async function downloadMedia(url: string, filename: string) {
  try {
    const response = await fetch(url, { mode: 'cors' });
    if (!response.ok) throw new Error('Network response was not ok');
    const blob = await response.blob();
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename || 'download.mp4';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
  } catch (error) {
    // Fallback: if CORS blocked, open in new tab
    const a = document.createElement('a');
    a.href = url;
    a.download = filename || 'download.mp4';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }
}

export default api