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
app.onError((err, c) => c.json({ error: err.message || 'Internal error' }, 500))

export default {
  fetch: app.fetch,
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext) {
    const servers = [
      "https://video-api-7xw7.onrender.com/health",
      "https://video-api-2-qj4p.onrender.com/health",
      "https://bangla-pdf-backend.onrender.com/health",
    ]
    
    console.log('⏰ Keep-Alive: Waking all servers...')
    
    await Promise.allSettled(
      servers.map(url => 
        fetch(url)
          .then(r => console.log(`✅ ${url} → ${r.status}`))
          .catch(e => console.log(`❌ ${url} → failed`))
      )
    )
  }
}