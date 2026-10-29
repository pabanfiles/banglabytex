import { verifyPassword, validEmail } from '../../_lib/crypto.js';

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const b = await request.json();
    const email = (b.email || '').trim().toLowerCase();
    const password = b.password || '';
    if (!validEmail(email) || !password) return json({ error: 'Email and password are required.' }, 400);

    const user = await env.DB.prepare('SELECT email, password_hash, email_verified, name, avatar_url FROM users WHERE email = ?').bind(email).first();
    if (!user || !user.password_hash) return json({ error: 'Email or password is incorrect.' }, 401);
    if (!user.email_verified) return json({ error: 'Please verify your email first. Check your inbox.', needs_verification: true }, 403);
    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) return json({ error: 'Email or password is incorrect.' }, 401);
    const headers = new Headers();
    headers.set('Set-Cookie', 'user_email=' + encodeURIComponent(user.email) + '; Path=/; SameSite=Lax; Max-Age=2592000; Secure');
    headers.set('Content-Type', 'application/json');
    return new Response(JSON.stringify({ success: true, user: { email: user.email, name: user.name, avatar_url: user.avatar_url } }), { status: 200, headers });
  } catch (err) { return json({ error: err.message }, 500); }
}
function json(b, s) { return new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } }); }