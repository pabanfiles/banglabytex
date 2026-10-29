var __defProp = Object.defineProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });

// api/auth/email/send.js
function genCode() {
  return String(Math.floor(Math.random() * 9e5) + 1e5);
}
__name(genCode, "genCode");
async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();
    if (!email || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return new Response(JSON.stringify({ error: "Enter a valid email." }), { status: 400 });
    const code = genCode();
    const expires = new Date(Date.now() + 10 * 60 * 1e3).toISOString();
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS email_otps (email TEXT PRIMARY KEY, code TEXT NOT NULL, expires DATETIME NOT NULL, attempts INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)").run();
    await env.DB.prepare("INSERT INTO email_otps (email, code, expires, attempts) VALUES (?, ?, ?, 0) ON CONFLICT(email) DO UPDATE SET code = excluded.code, expires = excluded.expires, attempts = 0, created_at = CURRENT_TIMESTAMP").bind(email, code, expires).run();
    const RESEND = env.RESEND_API_KEY;
    if (!RESEND) return new Response(JSON.stringify({ success: true, note: "Email sending disabled. Admin must set RESEND_API_KEY. Code stored but not emailed." }), { status: 200 });
    const from = env.RESEND_FROM || "PPM Creator <noreply@ppmcreator.com>";
    const res = await fetch("https://api.resend.com/emails", { method: "POST", headers: { "Authorization": "Bearer " + RESEND, "Content-Type": "application/json" }, body: JSON.stringify({ from, to: [email], subject: "Your PPM Creator sign-in code", html: '<p>Your sign-in code is <b style="font-size:20px;letter-spacing:4px">' + code + "</b></p><p>The code expires in 10 minutes.</p>" }) });
    if (!res.ok) return new Response(JSON.stringify({ error: "Could not send the email." }), { status: 500 });
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestPost, "onRequestPost");

// api/auth/email/verify.js
async function onRequestPost2(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    const email = (body.email || "").trim().toLowerCase();
    const code = (body.code || "").trim();
    if (!email || !code) return new Response(JSON.stringify({ error: "Email and code are required." }), { status: 400 });
    const row = await env.DB.prepare("SELECT code, expires, attempts FROM email_otps WHERE email = ?").bind(email).first();
    if (!row) return new Response(JSON.stringify({ error: "No code was requested for this email." }), { status: 400 });
    if (row.attempts >= 5) return new Response(JSON.stringify({ error: "Too many attempts. Request a new code." }), { status: 429 });
    if (new Date(row.expires).getTime() < Date.now()) return new Response(JSON.stringify({ error: "Code expired. Request a new one." }), { status: 400 });
    if (row.code !== code) {
      await env.DB.prepare("UPDATE email_otps SET attempts = attempts + 1 WHERE email = ?").bind(email).run();
      return new Response(JSON.stringify({ error: "Incorrect code." }), { status: 401 });
    }
    await env.DB.prepare("INSERT INTO users (email, provider, provider_id, name) VALUES (?, ?, ?, ?) ON CONFLICT(email) DO UPDATE SET provider = excluded.provider").bind(email, "email", email, email.split("@")[0]).run();
    const headers = new Headers();
    headers.set("Set-Cookie", "user_email=" + encodeURIComponent(email) + "; Path=/; SameSite=Lax; Max-Age=2592000");
    headers.set("Content-Type", "application/json");
    await env.DB.prepare("DELETE FROM email_otps WHERE email = ?").bind(email).run();
    return new Response(JSON.stringify({ success: true }), { headers, status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestPost2, "onRequestPost");

// api/auth/forgot-password.js
function randomToken(len = 32) {
  const arr = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(randomToken, "randomToken");
function validEmail(e) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+\$/.test(e || "");
}
__name(validEmail, "validEmail");
async function sendEmail(env, to, subject, html) {
  const key = env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "RESEND_API_KEY is not set. Add it in Cloudflare Pages env vars." };
  const from = env.RESEND_FROM || "PPM Creator <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, html })
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    return { ok: false, error: "Resend error: " + res.status + " " + t.slice(0, 200) };
  }
  return { ok: true };
}
__name(sendEmail, "sendEmail");
function resetEmailHtml(name, link) {
  return '<!DOCTYPE html><html><body style="margin:0;padding:0;background:#FAFAF9;font-family:-apple-system,Segoe UI,Roboto,sans-serif"><div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06)"><div style="background:#F97316;padding:28px 32px"><div style="color:#fff;font-size:22px;font-weight:700">PPM Creator</div><div style="color:#FFEDD5;font-size:13px;margin-top:4px">Password reset</div></div><div style="padding:32px"><p style="font-size:15px;color:#1c1917;margin:0 0 16px">Hi ' + (name || "there") + ',</p><p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 20px">We received a request to reset your password. Tap the button below. This link expires in 30 minutes.</p><a href="' + link + '" style="display:inline-block;padding:14px 28px;background:#F97316;color:#fff;text-decoration:none;border-radius:10px;font-weight:600;font-size:15px">Reset password</a><p style="font-size:13px;color:#6b7280;margin:24px 0 0">If the button does not work, copy this link into your browser:</p><p style="font-size:12px;color:#6b7280;word-break:break-all;background:#FAFAF9;padding:10px;border-radius:8px;margin:6px 0 0">' + link + '</p><p style="font-size:13px;color:#9ca3af;margin:24px 0 0">If you did not request this, ignore this email.</p></div></div></body></html>';
}
__name(resetEmailHtml, "resetEmailHtml");
async function onRequestPost3(context) {
  const { request, env } = context;
  try {
    const b = await request.json();
    const email = (b.email || "").trim().toLowerCase();
    if (!validEmail(email)) return json({ error: "Enter a valid email." }, 400);
    const user = await env.DB.prepare("SELECT name FROM users WHERE email = ?").bind(email).first();
    if (user) {
      const token = randomToken(32);
      const expires = new Date(Date.now() + 30 * 60 * 1e3).toISOString();
      await env.DB.prepare("CREATE TABLE IF NOT EXISTS password_resets (token TEXT PRIMARY KEY, email TEXT NOT NULL, expires DATETIME NOT NULL, used INTEGER DEFAULT 0)").run();
      await env.DB.prepare("INSERT INTO password_resets (token, email, expires, used) VALUES (?, ?, ?, 0)").bind(token, email, expires).run();
      const origin = new URL(request.url).origin;
      const link = origin + "/reset-password?token=" + token;
      await sendEmail(env, email, "Reset your PPM Creator password", resetEmailHtml(user.name || email.split("@")[0], link));
    }
    return json({ success: true, message: "If an account exists for that email, a reset link has been sent." }, 200);
  } catch (err) {
    return json({ error: err.message }, 500);
  }
}
__name(onRequestPost3, "onRequestPost");
function json(b, s) {
  return new Response(JSON.stringify(b), { status: s, headers: { "Content-Type": "application/json" } });
}
__name(json, "json");

