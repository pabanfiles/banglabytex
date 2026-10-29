import { hashPassword, validEmail, randomToken } from '../../_lib/crypto.js';
import { sendEmail } from '../../_lib/send-email.js';
import { verifyEmailHtml } from '../../_lib/email-templates.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const b = await request.json();
    const email = (b.email || '').trim().toLowerCase();
    const password = b.password || '';
    const name = (b.name || '').trim();
    if (!validEmail(email)) return json({ error: 'Enter a valid email.' }, 400);
    if (password.length < 8) return json({ error: 'Password must be at least 8 characters.' }, 400);

    await env.DB.prepare('CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE NOT NULL, provider TEXT NOT NULL, provider_id TEXT UNIQUE NOT NULL, avatar_url TEXT, password_hash TEXT, otp_code TEXT, otp_expires DATETIME, email_verified INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)').run();

    const existing = await env.DB.prepare('SELECT id, email, email_verified FROM users WHERE email = ?').bind(email).first();
    if (existing && existing.email_verified) return json({ error: 'This email is already registered. Sign in instead.' }, 409);

    const passwordHash = await hashPassword(password);
    if (existing) {
      await env.DB.prepare('UPDATE users SET password_hash = ?, name = ? WHERE email = ?').bind(passwordHash, name || existing.email.split('@')[0], email).run();
    } else {
      await env.DB.prepare('INSERT INTO users (email, provider, provider_id, name, password_hash, email_verified) VALUES (?, ?, ?, ?, ?, 0)').bind(email, 'email', email, name || email.split('@')[0], passwordHash).run();
    }

    const token = randomToken(32);
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();
    await env.DB.prepare('CREATE TABLE IF NOT EXISTS email_verifications (token TEXT PRIMARY KEY, email TEXT NOT NULL, expires DATETIME NOT NULL, used INTEGER DEFAULT 0)').run();
    await env.DB.prepare('INSERT INTO email_verifications (token, email, expires, used) VALUES (?, ?, ?, 0)').bind(token, email, expires).run();

    const origin = new URL(request.url).origin;
    const link = origin + '/verify-email?token=' + token;
    const sent = await sendEmail(env, email, 'Verify your PPM Creator account', verifyEmailHtml(name || email.split('@')[0], link));
    if (!sent.ok) return json({ error: sent.error, verify_link: link }, 500);
    return json({ success: true, message: 'Check your inbox to verify your email.' }, 200);
  } catch (err) { return json({ error: err.message }, 500); }
}
function json(body, status) { return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } }); }