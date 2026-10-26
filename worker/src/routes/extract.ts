import { Hono } from 'hono'
import type { Env, MediaResult } from '../types'

export const extractRoutes = new Hono<{ Bindings: Env }>()

// ── Server Pool (load balancing) ──
const EXTRACTORS = [
  "https://video-api-7xw7.onrender.com",
  "https://video-api-2-qj4p.onrender.com",
]

async function checkRateLimit(env: Env, ip: string): Promise<boolean> {
  try {
    const minuteKey = `rl:min:${ip}:${Math.floor(Date.now() / 60000)}`
    const minCount = await env.CACHE.get(minuteKey)
    const count = parseInt(minCount || '0')
    if (count >= 10) return false
    await env.CACHE.put(minuteKey, String(count + 1), { expirationTtl: 60 })
    return true
  } catch (e) { return true }
}

function detectPlatform(url: string): string | null {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '')
    if (host.includes('facebook.com') || host.includes('fb.watch')) return 'facebook'
    if (host.includes('instagram.com')) return 'instagram'
    if (host.includes('tiktok.com')) return 'tiktok'
    if (host.includes('twitter.com') || host === 'x.com') return 'twitter'
    if (host.includes('threads.net')) return 'threads'
    if (host.includes('reddit.com')) return 'reddit'
    if (host.includes('pinterest.')) return 'pinterest'
    if (host.includes('vimeo.com')) return 'vimeo'
    if (host.includes('youtube.com') || host.includes('youtu.be')) return 'youtube'
    if (host.includes('snapchat.com')) return 'snapchat'
    if (host.includes('linkedin.com')) return 'linkedin'
    if (host.includes('dailymotion.com') || host.includes('dai.ly')) return 'dailymotion'
    if (host.includes('soundcloud.com')) return 'soundcloud'
    return null
  } catch { return null }
}

async function callExtractor(url: string, platform: string): Promise<MediaResult> {
  // Random shuffle for load balancing
  const servers = [...EXTRACTORS].sort(() => Math.random() - 0.5)
  for (const server of servers) {
    try {
      const resp = await fetch(`${server}/extract`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url, platform }),
      })
      if (resp.ok) return await resp.json() as MediaResult
      console.error(`Server ${server} failed, trying next...`)
    } catch (e) {
      console.error(`Server ${server} unreachable, trying next...`)
    }
  }
  throw new Error('All servers are busy. Please try again.')
}

extractRoutes.post('/extract', async (c) => {
  try {
    const body = await c.req.json<{ url: string }>()
    const url = body?.url?.trim()
    if (!url) return c.json({ error: 'URL required' }, 400)

    const ip = c.req.header('CF-Connecting-IP') || 'unknown'
    const allowed = await checkRateLimit(c.env, ip)
    if (!allowed) return c.json({ error: 'Rate limit exceeded. Try after 1 minute.' }, 429)

    const platform = detectPlatform(url)
    if (!platform) return c.json({ error: 'Unsupported platform' }, 400)

    // Cache check
    try {
      const cacheKey = `media:${platform}:${encodeURIComponent(url)}`
      const cached = await c.env.CACHE.get(cacheKey, 'json')
      if (cached) return c.json({ ...(cached as MediaResult), cached: true })
    } catch (e) {}

    const result = await callExtractor(url, platform)

    // Save to cache (24h)
    try {
      const cacheKey = `media:${platform}:${encodeURIComponent(url)}`
      c.executionCtx.waitUntil(
        c.env.CACHE.put(cacheKey, JSON.stringify(result), { expirationTtl: 86400 })
      )
    } catch (e) {}

    return c.json(result)
  } catch (err: any) {
    return c.json({ error: err.message || 'Extraction failed' }, 500)
  }
})

// Direct download proxy
extractRoutes.get('/download', async (c) => {
  const url = c.req.query('url')
  const filename = c.req.query('filename') || 'video.mp4'
  if (!url) return c.json({ error: 'URL required' }, 400)
  
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0', 'Referer': 'https://www.instagram.com/' }
    })
    if (!response.ok) return c.json({ error: 'Download failed' }, 502)
    
    const newHeaders = new Headers(response.headers)
    newHeaders.set('Content-Disposition', `attachment; filename="${filename}"`)
    newHeaders.set('Access-Control-Allow-Origin', '*')
    
    return new Response(response.body, { headers: newHeaders, status: 200 })
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})