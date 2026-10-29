async function sendEmail(env, to, replyTo, subject, html) {
  const token = env.MAILTRAP_API_TOKEN;
  if (token) {
    const fromEmail = env.MAILTRAP_FROM_EMAIL || 'hello@demomailtrap.com';
    const fromName = env.MAILTRAP_FROM_NAME || 'PPM Creator';
    const res = await fetch('https://send.api.mailtrap.io/api/send', {
      method: 'POST',
      headers: { 'Api-Token': token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: { email: fromEmail, name: fromName }, to: [{ email: to }], replyTo: { email: replyTo }, subject, html }),
    });
    if (!res.ok) { const t = await res.text().catch(() => ''); return { ok: false, error: 'Mailtrap ' + res.status + ' ' + t.slice(0, 200) }; }
    return { ok: true };
  }
  const rk = env.RESEND_API_KEY;
  if (rk) {
    const from = env.RESEND_FROM || 'PPM Creator <onboarding@resend.dev>';
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer ' + rk, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from, to: [to], reply_to: replyTo, subject, html }),
    });
    if (!res.ok) { const t = await res.text().catch(() => ''); return { ok: false, error: 'Resend ' + res.status + ' ' + t.slice(0, 200) }; }
    return { ok: true };
  }
  return { ok: false, error: 'No email provider configured. Set MAILTRAP_API_TOKEN or RESEND_API_KEY in Cloudflare env vars.' };
}

export async function onRequestPost(context) {
  const { request, env } = context;
  try {
    const b = await request.json();
    const name = (b.name || '').trim();
    const email = (b.email || '').trim();
    const subject = (b.subject || '').trim() || 'New contact message';
    const message = (b.message || '').trim();
    if (!name || !email || !message) {
      return new Response(JSON.stringify({ error: 'Name, email and message are required.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      return new Response(JSON.stringify({ error: 'Please enter a valid email.' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }
    const to = env.CONTACT_TO || 'fb.vedamworld@gmail.com';
    const html = '<div style="font-family:system-ui,sans-serif;max-width:600px;margin:0 auto;padding:20px;background:#FAFAF9"><div style="background:#fff;border:1px solid #e7e5e4;border-radius:12px;padding:24px"><h2 style="margin:0 0 12px;color:#1c1917">New contact message</h2><p style="color:#6b7280;font-size:13px;margin:0 0 16px">From the PPM Creator contact form</p><p style="margin:0 0 8px"><b>Name:</b> ' + name + '</p><p style="margin:0 0 8px"><b>Email:</b> <a href="mailto:' + email + '" style="color:#F97316">' + email + '</a></p><p style="margin:0 0 16px"><b>Subject:</b> ' + subject + '</p><hr style="border:0;border-top:1px solid #e7e5e4;margin:16px 0" /><p style="white-space:pre-wrap;line-height:1.6;color:#1c1917">' + message.replace(/</g, '&lt;') + '</p></div></div>';
    const sent = await sendEmail(env, to, email, '[Contact] ' + subject, html);
    if (!sent.ok) {
      return new Response(JSON.stringify({ error: sent.error }), { status: 500, headers: { 'Content-Type': 'application/json' } });
    }
    return new Response(JSON.stringify({ success: true }), { status: 200, headers: { 'Content-Type': 'application/json' } });
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
}