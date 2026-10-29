import { validEmail, randomToken } from '../../_lib/crypto.js';
import { sendEmail } from '../../_lib/send-email.js';
import { resetEmailHtml } from '../../_lib/email-templates.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const b = await request.json();
    const email = (b.email || '').trim().toLowerCase();
    if (!validEmail(email)) return json({ error: 'Enter a valid email.' }, 400);
    const user = await env.DB.prepare('SELECT name FROM users WHERE email = ?').bind(email).first();
    if (user) {
      const token = randomToken(32);
      const expires = new Date(Date.now() + 30 * 60 * 1000).toISOString();
      await env.DB.prepare('CREATE TABLE IF NOT EXISTS password_resets (token TEXT PRIMARY KEY, email TEXT NOT NULL, expires DATETIME NOT NULL, used INTEGER DEFAULT 0)').run();
      await env.DB.prepare('INSERT INTO password_resets (token, email, expires, used) VALUES (?, ?, ?, 0)').bind(token, email, expires).run();
      const origin = new URL(request.url).origin;
      const link = origin + '/reset-password?token=' + token;
      await sendEmail(env, email, 'Reset your PPM Creator password', resetEmailHtml(user.name || email.split('@')[0], link));
    }
    return json({ success: true, message: 'If an account exists for that email, a reset link has been sent.' }, 200);
  } catch (err) { return json({ error: err.message }, 500); }
}
function json(b, s) { return new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } }); }