function genCode() { return String(Math.floor(Math.random() * 900000) + 100000) }
export async function onRequestPost(context) {
  const { request, env } = context
  try {
    const body = await request.json()
    const email = (body.email || '').trim().toLowerCase()
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return new Response(JSON.stringify({ error: 'Enter a valid email.' }), { status: 400 })
    const code = genCode()
    const expires = new Date(Date.now() + 10 * 60 * 1000).toISOString()
    await env.DB.prepare('CREATE TABLE IF NOT EXISTS email_otps (email TEXT PRIMARY KEY, code TEXT NOT NULL, expires DATETIME NOT NULL, attempts INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)').run()
    await env.DB.prepare('INSERT INTO email_otps (email, code, expires, attempts) VALUES (?, ?, ?, 0) ON CONFLICT(email) DO UPDATE SET code = excluded.code, expires = excluded.expires, attempts = 0, created_at = CURRENT_TIMESTAMP').bind(email, code, expires).run()
    const RESEND = env.RESEND_API_KEY
    if (!RESEND) return new Response(JSON.stringify({ success: true, note: 'Email sending disabled. Admin must set RESEND_API_KEY. Code stored but not emailed.' }), { status: 200 })
    const from = env.RESEND_FROM || 'PPM Creator <noreply@ppmcreator.com>'
    const res = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { 'Authorization': 'Bearer ' + RESEND, 'Content-Type': 'application/json' }, body: JSON.stringify({ from, to: [email], subject: 'Your PPM Creator sign-in code', html: '<p>Your sign-in code is <b style="font-size:20px;letter-spacing:4px">' + code + '</b></p><p>The code expires in 10 minutes.</p>' }) })
    if (!res.ok) return new Response(JSON.stringify({ error: 'Could not send the email.' }), { status: 500 })
    return new Response(JSON.stringify({ success: true }), { status: 200 })
  } catch (err) { return new Response(JSON.stringify({ error: err.message }), { status: 500 }) }
}