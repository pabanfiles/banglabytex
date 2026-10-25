import { Hono } from 'hono'
import type { Env, MediaResult } from '../types'

export const extractRoutes = new Hono<{ Bindings: Env }>()

async function checkRateLimit(env: Env, ip: string): Promise<boolean> {
  try {
    const minuteKey = `rl:min:${ip}:${Math.floor(Date.now() / 60000)}`
    const minCount = await env.CACHE.get(minuteKey)
    const count = parseInt(minCount || '0')
    if (count >= 10) return false
    await env.CACHE.put(minuteKey, String(count + 1), { expirationTtl: 60 })
    return true
  } catch (e) {
    return true
  }
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
  } catch {
    return null
  }
}

extractRoutes.post('/extract', async (c) => {
  try {
    const body = await c.req.json<{ url: string }>()
    const url = body?.url?.trim()
    if (!url) return c.json({ error: 'URL required' }, 400)

    const ip = c.req.header('CF-Connecting-IP') || 'unknown'
    const allowed = await checkRateLimit(c.env, ip)
    if (!allowed) return c.json({ error: 'Rate limit exceeded.' }, 429)

    const platform = detectPlatform(url)
    if (!platform) return c.json({ error: 'Unsupported platform' }, 400)

    try {
      const cacheKey = `media:${platform}:${encodeURIComponent(url)}`
      const cached = await c.env.CACHE.get(cacheKey, 'json')
      if (cached) return c.json({ ...(cached as MediaResult), cached: true })
    } catch (e) {}

    const extractorUrl = c.env.EXTRACTOR_URL || 'https://video-api-7xw7.onrender.com'
    
    const resp = await fetch(`${extractorUrl}/extract`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url, platform }),
    })

    if (!resp.ok) {
      const errText = await resp.text()
      return c.json({ error: `Extractor failed: ${errText.slice(0, 100)}` }, 502)
    }

    const result = await resp.json() as MediaResult
    
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

// Direct Download Proxy
extractRoutes.get('/download', async (c) => {
  const url = c.req.query('url')
  const filename = c.req.query('filename') || 'video.mp4'
  
  if (!url) return c.json({ error: 'URL required' }, 400)
  
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://www.instagram.com/'
      }
    })
    
    if (!response.ok) return c.json({ error: 'Download failed' }, 502)
    
    const newHeaders = new Headers(response.headers)
    newHeaders.set('Content-Disposition', `attachment; filename="${filename}"`)
    newHeaders.set('Access-Control-Allow-Origin', '*')
    
    return new Response(response.body, {
      headers: newHeaders,
      status: 200
    })
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})