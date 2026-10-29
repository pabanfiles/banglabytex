export async function onRequestPost(context) {
  const { request, env } = context
  try {
    const body = await request.json()
    const email = (body.email || '').trim().toLowerCase()
    const code = (body.code || '').trim()
    if (!email || !code) return new Response(JSON.stringify({ error: 'Email and code are required.' }), { status: 400 })
    const row = await env.DB.prepare('SELECT code, expires, attempts FROM email_otps WHERE email = ?').bind(email).first()
    if (!row) return new Response(JSON.stringify({ error: 'No code was requested for this email.' }), { status: 400 })
    if (row.attempts >= 5) return new Response(JSON.stringify({ error: 'Too many attempts. Request a new code.' }), { status: 429 })
    if (new Date(row.expires).getTime() < Date.now()) return new Response(JSON.stringify({ error: 'Code expired. Request a new one.' }), { status: 400 })
    if (row.code !== code) {
      await env.DB.prepare('UPDATE email_otps SET attempts = attempts + 1 WHERE email = ?').bind(email).run()
      return new Response(JSON.stringify({ error: 'Incorrect code.' }), { status: 401 })
    }
    await env.DB.prepare('INSERT INTO users (email, provider, provider_id, name) VALUES (?, ?, ?, ?) ON CONFLICT(email) DO UPDATE SET provider = excluded.provider').bind(email, 'email', email, email.split('@')[0]).run()
    const headers = new Headers()
    headers.set('Set-Cookie', 'user_email=' + encodeURIComponent(email) + '; Path=/; SameSite=Lax; Max-Age=2592000')
    headers.set('Content-Type', 'application/json')
    await env.DB.prepare('DELETE FROM email_otps WHERE email = ?').bind(email).run()
    return new Response(JSON.stringify({ success: true }), { headers, status: 200 })
  } catch (err) { return new Response(JSON.stringify({ error: err.message }), { status: 500 }) }
}