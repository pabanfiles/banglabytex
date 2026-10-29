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