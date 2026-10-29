export async function sendEmail(env, to, subject, html) {
  const key = env.RESEND_API_KEY;
  if (!key) return { ok: false, error: 'RESEND_API_KEY is not set. Add it in Cloudflare Pages env vars.' };
  const from = env.RESEND_FROM || 'PPM Creator <onboarding@resend.dev>';
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from, to: [to], subject, html }),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    return { ok: false, error: 'Resend error: ' + res.status + ' ' + text.slice(0, 200) };
  }
  return { ok: true };
}