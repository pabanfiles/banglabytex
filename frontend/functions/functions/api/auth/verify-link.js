export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const b = await request.json();
    const token = (b.token || '').trim();
    if (!token) return json({ error: 'Missing token.' }, 400);
    const row = await env.DB.prepare('SELECT email, expires, used FROM email_verifications WHERE token = ?').bind(token).first();
    if (!row) return json({ error: 'Invalid or expired link.' }, 400);
    if (row.used) return json({ error: 'This link has already been used.' }, 400);
    if (new Date(row.expires).getTime() < Date.now()) return json({ error: 'This link has expired. Please register again.' }, 400);
    await env.DB.prepare('UPDATE users SET email_verified = 1 WHERE email = ?').bind(row.email).run();
    await env.DB.prepare('UPDATE email_verifications SET used = 1 WHERE token = ?').bind(token).run();
    const headers = new Headers();
    headers.set('Set-Cookie', 'user_email=' + encodeURIComponent(row.email) + '; Path=/; SameSite=Lax; Max-Age=2592000; Secure');
    headers.set('Content-Type', 'application/json');
    return new Response(JSON.stringify({ success: true, email: row.email }), { status: 200, headers });
  } catch (err) { return json({ error: err.message }, 500); }
}
function json(b, s) { return new Response(JSON.stringify(b), { status: s, headers: { 'Content-Type': 'application/json' } }); }