// api/auth/google.js
async function onRequestGet(context) {
  const { env } = context;
  const client_id = env.GOOGLE_CLIENT_ID;
  const redirect_uri = "https://ppmcreator.pages.dev/api/auth/google/callback";
  const scope = "openid email profile";
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${client_id}&redirect_uri=${redirect_uri}&response_type=code&scope=${scope}&access_type=offline`;
  return Response.redirect(url, 302);
}
__name(onRequestGet, "onRequestGet");

// api/auth/google-callback.js
async function onRequestGet2(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  if (!code) return new Response("No code provided", { status: 400 });
  try {
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: env.GOOGLE_CLIENT_ID,
        client_secret: env.GOOGLE_CLIENT_SECRET,
        redirect_uri: "https://ppmcreator.pages.dev/api/auth/google/callback",
        grant_type: "authorization_code"
      })
    });
    const tokens = await tokenRes.json();
    if (!tokens.access_token) throw new Error("Token exchange failed");
    const userRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokens.access_token}` }
    });
    const user = await userRes.json();
    const existing = await env.DB.prepare("SELECT * FROM users WHERE email = ?").bind(user.email).first();
    if (!existing) {
      await env.DB.prepare(
        "INSERT INTO users (name, email, provider, provider_id, avatar_url) VALUES (?, ?, ?, ?, ?)"
      ).bind(user.name, user.email, "google", user.id, user.picture).run();
    }
    const headers = new Headers();
    headers.set("Set-Cookie", `user_email=${user.email}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=604800`);
    headers.set("Location", "/profile");
    return new Response(null, { status: 302, headers });
  } catch (err) {
    return new Response("Auth failed: " + err.message, { status: 500 });
  }
}
__name(onRequestGet2, "onRequestGet");

// api/auth/login-password.js
function bytesToHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(bytesToHex, "bytesToHex");
async function verifyPassword(password, stored) {
  const parts = (stored || "").split("$");
  if (parts.length !== 4 || parts[0] !== "pbkdf2") return false;
  const salt = new Uint8Array(parts[2].match(/.{2}/g).map((h) => parseInt(h, 16)));
  const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: parseInt(parts[1]), hash: "SHA-256" }, keyMaterial, 256);
  return bytesToHex(new Uint8Array(bits)) === parts[3];
}
__name(verifyPassword, "verifyPassword");
function validEmail2(e) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+\$/.test(e || "");
}
__name(validEmail2, "validEmail");
async function onRequestPost4(context) {
  const { request, env } = context;
  try {
    const b = await request.json();
    const email = (b.email || "").trim().toLowerCase();
    const password = b.password || "";
    if (!validEmail2(email) || !password) return json2({ error: "Email and password are required." }, 400);
    const user = await env.DB.prepare("SELECT email, password_hash, email_verified, name, avatar_url FROM users WHERE email = ?").bind(email).first();
    if (!user || !user.password_hash) return json2({ error: "Email or password is incorrect." }, 401);
    if (!user.email_verified) return json2({ error: "Please verify your email first. Check your inbox.", needs_verification: true }, 403);
    const ok = await verifyPassword(password, user.password_hash);
    if (!ok) return json2({ error: "Email or password is incorrect." }, 401);
    const headers = new Headers();
    headers.set("Set-Cookie", "user_email=" + encodeURIComponent(user.email) + "; Path=/; SameSite=Lax; Max-Age=2592000; Secure");
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify({ success: true, user: { email: user.email, name: user.name, avatar_url: user.avatar_url } }), { status: 200, headers });
  } catch (err) {
    return json2({ error: err.message }, 500);
  }
}
__name(onRequestPost4, "onRequestPost");
function json2(b, s) {
  return new Response(JSON.stringify(b), { status: s, headers: { "Content-Type": "application/json" } });
}
__name(json2, "json");

// api/auth/logout.js
async function onRequestPost5() {
  const headers = new Headers();
  headers.set("Set-Cookie", "user_email=; Path=/; Max-Age=0");
  return new Response(JSON.stringify({ success: true }), { headers, status: 200 });
}
__name(onRequestPost5, "onRequestPost");

