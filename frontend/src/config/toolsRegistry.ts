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
    externalLink: '/pdf-editor.html',
  },
  {
    slug: 'emi-calculator', name: 'EMI Calculator',
    description: 'Calculate monthly loan payments, interest, and total amounts instantly.',
    icon: '🧮', category: 'Finance',
    component: lazy(() => import('../pages/tools/EmiCalculator')),
  },
  {
    slug: 'text-case-converter', name: 'Text Case Converter',
    description: 'Convert text to UPPERCASE, lowercase, Title Case, camelCase, and more.',
    icon: '🔤', category: 'Text',
    component: lazy(() => import('../pages/tools/TextCaseConverter')),
  },
  {
    slug: 'color-picker', name: 'Color Picker',
    description: 'Pick colors and copy HEX, RGB, HSL codes instantly.',
    icon: '🎨', category: 'Design',
    component: lazy(() => import('../pages/tools/ColorPicker')),
  },
  {
    slug: 'word-counter', name: 'Word Counter',
    description: 'Count words, characters, sentences, and reading time.',
    icon: '📝', category: 'Text',
    component: lazy(() => import('../pages/tools/WordCounter')),
  },
]