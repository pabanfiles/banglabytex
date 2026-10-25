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
  console.error('Worker error:', err)
  return c.json({ error: err.message || 'Internal error' }, 500)
})

// Cloudflare Worker Cron Trigger Handler
export default {
  fetch: app.fetch,
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    console.log('⏰ Keep-Alive Trigger: Waking up Render server...')
    try {
      const extractorUrl = env.EXTRACTOR_URL || 'https://video-api-7xw7.onrender.com'
      const response = await fetch(`${extractorUrl}/health`)
      const result = await response.json()
      console.log('✅ Render server is awake:', result)
    } catch (err) {
      console.error('❌ Failed to wake up:', err)
    }
  }
}