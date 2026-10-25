import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { extractRoutes } from './routes/extract'
import { healthRoutes } from './routes/health'

const app = new Hono<{ Bindings: any }>()

app.use('*', cors({ origin: '*', allowMethods: ['GET', 'POST', 'OPTIONS'], allowHeaders: ['Content-Type'] }))
app.route('/api', extractRoutes)
app.route('/api', healthRoutes)
app.notFound(c => c.json({ error: 'Not found' }, 404))

export default app