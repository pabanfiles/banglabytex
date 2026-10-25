import { Hono } from 'hono'
export const extractRoutes = new Hono<{ Bindings: any }>()

extractRoutes.post('/extract', async (c) => {
  try {
    const body = await c.req.json()
    const url = body?.url?.trim()
    if (!url) return c.json({ error: 'URL required' }, 400)

    const cacheKey = `media:${encodeURIComponent(url)}`
    const cached = await c.env.CACHE.get(cacheKey, 'json')
    if (cached) return c.json({ ...cached, cached: true })

    const resp = await fetch(`${c.env.EXTRACTOR_URL}/extract`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url })
    })

    if (!resp.ok) return c.json({ error: 'Extraction failed' }, 502)
    const result = await resp.json()
    
    c.executionCtx.waitUntil(c.env.CACHE.put(cacheKey, JSON.stringify(result), { expirationTtl: 3600 }))
    return c.json(result)
  } catch (err: any) {
    return c.json({ error: err.message }, 500)
  }
})