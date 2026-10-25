import type { LazyExoticComponent, ComponentType } from 'react'
import { lazy } from 'react'

export interface ToolDefinition {
  slug: string; name: string; description: string; icon: string; category: string;
  component: LazyExoticComponent<ComponentType>; externalLink?: string;
}

export const tools: ToolDefinition[] = [
  {
    slug: 'video-downloader', name: 'Video Downloader',
    description: 'Download videos from Facebook, Instagram, TikTok, Twitter & more.',
    icon: '🎬', category: 'Media',
    component: lazy(() => import('../pages/tools/VideoDownloader')),
  },
  {
    slug: 'pdf-editor', name: 'PDF Editor & Tools',
    description: 'Edit PDF text, merge, split, compress, and convert files easily.',
    icon: '📄', category: 'Productivity',
    component: lazy(() => import('../pages/NotFound')),
    externalLink: 'http://localhost:8081',
  }
]