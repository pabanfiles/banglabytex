$ErrorActionPreference = "Stop"
$root = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend"
$utf8 = New-Object System.Text.UTF8Encoding $false

function WF($rel, $body) {
  $full = Join-Path $root $rel
  $dir = Split-Path $full -Parent
  if (-not (Test-Path -LiteralPath $dir)) { New-Item -ItemType Directory -Path $dir -Force | Out-Null }
  [System.IO.File]::WriteAllText($full, $body, $utf8)
  Write-Host "  [+] $rel" -ForegroundColor Green
}

Write-Host "=== Group 1 : Foundation ===" -ForegroundColor Cyan

# 1. public/site.json
WF "public/site.json" @"
{
  "name": "PPM Creator",
  "origin": "https://ppmcreator.pages.dev",
  "accent": "#F97316",
  "contactEmail": "hello@ppmcreator.com",
  "social": "@ppmcreator",
  "description": "Free browser-based tools for images, PDFs and everyday calculations. Files stay on your device.",
  "lang": "en",
  "year": 2026
}
"@

# 2. public/robots.txt
WF "public/robots.txt" @"
User-agent: *
Allow: /
Disallow: /hellowsaipatit

Sitemap: https://ppmcreator.pages.dev/sitemap.xml
"@

# 3. public/sitemap.xml
WF "public/sitemap.xml" @"
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://ppmcreator.pages.dev/</loc><priority>1.0</priority></url>
  <url><loc>https://ppmcreator.pages.dev/about</loc></url>
  <url><loc>https://ppmcreator.pages.dev/contact</loc></url>
  <url><loc>https://ppmcreator.pages.dev/privacy-policy</loc></url>
  <url><loc>https://ppmcreator.pages.dev/terms</loc></url>
  <url><loc>https://ppmcreator.pages.dev/disclaimer</loc></url>
  <url><loc>https://ppmcreator.pages.dev/sitemap</loc></url>
  <url><loc>https://ppmcreator.pages.dev/blog</loc></url>
</urlset>
"@

# 4. src/lib/seo.ts
WF "src/lib/seo.ts" @"
export const ORIGIN = 'https://ppmcreator.pages.dev'
export function absUrl(path, origin = ORIGIN) {
  if (!path) return origin
  if (path.startsWith('http')) return path
  return origin.replace(/\/$/, '') + (path.startsWith('/') ? path : '/' + path)
}
"@

# 5. src/components/Seo.tsx
WF "src/components/Seo.tsx" @"
import { useEffect } from 'react'
import { absUrl, ORIGIN } from '../lib/seo'

export default function Seo({ title, description, path, ogImage, type = 'website', jsonLd }) {
  useEffect(() => {
    document.title = title
    const set = (n, c, a) => {
      let el = document.head.querySelector('meta[' + a + '=\"' + n + '\"]')
      if (!el) { el = document.createElement('meta'); el.setAttribute(a, n); document.head.appendChild(el) }
      el.setAttribute('content', c)
    }
    set('description', description, 'name')
    let link = document.head.querySelector('link[rel=\"canonical\"]')
    if (!link) { link = document.createElement('link'); link.setAttribute('rel', 'canonical'); document.head.appendChild(link) }
    link.setAttribute('href', absUrl(path, ORIGIN))
    set('og:title', title, 'property')
    set('og:description', description, 'property')
    set('og:url', absUrl(path, ORIGIN), 'property')
    set('og:type', type, 'property')
    if (ogImage) set('og:image', absUrl(ogImage, ORIGIN), 'property')
    set('twitter:card', 'summary_large_image', 'name')
    set('twitter:title', title, 'name')
    set('twitter:description', description, 'name')
    const prev = document.head.querySelector('script[data-seo-jsonld]')
    if (prev) prev.remove()
    if (jsonLd) {
      const s = document.createElement('script')
      s.type = 'application/ld+json'
      s.setAttribute('data-seo-jsonld', 'true')
      s.text = JSON.stringify(jsonLd)
      document.head.appendChild(s)
    }
  }, [title, description, path, ogImage, type, jsonLd])
  return null
}
"@

Write-Host "  Done part A" -ForegroundColor Green