// api/auth/profile.js
async function onRequestGet3(context) {
  const { request, env } = context;
  const cookie = request.headers.get("Cookie");
  const email = cookie?.split("; ").find((row) => row.startsWith("user_email="))?.split("=")[1];
  if (!email) return new Response(JSON.stringify({ error: "Not logged in" }), { status: 401 });
  try {
    const user = await env.DB.prepare("SELECT name, email, provider, avatar_url, created_at FROM users WHERE email = ?").bind(email).first();
    if (!user) return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    return new Response(JSON.stringify(user), { status: 200, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestGet3, "onRequestGet");

// api/auth/register.js
function bytesToHex2(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(bytesToHex2, "bytesToHex");
async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = bytesToHex2(salt);
  const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 1e5, hash: "SHA-256" }, keyMaterial, 256);
  return "pbkdf2\\$" + saltHex + "$" + bytesToHex2(new Uint8Array(bits));
}
__name(hashPassword, "hashPassword");
function randomToken2(len = 32) {
  const arr = crypto.getRandomValues(new Uint8Array(len));
  return Array.from(arr).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(randomToken2, "randomToken");
function validEmail3(e) {
  return /^[^@\s]+@[^@\s]+\.[^@\s]+\$/.test(e || "");
}
__name(validEmail3, "validEmail");
async function sendEmail2(env, to, subject, html) {
  const key = env.RESEND_API_KEY;
  if (!key) return { ok: false, error: "RESEND_API_KEY is not set. Add it in Cloudflare Pages env vars." };
  const from = env.RESEND_FROM || "PPM Creator <onboarding@resend.dev>";
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: "Bearer " + key, "Content-Type": "application/json" },
    body: JSON.stringify({ from, to: [to], subject, html })
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    return { ok: false, error: "Resend error: " + res.status + " " + t.slice(0, 200) };
  }
  return { ok: true };
}
__name(sendEmail2, "sendEmail");
function verifyEmailHtml(name, link) {
  return '<!DOCTYPE html><html><body style="margin:0;padding:0;background:#FAFAF9;font-family:-apple-system,Segoe UI,Roboto,sans-serif"><div style="max-width:560px;margin:32px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06)"><div style="background:#F97316;padding:28px 32px"><div style="color:#fff;font-size:22px;font-weight:700">PPM Creator</div><div style="color:#FFEDD5;font-size:13px;margin-top:4px">Verify your email to finish signing up</div></div><div style="padding:32px"><p style="font-size:15px;color:#1c1917;margin:0 0 16px">Hi ' + (name || "there") + ',</p><p style="font-size:15px;color:#374151;line-height:1.6;margin:0 0 20px">Welcome to PPM Creator. Tap the button below to verify your email address. This link expires in 24 hours.</p><a href="' + link + '" style="display:inline-block;padding:14px 28px;background:#F97316;color:#fff;text-decoration:none;border-radius:10px;font-weight:600;font-size:15px">Verify email</a><p style="font-size:13px;color:#6b7280;margin:24px 0 0">If the button does not work, copy this link into your browser:</p><p style="font-size:12px;color:#6b7280;word-break:break-all;background:#FAFAF9;padding:10px;border-radius:8px;margin:6px 0 0">' + link + '</p><p style="font-size:13px;color:#9ca3af;margin:24px 0 0">If you did not create an account, ignore this email.</p></div></div></body></html>';
}
__name(verifyEmailHtml, "verifyEmailHtml");
async function onRequestPost6(context) {
  const { request, env } = context;
  try {
    const b = await request.json();
    const email = (b.email || "").trim().toLowerCase();
    const password = b.password || "";
    const name = (b.name || "").trim();
    if (!validEmail3(email)) return json3({ error: "Enter a valid email." }, 400);
    if (password.length < 8) return json3({ error: "Password must be at least 8 characters." }, 400);
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT UNIQUE NOT NULL, provider TEXT NOT NULL, provider_id TEXT UNIQUE NOT NULL, avatar_url TEXT, password_hash TEXT, otp_code TEXT, otp_expires DATETIME, email_verified INTEGER DEFAULT 0, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)").run();
    const existing = await env.DB.prepare("SELECT id, email, email_verified FROM users WHERE email = ?").bind(email).first();
    if (existing && existing.email_verified) return json3({ error: "This email is already registered. Sign in instead." }, 409);
    const passwordHash = await hashPassword(password);
    if (existing) {
      await env.DB.prepare("UPDATE users SET password_hash = ?, name = ? WHERE email = ?").bind(passwordHash, name || existing.email.split("@")[0], email).run();
    } else {
      await env.DB.prepare("INSERT INTO users (email, provider, provider_id, name, password_hash, email_verified) VALUES (?, ?, ?, ?, ?, 0)").bind(email, "email", email, name || email.split("@")[0], passwordHash).run();
    }
    const token = randomToken2(32);
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1e3).toISOString();
    await env.DB.prepare("CREATE TABLE IF NOT EXISTS email_verifications (token TEXT PRIMARY KEY, email TEXT NOT NULL, expires DATETIME NOT NULL, used INTEGER DEFAULT 0)").run();
    await env.DB.prepare("INSERT INTO email_verifications (token, email, expires, used) VALUES (?, ?, ?, 0)").bind(token, email, expires).run();
    const origin = new URL(request.url).origin;
    const link = origin + "/verify-email?token=" + token;
    const sent = await sendEmail2(env, email, "Verify your PPM Creator account", verifyEmailHtml(name || email.split("@")[0], link));
    if (!sent.ok) return json3({ error: sent.error, verify_link: link }, 500);
    return json3({ success: true, message: "Check your inbox to verify your email." }, 200);
  } catch (err) {
    return json3({ error: err.message }, 500);
  }
}
__name(onRequestPost6, "onRequestPost");
function json3(body, status) {
  return new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });
}
__name(json3, "json");

