// === Helpers (inlined) ===
function bytesToHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, '0')).join('');
}
async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = bytesToHex(salt);
  const keyMaterial = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: 100000, hash: 'SHA-256' }, keyMaterial, 256);
  return 'pbkdf2\\$' + saltHex + '\$' + bytesToHex(new Uint8Array(bits));
}
async function verifyPassword(password, stored) {
  const parts = (stored || '').split('\$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;
  const salt = new Uint8Array(parts[2].match(/.{2}/g).map((h) => parseInt(h, 16)));
  const keyMaterial = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: parseInt(parts[1]), hash: 'SHA-256' }, keyMaterial, 256);
  return bytesToHex(new Uint8Array(bits)) === parts[3];
}
function randomToken(len = 32) {
  const arr = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(arr).map((b) => b.toString(16).padStart(2, '0')).join('');
}
function validEmail(e) { return /^[^@\s]+@[^@\s]+\.[^@\s]+\$/.test(e || ''); }
async function sendEmail(env, to, subject, html) {
  const key = env.RESEND_API_KEY;
  if (!key) return { ok: false, error: 'RESEND_API_KEY is not set. Add it in Cloudflare Pages env vars.' };
  const from = env.RESEND_FROM || 'PPM Creator <onboarding@resend.dev>';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => '');
    return { ok: false, error: 'Resend error: ' + res.status + ' ' + t.slice(0, 200) };
  }
  return { ok: true };
}
function verifyEmailHtml(name, link) {
  return '<!DOCTYPE html><html><body style="margin:0;padding:0;background:#FAFAF9;font-family:-apple-system,Segoe UI,Roboto,sans-serif"><div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06)"><div style="background:#F97316;padding:28px 32px"><div style="color:#fff;font-size:22px;font-weight:700">PPM Creator</div><div style="color:#FFEDD5;font-size:13px;margin-top:4px">Verify your email to finish signing up</div></div><div style="padding:32px"><p style="font-size:15px;color:#1c1917;margin:0 0 16px">Hi ' + (name || 'there') + ',</p><p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 20px">Welcome to PPM Creator. Tap the button below to verify your email address. This link expires in 24 hours.</p><a href="' + link + '" style="display:inline-block;padding:14px 28px;background:#F97316;color:#fff;text-decoration:none;border-radius:10px;font-weight:600;font-size:15px">Verify email</a><p style="font-size:13px;color:#6b7280;margin:24px 0 0">If the button does not work, copy this link into your browser:</p><p style="font-size:12px;color:#6b7280;word-break:break-all;background:#FAFAF9;padding:10px;border-radius:8px;margin:6px 0 0">' + link + '</p><p style="font-size:13px;color:#9ca3af;margin:24px 0 0">If you did not create an account, ignore this email.</p></div></div></body></html>';
}
function resetEmailHtml(name, link) {
  return '<!DOCTYPE html><html><body style="margin:0;padding:0;background:#FAFAF9;font-family:-apple-system,Segoe UI,Roboto,sans-serif"><div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06)"><div style="background:#F97316;padding:28px 32px"><div style="color:#fff;font-size:22px;font-weight:700">PPM Creator</div><div style="color:#FFEDD5;font-size:13px;margin-top:4px">Password reset</div></div><div style="padding:32px"><p style="font-size:15px;color:#1c1917;margin:0 0 16px">Hi ' + (name || 'there') + ',</p><p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 20px">We received a request to reset your password. Tap the button below. This link expires in 30 minutes.</p><a href="' + link + '" style="display:inline-block;padding:14px 28px;background:#F97316;color:#fff;text-decoration:none;border-radius:10px;font-weight:600;font-size:15px">Reset password</a><p style="font-size:13px;color:#6b7280;margin:24px 0 0">If the button does not work, copy this link into your browser:</p><p style="font-size:12px;color:#6b7280;word-break:break-all;background:#FAFAF9;padding:10px;border-radius:8px;margin:6px 0 0">' + link + '</p><p style="font-size:13px;color:#9ca3af;margin:24px 0 0">If you did not request this, ignore this email.</p></div></div></body></html>';
}
// === End helpers ===
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