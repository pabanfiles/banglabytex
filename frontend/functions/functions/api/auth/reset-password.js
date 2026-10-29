import { hashPassword } from '../../_lib/crypto.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const b = await request.json();
    const token = (b.token || '').trim();
    const password = b.password || '';
    if (!token || !password) return json({ error: 'Token and password are required.' }, 400);
    if (password.length < 8) return json({ error: 'Password must be at least 8 characters.' }, 400);
    const row = await env.DB.prepare('SELECT email, expires, used FROM password_resets WHERE token = ?').bind(token).first();
    if (!row) return json({ error: 'Invalid or expired link.' }, 400);
    if (row.used) return json({ error: 'This link has already been used.' }, 400);
    if (new Date(row.expires).getTime() < Date.now()) return json({ error: 'This link has expired.' }, 400);
    const passwordHash = await hashPassword(password);
    await env.DB.prepare('UPDATE users SET password_hash = ?, email_verified = 1 WHERE email = ?').bind(passwordHash, row.email).run();
    await env.DB.prepare('UPDATE password_resets SET used = 1 WHERE token = ?').bind(token).run();
    return json({ success: true }, 200);
  } catch (err) { return json({ error: err.message }, 500); }
}
function json(b, s) { return new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } }); }