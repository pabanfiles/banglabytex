$ErrorActionPreference = "Stop"
$utf8 = New-Object System.Text.UTF8Encoding $false
$p = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend\functions\api\auth\login-password.js"
$content = @"
function validEmail(e) { return /^[^@\s]+@[^@\s]+\.[^@\s]+`$/.test(e || ''); }

async function verifyPassword(password, stored) {
  const parts = (stored || '').split('`$');
  if (parts.length !== 4 || parts[0] !== 'pbkdf2') return false;
  const salt = new Uint8Array(parts[2].match(/.{2}/g).map((h) => parseInt(h, 16)));
  const keyMaterial = await crypto.subtle.importKey('raw', new TextEncoder().encode(password), 'PBKDF2', false, ['deriveBits']);
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', salt, iterations: parseInt(parts[1]), hash: 'SHA-256' }, keyMaterial, 256);
  const hex = Array.from(new Uint8Array(bits)).map((b) => b.toString(16).padStart(2, '0')).join('');
  return hex === parts[3];
}

export async function onRequestGet() {
  return new Response(JSON.stringify({ ok: true, message: 'login-password endpoint alive, use POST' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const b = await request.json();
    const email = (b.email || '').trim().toLowerCase();
    const password = b.password || '';
    if (!validEmail(email) || !password) {
      return new Response(JSON.stringify({ error: 'Email and password are required.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const user = await env.DB.prepare('SELECT email, password_hash, email_verified, name, avatar_url FROM users WHERE email = ?').bind(email).first();
    if (!user || !user.password_hash) {
      return new Response(JSON.stringify({ error: 'Email or password is incorrect.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    if (!user.email_verified) {
      return new Response(JSON.stringify({ error: 'Please verify your email first.', needs_verification: true }), { status: 403, headers: { 'Content-Type': 'application/json' } });
    }
    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) {
      return new Response(JSON.stringify({ error: 'Email or password is incorrect.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    }
    const cookie = 'user_email=' + encodeURIComponent(user.email) + '; Path=/; SameSite=Lax; Max-Age=2592000; Secure';
    return new Response(
      JSON.stringify({ success: true, user: { email: user.email, name: user.name, avatar_url: user.avatar_url } }),
      {
        status: 200,
        headers: {
          'Set-Cookie': cookie,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}
"@
[System.IO.File]::WriteAllText($p, $content, $utf8)
Write-Host "[+] login-password.js rewritten" -ForegroundColor Green