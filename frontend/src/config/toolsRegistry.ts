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
    slug: 'pdf-tools', name: 'PDF Tools',
    description: 'Edit, merge, split, compress, protect PDFs and more.',
    icon: '📄', category: 'Productivity',
    component: lazy(() => import('../pages/tools/PdfTools')),
  },
  {
    slug: 'image-tools', name: 'Image Tools',
    description: 'Compress, resize, convert images easily.',
    icon: '🖼️', category: 'Design',
    component: lazy(() => import('../pages/tools/ImageTools')),
  },
  {
    slug: 'word-tools', name: 'Word / Office Tools',
    description: 'Convert PDF to Word/Excel, Office to PDF and more.',
    icon: '📝', category: 'Productivity',
    component: lazy(() => import('../pages/tools/WordTools')),
  }
]