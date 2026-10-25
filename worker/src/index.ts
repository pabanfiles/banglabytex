import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { extractRoutes } from './routes/extract'
import { healthRoutes } from './routes/health'
import type { Env } from './types'

const app = new Hono<{ Bindings: Env }>()

app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'OPTIONS'],
  allowHeaders: ['Content-Type'],
  maxAge: 86400,
}))

app.route('/api', extractRoutes)
app.route('/api', healthRoutes)

app.notFound(c => c.json({ error: 'Not found' }, 404))
app.onError((err, c) => {
  return c.json({ error: err.message || 'Internal error' }, 500)
})

export default {
  fetch: app.fetch,
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    const url = env.EXTRACTOR_URL || 'https://video-api-7xw7.onrender.com'
    try {
      await fetch(`${url}/health`)
      console.log('✅ Keep-alive: Render is awake')
    } catch (e) {
      console.error('❌ Keep-alive failed')
    }
  }
}