// api/auth/reset-password.js
function bytesToHex3(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
__name(bytesToHex3, "bytesToHex");
async function hashPassword2(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const saltHex = bytesToHex3(salt);
  const keyMaterial = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 1e5, hash: "SHA-256" }, keyMaterial, 256);
  return "pbkdf2\\$" + saltHex + "$" + bytesToHex3(new Uint8Array(bits));
}
__name(hashPassword2, "hashPassword");
async function onRequestPost7(context) {
  const { request, env } = context;
  try {
    const b = await request.json();
    const token = (b.token || "").trim();
    const password = b.password || "";
    if (!token || !password) return json4({ error: "Token and password are required." }, 400);
    if (password.length < 8) return json4({ error: "Password must be at least 8 characters." }, 400);
    const row = await env.DB.prepare("SELECT email, expires, used FROM password_resets WHERE token = ?").bind(token).first();
    if (!row) return json4({ error: "Invalid or expired link." }, 400);
    if (row.used) return json4({ error: "This link has already been used." }, 400);
    if (new Date(row.expires).getTime() < Date.now()) return json4({ error: "This link has expired." }, 400);
    const passwordHash = await hashPassword2(password);
    await env.DB.prepare("UPDATE users SET password_hash = ?, email_verified = 1 WHERE email = ?").bind(passwordHash, row.email).run();
    await env.DB.prepare("UPDATE password_resets SET used = 1 WHERE token = ?").bind(token).run();
    return json4({ success: true }, 200);
  } catch (err) {
    return json4({ error: err.message }, 500);
  }
}
__name(onRequestPost7, "onRequestPost");
function json4(b, s) {
  return new Response(JSON.stringify(b), { status: s, headers: { "Content-Type": "application/json" } });
}
__name(json4, "json");

// api/auth/verify-link.js
async function onRequestPost8(context) {
  const { request, env } = context;
  try {
    const b = await request.json();
    const token = (b.token || "").trim();
    if (!token) return json5({ error: "Missing token." }, 400);
    const row = await env.DB.prepare("SELECT email, expires, used FROM email_verifications WHERE token = ?").bind(token).first();
    if (!row) return json5({ error: "Invalid or expired link." }, 400);
    if (row.used) return json5({ error: "This link has already been used." }, 400);
    if (new Date(row.expires).getTime() < Date.now()) return json5({ error: "This link has expired. Please register again." }, 400);
    await env.DB.prepare("UPDATE users SET email_verified = 1 WHERE email = ?").bind(row.email).run();
    await env.DB.prepare("UPDATE email_verifications SET used = 1 WHERE token = ?").bind(token).run();
    const headers = new Headers();
    headers.set("Set-Cookie", "user_email=" + encodeURIComponent(row.email) + "; Path=/; SameSite=Lax; Max-Age=2592000; Secure");
    headers.set("Content-Type", "application/json");
    return new Response(JSON.stringify({ success: true, email: row.email }), { status: 200, headers });
  } catch (err) {
    return json5({ error: err.message }, 500);
  }
}
__name(onRequestPost8, "onRequestPost");
function json5(b, s) {
  return new Response(JSON.stringify(b), { status: s, headers: { "Content-Type": "application/json" } });
}
__name(json5, "json");

