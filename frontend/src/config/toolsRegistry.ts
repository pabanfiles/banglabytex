import type { LazyExoticComponent, ComponentType } from 'react'
import { lazy } from 'react'

export interface ToolDefinition {
  slug: string; name: string; description: string; icon: string; category: string;
  component: LazyExoticComponent<ComponentType>; externalLink?: string;
}

export const tools: ToolDefinition[] = [
  { slug: 'video-downloader', name: 'Video Downloader', description: 'Download videos from social media.', icon: '🎬', category: 'Media', component: lazy(() => import('../pages/tools/VideoDownloader')) },
  { slug: 'youtube-meta', name: 'YouTube Metadata', description: 'Extract title, thumbnail, and tags from YouTube.', icon: '📺', category: 'Media', component: lazy(() => import('../pages/tools/YoutubeMeta')) },
  { slug: 'pdf-tools', name: 'PDF Tools', description: 'Edit, merge, split, compress PDFs.', icon: '📄', category: 'Productivity', component: lazy(() => import('../pages/tools/PdfTools')) },
  { slug: 'image-tools', name: 'Image Tools', description: 'Compress, resize, convert images.', icon: '🖼️', category: 'Design', component: lazy(() => import('../pages/tools/ImageTools')) },
  { slug: 'word-tools', name: 'Word / Office Tools', description: 'Convert PDF to Word/Excel.', icon: '📝', category: 'Productivity', component: lazy(() => import('../pages/tools/WordTools')) },
  { slug: 'percentage-calc', name: 'Percentage Calculator', description: 'Calculate percentages easily.', icon: '🧮', category: 'Calculator', component: lazy(() => import('../pages/tools/PercentageCalc')) },
  { slug: 'age-calc', name: 'Age Calculator', description: 'Calculate your exact age.', icon: '🎂', category: 'Calculator', component: lazy(() => import('../pages/tools/AgeCalc')) },
  { slug: 'social-checker', name: 'Social & Domain Checker', description: 'Check brand name availability.', icon: '🔍', category: 'Utility', component: lazy(() => import('../pages/tools/SocialChecker')) },
  // নতুন ৪টি টুল
  { slug: 'qr-code-gen', name: 'QR Code Generator', description: 'Create custom QR codes easily.', icon: '📱', category: 'Utility', component: lazy(() => import('../pages/tools/QrCodeGen')) },
  { slug: 'html-to-text', name: 'HTML to Text', description: 'Remove HTML tags and get clean text.', icon: '💻', category: 'Developer', component: lazy(() => import('../pages/tools/HtmlToText')) },
  { slug: 'csv-to-json', name: 'CSV to JSON', description: 'Convert CSV data to JSON format.', icon: '📊', category: 'Developer', component: lazy(() => import('../pages/tools/CsvToJson')) },
  { slug: 'excel-convert', name: 'Excel/CSV Converter', description: 'Convert Excel or CSV files instantly.', icon: '📈', category: 'Productivity', component: lazy(() => import('../pages/tools/ExcelConvert')) }
]