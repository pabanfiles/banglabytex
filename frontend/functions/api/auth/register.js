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
function validEmail(e) { return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(e || ''); }
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