// api/analytics.js
async function onRequestGet4(context) {
  const { env } = context;
  try {
    const { results } = await env.DB.prepare("SELECT COUNT(*) as total FROM analytics").all();
    const toolUsage = await env.DB.prepare("SELECT COUNT(*) as total FROM analytics WHERE page_url LIKE '%tool%'").all();
    return new Response(JSON.stringify({ visitors: results[0]?.total || 0, toolUsage: toolUsage[0]?.total || 0 }), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestGet4, "onRequestGet");
async function onRequestPost9(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    await env.DB.prepare("INSERT INTO analytics (page_url, visitor_ip) VALUES (?, ?)").bind(body.url, "ip-masked").run();
    return new Response(JSON.stringify({ success: true }), { status: 201 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestPost9, "onRequestPost");

// api/login.js
async function hmacSha1(key, message) {
  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(key),
    { name: "HMAC", hash: "SHA-1" },
    false,
    ["sign"]
  );
  return await crypto.subtle.sign("HMAC", cryptoKey, new TextEncoder().encode(message));
}
__name(hmacSha1, "hmacSha1");
function base32Decode(base32) {
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";
  let bits = "";
  base32 = base32.toUpperCase().replace(/=+$/, "");
  for (const char of base32) bits += alphabet.indexOf(char).toString(2).padStart(5, "0");
  const bytes = [];
  for (let i = 0; i + 8 <= bits.length; i += 8) bytes.push(parseInt(bits.substring(i, i + 8), 2));
  return new Uint8Array(bytes);
}
__name(base32Decode, "base32Decode");
async function verifyTOTP(secret, token) {
  const key = base32Decode(secret);
  const epoch = Math.floor(Date.now() / 1e3);
  const counter = Math.floor(epoch / 30);
  for (let i = -1; i <= 1; i++) {
    const buf = new ArrayBuffer(8);
    new DataView(buf).setBigUint64(0, BigInt(counter + i));
    const hmac = new Uint8Array(await hmacSha1(key, buf));
    const offset = hmac[hmac.length - 1] & 15;
    const code = ((hmac[offset] & 127) << 24 | hmac[offset + 1] << 16 | hmac[offset + 2] << 8 | hmac[offset + 3]) % 1e6;
    if (code.toString().padStart(6, "0") === token) return true;
  }
  return false;
}
__name(verifyTOTP, "verifyTOTP");
async function onRequestPost10(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    const { username, password, totpCode } = body;
    const ADMIN_SECRET = "JBSWY3DPEHPK3PXP";
    if (username === "hellowsai" && password === "Ppm@Demo2026") {
      if (totpCode) {
        const isValid = await verifyTOTP(ADMIN_SECRET, totpCode);
        if (!isValid) return new Response(JSON.stringify({ error: "Invalid 2FA code" }), { status: 401, headers: { "Content-Type": "application/json" } });
      }
      const headers = new Headers();
      headers.set("Set-Cookie", "admin_session=authenticated; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=7200");
      headers.set("Content-Type", "application/json");
      return new Response(JSON.stringify({ success: true }), { headers, status: 200 });
    }
    return new Response(JSON.stringify({ error: "Invalid credentials" }), { status: 401, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Server error" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
__name(onRequestPost10, "onRequestPost");

// api/posts.js
async function onRequestGet5(context) {
  const { env, request } = context;
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (id) {
      const row = await env.DB.prepare("SELECT * FROM posts WHERE id = ?").bind(id).first();
      return new Response(JSON.stringify(row || {}), { headers: { "Content-Type": "application/json" } });
    }
    const admin = url.searchParams.get("admin");
    const q = admin ? "SELECT id, title, slug, status, updated_at, thumbnail, meta_title, meta_description, length(content) AS content_len FROM posts ORDER BY updated_at DESC" : "SELECT id, title, slug, excerpt, meta_title, meta_description, content, thumbnail, status, created_at FROM posts WHERE status = 'published' ORDER BY created_at DESC";
    const { results } = await env.DB.prepare(q).all();
    return new Response(JSON.stringify(results || []), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
__name(onRequestGet5, "onRequestGet");
async function onRequestPost11(context) {
  const { request, env } = context;
  try {
    const b = await request.json();
    if (!b.title || !b.slug) {
      return new Response(JSON.stringify({ error: "title and slug are required" }), { status: 400 });
    }
    if (b.id) {
      await env.DB.prepare("UPDATE posts SET title=?, slug=?, content=?, excerpt=?, thumbnail=?, meta_title=?, meta_description=?, status=?, updated_at=CURRENT_TIMESTAMP WHERE id=?").bind(b.title, b.slug, b.content || "", b.excerpt || "", b.thumbnail || "", b.meta_title || "", b.meta_description || "", b.status || "draft", b.id).run();
    } else {
      await env.DB.prepare("INSERT INTO posts (title, slug, content, excerpt, thumbnail, meta_title, meta_description, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)").bind(b.title, b.slug, b.content || "", b.excerpt || "", b.thumbnail || "", b.meta_title || "", b.meta_description || "", b.status || "draft").run();
    }
    return new Response(JSON.stringify({ success: true }), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestPost11, "onRequestPost");
async function onRequestDelete(context) {
  const { env, request } = context;
  try {
    const url = new URL(request.url);
    const id = url.searchParams.get("id");
    if (!id) return new Response(JSON.stringify({ error: "id required" }), { status: 400 });
    await env.DB.prepare("DELETE FROM posts WHERE id = ?").bind(id).run();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestDelete, "onRequestDelete");

// api/session.js
async function onRequestGet6(context) {
  const { request } = context;
  const cookie = request.headers.get("Cookie") || "";
  const authed = cookie.includes("admin_session=authenticated");
  return new Response(JSON.stringify({ authed }), { headers: { "Content-Type": "application/json" } });
}
__name(onRequestGet6, "onRequestGet");
async function onRequestPost12(context) {
  const headers = new Headers();
  headers.set("Set-Cookie", "admin_session=; Path=/; Max-Age=0");
  return new Response(JSON.stringify({ success: true }), { headers, status: 200 });
}
__name(onRequestPost12, "onRequestPost");

// api/tools.js
async function onRequestGet7(context) {
  const { env } = context;
  try {
    const { results } = await env.DB.prepare("SELECT * FROM tool_pages").all();
    return new Response(JSON.stringify(results), { headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message, details: "Database fetch failed" }), { status: 500, headers: { "Content-Type": "application/json" } });
  }
}
__name(onRequestGet7, "onRequestGet");
async function onRequestPut(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    await env.DB.prepare(
      "UPDATE tool_pages SET h1_title = ?, meta_desc = ?, intro_text = ?, faq_json = ?, is_active = ? WHERE slug = ?"
    ).bind(body.h1_title, body.meta_desc, body.intro_text, body.faq_json, body.is_active, body.slug).run();
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestPut, "onRequestPut");

// api/update-password.js
async function onRequestPost13(context) {
  const { request, env } = context;
  try {
    const body = await request.json();
    if (body.newPassword && body.newPassword.length > 5) {
      return new Response(JSON.stringify({ success: true, message: "Password updated" }), { status: 200 });
    }
    return new Response(JSON.stringify({ error: "Password too short" }), { status: 400 });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestPost13, "onRequestPost");

// api/upload.js
async function onRequestPost14(context) {
  const { request, env } = context;
  try {
    const b = await request.json();
    if (!b.data_url || !b.data_url.startsWith("data:image/")) {
      return new Response(JSON.stringify({ error: "data_url must be a data:image URL" }), { status: 400 });
    }
    if (b.data_url.length > 3 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: "Image too large (max 2 MB after base64)" }), { status: 413 });
    }
    const id = crypto.randomUUID();
    await env.DB.prepare(
      "CREATE TABLE IF NOT EXISTS post_images (id TEXT PRIMARY KEY, data_url TEXT NOT NULL, created_at DATETIME DEFAULT CURRENT_TIMESTAMP)"
    ).run();
    await env.DB.prepare("INSERT INTO post_images (id, data_url) VALUES (?, ?)").bind(id, b.data_url).run();
    return new Response(JSON.stringify({ url: b.data_url, id }), { status: 201, headers: { "Content-Type": "application/json" } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
}
__name(onRequestPost14, "onRequestPost");

// sitemap.xml.js
async function onRequestGet8(context) {
  const { env } = context;
  try {
    const { results } = await env.DB.prepare("SELECT slug, created_at FROM posts WHERE status = 'published'").all();
    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://ppmcreator.pages.dev/</loc><priority>1.0</priority></url>
  <url><loc>https://ppmcreator.pages.dev/pdf-tools</loc><priority>0.9</priority></url>
  <url><loc>https://ppmcreator.pages.dev/image-tools</loc><priority>0.9</priority></url>
  <url><loc>https://ppmcreator.pages.dev/word-tools</loc><priority>0.9</priority></url>
  <url><loc>https://ppmcreator.pages.dev/blog</loc><priority>0.8</priority></url>`;
    results.forEach((post) => {
      sitemap += `
  <url><loc>https://ppmcreator.pages.dev/blog/${post.slug}</loc><lastmod>${new Date(post.created_at).toISOString().split("T")[0]}</lastmod><priority>0.7</priority></url>`;
    });
    sitemap += "\n</urlset>";
    return new Response(sitemap, {
      headers: { "Content-Type": "application/xml", "Cache-Control": "public, max-age=3600" }
    });
  } catch (err) {
    return new Response("Error generating sitemap", { status: 500 });
  }
}
__name(onRequestGet8, "onRequestGet");

// ../.wrangler/tmp/pages-5mbip8/functionsRoutes-0.4109329725389772.mjs
var routes = [
  {
    routePath: "/api/auth/email/send",
    mountPath: "/api/auth/email",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost]
  },
  {
    routePath: "/api/auth/email/verify",
    mountPath: "/api/auth/email",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost2]
  },
  {
    routePath: "/api/auth/forgot-password",
    mountPath: "/api/auth",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost3]
  },
  {
    routePath: "/api/auth/google",
    mountPath: "/api/auth",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet]
  },
  {
    routePath: "/api/auth/google-callback",
    mountPath: "/api/auth",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet2]
  },
  {
    routePath: "/api/auth/login-password",
    mountPath: "/api/auth",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost4]
  },
  {
    routePath: "/api/auth/logout",
    mountPath: "/api/auth",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost5]
  },
  {
    routePath: "/api/auth/profile",
    mountPath: "/api/auth",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet3]
  },
  {
    routePath: "/api/auth/register",
    mountPath: "/api/auth",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost6]
  },
  {
    routePath: "/api/auth/reset-password",
    mountPath: "/api/auth",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost7]
  },
  {
    routePath: "/api/auth/verify-link",
    mountPath: "/api/auth",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost8]
  },
  {
    routePath: "/api/analytics",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet4]
  },
  {
    routePath: "/api/analytics",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost9]
  },
  {
    routePath: "/api/login",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost10]
  },
  {
    routePath: "/api/posts",
    mountPath: "/api",
    method: "DELETE",
    middlewares: [],
    modules: [onRequestDelete]
  },
  {
    routePath: "/api/posts",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet5]
  },
  {
    routePath: "/api/posts",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost11]
  },
  {
    routePath: "/api/session",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet6]
  },
  {
    routePath: "/api/session",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost12]
  },
  {
    routePath: "/api/tools",
    mountPath: "/api",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet7]
  },
  {
    routePath: "/api/tools",
    mountPath: "/api",
    method: "PUT",
    middlewares: [],
    modules: [onRequestPut]
  },
  {
    routePath: "/api/update-password",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost13]
  },
  {
    routePath: "/api/upload",
    mountPath: "/api",
    method: "POST",
    middlewares: [],
    modules: [onRequestPost14]
  },
  {
    routePath: "/sitemap.xml",
    mountPath: "/",
    method: "GET",
    middlewares: [],
    modules: [onRequestGet8]
  }
];

// ../../../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/path-to-regexp/dist.es2015/index.js
function lexer(str) {
  var tokens = [];
  var i = 0;
  while (i < str.length) {
    var char = str[i];
    if (char === "*" || char === "+" || char === "?") {
      tokens.push({ type: "MODIFIER", index: i, value: str[i++] });
      continue;
    }
    if (char === "\\") {
      tokens.push({ type: "ESCAPED_CHAR", index: i++, value: str[i++] });
      continue;
    }
    if (char === "{") {
      tokens.push({ type: "OPEN", index: i, value: str[i++] });
      continue;
    }
    if (char === "}") {
      tokens.push({ type: "CLOSE", index: i, value: str[i++] });
      continue;
    }
    if (char === ":") {
      var name = "";
      var j = i + 1;
      while (j < str.length) {
        var code = str.charCodeAt(j);
        if (
          // `0-9`
          code >= 48 && code <= 57 || // `A-Z`
          code >= 65 && code <= 90 || // `a-z`
          code >= 97 && code <= 122 || // `_`
          code === 95
        ) {
          name += str[j++];
          continue;
        }
        break;
      }
      if (!name)
        throw new TypeError("Missing parameter name at ".concat(i));
      tokens.push({ type: "NAME", index: i, value: name });
      i = j;
      continue;
    }
    if (char === "(") {
      var count = 1;
      var pattern = "";
      var j = i + 1;
      if (str[j] === "?") {
        throw new TypeError('Pattern cannot start with "?" at '.concat(j));
      }
      while (j < str.length) {
        if (str[j] === "\\") {
          pattern += str[j++] + str[j++];
          continue;
        }
        if (str[j] === ")") {
          count--;
          if (count === 0) {
            j++;
            break;
          }
        } else if (str[j] === "(") {
          count++;
          if (str[j + 1] !== "?") {
            throw new TypeError("Capturing groups are not allowed at ".concat(j));
          }
        }
        pattern += str[j++];
      }
      if (count)
        throw new TypeError("Unbalanced pattern at ".concat(i));
      if (!pattern)
        throw new TypeError("Missing pattern at ".concat(i));
      tokens.push({ type: "PATTERN", index: i, value: pattern });
      i = j;
      continue;
    }
    tokens.push({ type: "CHAR", index: i, value: str[i++] });
  }
  tokens.push({ type: "END", index: i, value: "" });
  return tokens;
}
__name(lexer, "lexer");
function parse(str, options) {
  if (options === void 0) {
    options = {};
  }
  var tokens = lexer(str);
  var _a = options.prefixes, prefixes = _a === void 0 ? "./" : _a, _b = options.delimiter, delimiter = _b === void 0 ? "/#?" : _b;
  var result = [];
  var key = 0;
  var i = 0;
  var path = "";
  var tryConsume = /* @__PURE__ */ __name(function(type) {
    if (i < tokens.length && tokens[i].type === type)
      return tokens[i++].value;
  }, "tryConsume");
  var mustConsume = /* @__PURE__ */ __name(function(type) {
    var value2 = tryConsume(type);
    if (value2 !== void 0)
      return value2;
    var _a2 = tokens[i], nextType = _a2.type, index = _a2.index;
    throw new TypeError("Unexpected ".concat(nextType, " at ").concat(index, ", expected ").concat(type));
  }, "mustConsume");
  var consumeText = /* @__PURE__ */ __name(function() {
    var result2 = "";
    var value2;
    while (value2 = tryConsume("CHAR") || tryConsume("ESCAPED_CHAR")) {
      result2 += value2;
    }
    return result2;
  }, "consumeText");
  var isSafe = /* @__PURE__ */ __name(function(value2) {
    for (var _i = 0, delimiter_1 = delimiter; _i < delimiter_1.length; _i++) {
      var char2 = delimiter_1[_i];
      if (value2.indexOf(char2) > -1)
        return true;
    }
    return false;
  }, "isSafe");
  var safePattern = /* @__PURE__ */ __name(function(prefix2) {
    var prev = result[result.length - 1];
    var prevText = prefix2 || (prev && typeof prev === "string" ? prev : "");
    if (prev && !prevText) {
      throw new TypeError('Must have text between two parameters, missing text after "'.concat(prev.name, '"'));
    }
    if (!prevText || isSafe(prevText))
      return "[^".concat(escapeString(delimiter), "]+?");
    return "(?:(?!".concat(escapeString(prevText), ")[^").concat(escapeString(delimiter), "])+?");
  }, "safePattern");
  while (i < tokens.length) {
    var char = tryConsume("CHAR");
    var name = tryConsume("NAME");
    var pattern = tryConsume("PATTERN");
    if (name || pattern) {
      var prefix = char || "";
      if (prefixes.indexOf(prefix) === -1) {
        path += prefix;
        prefix = "";
      }
      if (path) {
        result.push(path);
        path = "";
      }
      result.push({
        name: name || key++,
        prefix,
        suffix: "",
        pattern: pattern || safePattern(prefix),
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    var value = char || tryConsume("ESCAPED_CHAR");
    if (value) {
      path += value;
      continue;
    }
    if (path) {
      result.push(path);
      path = "";
    }
    var open = tryConsume("OPEN");
    if (open) {
      var prefix = consumeText();
      var name_1 = tryConsume("NAME") || "";
      var pattern_1 = tryConsume("PATTERN") || "";
      var suffix = consumeText();
      mustConsume("CLOSE");
      result.push({
        name: name_1 || (pattern_1 ? key++ : ""),
        pattern: name_1 && !pattern_1 ? safePattern(prefix) : pattern_1,
        prefix,
        suffix,
        modifier: tryConsume("MODIFIER") || ""
      });
      continue;
    }
    mustConsume("END");
  }
  return result;
}
__name(parse, "parse");
function match(str, options) {
  var keys = [];
  var re = pathToRegexp(str, keys, options);
  return regexpToFunction(re, keys, options);
}
__name(match, "match");
function regexpToFunction(re, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.decode, decode = _a === void 0 ? function(x) {
    return x;
  } : _a;
  return function(pathname) {
    var m = re.exec(pathname);
    if (!m)
      return false;
    var path = m[0], index = m.index;
    var params = /* @__PURE__ */ Object.create(null);
    var _loop_1 = /* @__PURE__ */ __name(function(i2) {
      if (m[i2] === void 0)
        return "continue";
      var key = keys[i2 - 1];
      if (key.modifier === "*" || key.modifier === "+") {
        params[key.name] = m[i2].split(key.prefix + key.suffix).map(function(value) {
          return decode(value, key);
        });
      } else {
        params[key.name] = decode(m[i2], key);
      }
    }, "_loop_1");
    for (var i = 1; i < m.length; i++) {
      _loop_1(i);
    }
    return { path, index, params };
  };
}
__name(regexpToFunction, "regexpToFunction");
function escapeString(str) {
  return str.replace(/([.+*?=^!:${}()[\]|/\\])/g, "\\$1");
}
__name(escapeString, "escapeString");
function flags(options) {
  return options && options.sensitive ? "" : "i";
}
__name(flags, "flags");
function regexpToRegexp(path, keys) {
  if (!keys)
    return path;
  var groupsRegex = /\((?:\?<(.*?)>)?(?!\?)/g;
  var index = 0;
  var execResult = groupsRegex.exec(path.source);
  while (execResult) {
    keys.push({
      // Use parenthesized substring match if available, index otherwise
      name: execResult[1] || index++,
      prefix: "",
      suffix: "",
      modifier: "",
      pattern: ""
    });
    execResult = groupsRegex.exec(path.source);
  }
  return path;
}
__name(regexpToRegexp, "regexpToRegexp");
function arrayToRegexp(paths, keys, options) {
  var parts = paths.map(function(path) {
    return pathToRegexp(path, keys, options).source;
  });
  return new RegExp("(?:".concat(parts.join("|"), ")"), flags(options));
}
__name(arrayToRegexp, "arrayToRegexp");
function stringToRegexp(path, keys, options) {
  return tokensToRegexp(parse(path, options), keys, options);
}
__name(stringToRegexp, "stringToRegexp");
function tokensToRegexp(tokens, keys, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.strict, strict = _a === void 0 ? false : _a, _b = options.start, start = _b === void 0 ? true : _b, _c = options.end, end = _c === void 0 ? true : _c, _d = options.encode, encode = _d === void 0 ? function(x) {
    return x;
  } : _d, _e = options.delimiter, delimiter = _e === void 0 ? "/#?" : _e, _f = options.endsWith, endsWith = _f === void 0 ? "" : _f;
  var endsWithRe = "[".concat(escapeString(endsWith), "]|$");
  var delimiterRe = "[".concat(escapeString(delimiter), "]");
  var route = start ? "^" : "";
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (typeof token === "string") {
      route += escapeString(encode(token));
    } else {
      var prefix = escapeString(encode(token.prefix));
      var suffix = escapeString(encode(token.suffix));
      if (token.pattern) {
        if (keys)
          keys.push(token);
        if (prefix || suffix) {
          if (token.modifier === "+" || token.modifier === "*") {
            var mod = token.modifier === "*" ? "?" : "";
            route += "(?:".concat(prefix, "((?:").concat(token.pattern, ")(?:").concat(suffix).concat(prefix, "(?:").concat(token.pattern, "))*)").concat(suffix, ")").concat(mod);
          } else {
            route += "(?:".concat(prefix, "(").concat(token.pattern, ")").concat(suffix, ")").concat(token.modifier);
          }
        } else {
          if (token.modifier === "+" || token.modifier === "*") {
            throw new TypeError('Can not repeat "'.concat(token.name, '" without a prefix and suffix'));
          }
          route += "(".concat(token.pattern, ")").concat(token.modifier);
        }
      } else {
        route += "(?:".concat(prefix).concat(suffix, ")").concat(token.modifier);
      }
    }
  }
  if (end) {
    if (!strict)
      route += "".concat(delimiterRe, "?");
    route += !options.endsWith ? "$" : "(?=".concat(endsWithRe, ")");
  } else {
    var endToken = tokens[tokens.length - 1];
    var isEndDelimited = typeof endToken === "string" ? delimiterRe.indexOf(endToken[endToken.length - 1]) > -1 : endToken === void 0;
    if (!strict) {
      route += "(?:".concat(delimiterRe, "(?=").concat(endsWithRe, "))?");
    }
    if (!isEndDelimited) {
      route += "(?=".concat(delimiterRe, "|").concat(endsWithRe, ")");
    }
  }
  return new RegExp(route, flags(options));
}
__name(tokensToRegexp, "tokensToRegexp");
function pathToRegexp(path, keys, options) {
  if (path instanceof RegExp)
    return regexpToRegexp(path, keys);
  if (Array.isArray(path))
    return arrayToRegexp(path, keys, options);
  return stringToRegexp(path, keys, options);
}
__name(pathToRegexp, "pathToRegexp");

// ../../../../../AppData/Local/npm-cache/_npx/32026684e21afda6/node_modules/wrangler/templates/pages-template-worker.ts
var escapeRegex = /[.+?^${}()|[\]\\]/g;
function* executeRequest(request) {
  const requestPath = new URL(request.url).pathname;
  for (const route of [...routes].reverse()) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult) {
      for (const handler of route.middlewares.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: mountMatchResult.path
        };
      }
    }
  }
  for (const route of routes) {
    if (route.method && route.method !== request.method) {
      continue;
    }
    const routeMatcher = match(route.routePath.replace(escapeRegex, "\\$&"), {
      end: true
    });
    const mountMatcher = match(route.mountPath.replace(escapeRegex, "\\$&"), {
      end: false
    });
    const matchResult = routeMatcher(requestPath);
    const mountMatchResult = mountMatcher(requestPath);
    if (matchResult && mountMatchResult && route.modules.length) {
      for (const handler of route.modules.flat()) {
        yield {
          handler,
          params: matchResult.params,
          path: matchResult.path
        };
      }
      break;
    }
  }
}
__name(executeRequest, "executeRequest");
var pages_template_worker_default = {
  async fetch(originalRequest, env, workerContext) {
    let request = originalRequest;
    const handlerIterator = executeRequest(request);
    let data = {};
    let isFailOpen = false;
    const next = /* @__PURE__ */ __name(async (input, init) => {
      if (input !== void 0) {
        let url = input;
        if (typeof input === "string") {
          url = new URL(input, request.url).toString();
        }
        request = new Request(url, init);
      }
      const result = handlerIterator.next();
      if (result.done === false) {
        const { handler, params, path } = result.value;
        const context = {
          request: new Request(request.clone()),
          functionPath: path,
          next,
          params,
          get data() {
            return data;
          },
          set data(value) {
            if (typeof value !== "object" || value === null) {
              throw new Error("context.data must be an object");
            }
            data = value;
          },
          env,
          waitUntil: workerContext.waitUntil.bind(workerContext),
          passThroughOnException: /* @__PURE__ */ __name(() => {
            isFailOpen = true;
          }, "passThroughOnException")
        };
        const response = await handler(context);
        if (!(response instanceof Response)) {
          throw new Error("Your Pages function should return a Response");
        }
        return cloneResponse(response);
      } else if ("ASSETS") {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      } else {
        const response = await fetch(request);
        return cloneResponse(response);
      }
    }, "next");
    try {
      return await next();
    } catch (error) {
      if (isFailOpen) {
        const response = await env["ASSETS"].fetch(request);
        return cloneResponse(response);
      }
      throw error;
    }
  }
};
var cloneResponse = /* @__PURE__ */ __name((response) => (
  // https://fetch.spec.whatwg.org/#null-body-status
  new Response(
    [101, 204, 205, 304].includes(response.status) ? null : response.body,
    response
  )
), "cloneResponse");
export {
  pages_template_worker_default as default
};
