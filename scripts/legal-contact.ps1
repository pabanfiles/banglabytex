$ErrorActionPreference = "Stop"
$utf8 = New-Object System.Text.UTF8Encoding $false
$pages = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend\src\pages\legal"
$functions = "C:\Users\PERSONAL\Desktop\Patit\banglabytex-main\frontend\functions\api"

if (-not (Test-Path $pages)) { New-Item -ItemType Directory -Path $pages -Force | Out-Null }
if (-not (Test-Path $functions)) { New-Item -ItemType Directory -Path $functions -Force | Out-Null }

# 1. About.tsx
$about = @'
import Seo from '../../components/Seo'
export default function About() {
  return (
    <>
      <Seo title="About | PPM Creator" description="PPM Creator is a free collection of browser-based tools for images, PDFs, text and everyday calculations. Files stay on your device." path="/about" />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '48px 18px', lineHeight: 1.75, color: '#374151' }}>
        <h1 style={{ fontSize: 32, margin: '0 0 8px', color: '#1c1917' }}>About PPM Creator</h1>
        <p style={{ fontSize: 15, color: '#6b7280', margin: '0 0 32px' }}>Free browser tools for images, PDFs, text and everyday tasks.</p>

        <h2 style={{ fontSize: 20, color: '#1c1917', margin: '32px 0 12px' }}>What we do</h2>
        <p>PPM Creator is a growing collection of free online tools. The idea is simple: every tool runs inside your browser, so your files never leave your device. No signup, no upload, no waiting for a server.</p>
        <p>You can compress an image, merge a PDF, calculate your age, generate a QR code, test a piece of HTML or convert a CSV to JSON — all without installing anything.</p>

        <h2 style={{ fontSize: 20, color: '#1c1917', margin: '32px 0 12px' }}>Why we built it</h2>
        <p>Most online tools ask for an email, upload your file to a server, and show ads before you can download the result. That model works, but it is slow and it puts your private files in someone else's hands.</p>
        <p>We wanted a different approach: keep the processing local, keep the interface fast, and keep the tool free. Every tool on this site follows that rule.</p>

        <h2 style={{ fontSize: 20, color: '#1c1917', margin: '32px 0 12px' }}>How it works</h2>
        <p>The site is built on modern web technology: React for the interface, Cloudflare Pages for hosting, and browser APIs such as Canvas, WebAssembly and PDF libraries for the actual work. When a tool can run entirely in your browser, it does. When it cannot, we tell you.</p>
        <p>We never claim a result that we have not tested. If a tool does not fully work in your browser, we say so on the page.</p>

        <h2 style={{ fontSize: 20, color: '#1c1917', margin: '32px 0 12px' }}>Get in touch</h2>
        <p>Questions, bug reports and feature ideas are welcome. Use the <a href="/contact" style={{ color: '#F97316' }}>contact form</a> or email us at <a href="mailto:hello@ppmcreator.com" style={{ color: '#F97316' }}>hello@ppmcreator.com</a>.</p>

        <p style={{ fontSize: 13, color: '#9ca3af', marginTop: 40 }}>Last updated: October 2026</p>
      </main>
    </>
  )
}
'@
[System.IO.File]::WriteAllText("$pages\About.tsx", $about, $utf8)
Write-Host "[+] About.tsx" -ForegroundColor Green

# 2. Contact.tsx with form
$contact = @'
import { useState } from 'react'
import Seo from '../../components/Seo'

export default function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [subject, setSubject] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    if (!name || !email || !message) { setError('Please fill in name, email and message.'); return }
    setBusy(true)
    try {
      const r = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message }),
      })
      const d = await r.json().catch(() => ({}))
      if (!r.ok) { setError(d.error || 'Could not send your message. Try again later.'); return }
      setSent(true)
      setName(''); setEmail(''); setSubject(''); setMessage('')
    } catch { setError('Could not reach the server. Check your connection.') }
    finally { setBusy(false) }
  }

  return (
    <>
      <Seo title="Contact | PPM Creator" description="Send a question, bug report or feature idea to PPM Creator." path="/contact" />
      <main style={{ maxWidth: 620, margin: '0 auto', padding: '48px 18px', lineHeight: 1.7, color: '#374151' }}>
        <h1 style={{ fontSize: 32, margin: '0 0 8px', color: '#1c1917' }}>Contact us</h1>
        <p style={{ color: '#6b7280', margin: '0 0 28px' }}>Send a question, a bug report or a feature idea. We read every message.</p>

        {sent ? (
          <div style={{ background: '#DCFCE7', border: '1px solid #86efac', borderRadius: 12, padding: 24, color: '#14532D' }}>
            <b style={{ display: 'block', marginBottom: 8 }}>Message sent</b>
            Thank you for writing. Your message reached our inbox. We usually reply within two working days.
            <div style={{ marginTop: 14 }}>
              <button type="button" onClick={() => setSent(false)} style={{ background: '#15803D', color: '#fff', border: 0, padding: '8px 16px', borderRadius: 8, cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>Send another message</button>
            </div>
          </div>
        ) : (
          <form onSubmit={submit} style={{ background: '#fff', border: '1px solid #e7e5e4', borderRadius: 16, padding: 24 }}>
            <label style={lbl}>Your name<input value={name} onChange={(e) => setName(e.target.value)} required style={inp} /></label>
            <label style={lbl}>Email<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" style={inp} /></label>
            <label style={lbl}>Subject (optional)<input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="e.g. Bug in image compressor" style={inp} /></label>
            <label style={lbl}>Message<textarea value={message} onChange={(e) => setMessage(e.target.value)} required rows={6} placeholder="Describe your question or the problem you saw." style={{ ...inp, fontFamily: 'inherit', resize: 'vertical' }} /></label>
            {error && <p style={{ background: '#FEF2F2', color: '#B91C1C', fontSize: 13, padding: '10px 12px', borderRadius: 8, margin: '0 0 12px' }}>{error}</p>}
            <button type="submit" disabled={busy} style={{ width: '100%', padding: '12px 20px', background: busy ? '#fdba74' : '#F97316', color: '#fff', border: 0, borderRadius: 10, fontWeight: 600, fontSize: 14, cursor: busy ? 'wait' : 'pointer' }}>
              {busy ? 'Sending...' : 'Send message'}
            </button>
            <p style={{ fontSize: 12, color: '#9ca3af', marginTop: 12, textAlign: 'center' }}>Your message goes straight to our inbox. We never share your email.</p>
          </form>
        )}

        <h2 style={{ fontSize: 18, color: '#1c1917', marginTop: 40 }}>Other ways to reach us</h2>
        <p>Email: <a href="mailto:hello@ppmcreator.com" style={{ color: '#F97316' }}>hello@ppmcreator.com</a></p>
        <p>We usually reply within two working days.</p>
      </main>
    </>
  )
}

const lbl: React.CSSProperties = { display: 'block', fontSize: 13, fontWeight: 500, color: '#374151', marginBottom: 14 }
const inp: React.CSSProperties = { width: '100%', padding: '11px 13px', border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 6, fontSize: 14, outline: 'none', boxSizing: 'border-box' }
'@
[System.IO.File]::WriteAllText("$pages\Contact.tsx", $contact, $utf8)
Write-Host "[+] Contact.tsx (with form)" -ForegroundColor Green

# 3. Privacy.tsx
$privacy = @'
import Seo from '../../components/Seo'
export default function Privacy() {
  return (
    <>
      <Seo title="Privacy Policy | PPM Creator" description="What PPM Creator stores, what it does not store, and how the tools handle your files." path="/privacy-policy" />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '48px 18px', lineHeight: 1.75, color: '#374151' }}>
        <h1 style={{ fontSize: 32, margin: '0 0 8px', color: '#1c1917' }}>Privacy Policy</h1>
        <p style={{ color: '#6b7280', margin: '0 0 32px' }}>Last updated: October 2026</p>

        <h2 style={h2}>Short version</h2>
        <p>Most tools on this site process your files inside your browser. Those files are not uploaded and are not stored. We only collect anonymous usage counts (how many times a tool ran) so we can see which tools people use.</p>

        <h2 style={h2}>What we store</h2>
        <ul style={{ paddingLeft: 22 }}>
          <li><b>Tool usage counts</b> — the name of the tool and the number of runs, grouped by day. No file names, no file contents, no IP addresses, no personal data.</li>
          <li><b>Page view counts</b> — the URL path and the number of views, grouped by day. No IP addresses, no referrers.</li>
          <li><b>Account email</b> — if you create an account, we store your email address and a salted password hash. Passwords are never stored in plain text.</li>
          <li><b>Contact form messages</b> — name, email, subject and message, kept in our inbox only.</li>
        </ul>

        <h2 style={h2}>What we do not store</h2>
        <ul style={{ paddingLeft: 22 }}>
          <li>Your files or their contents. Images and PDFs are processed in your browser.</li>
          <li>Your IP address in a readable form.</li>
          <li>Any personal data beyond what is listed above.</li>
        </ul>

        <h2 style={h2}>Cookies</h2>
        <p>The site sets one cookie, <code>user_email</code>, only after you sign in. It keeps you logged in for 30 days. It does not track you across other sites. You can clear it any time from your browser settings.</p>

        <h2 style={h2}>Analytics</h2>
        <p>Page views come from Cloudflare Web Analytics, a privacy-friendly analytics service that does not use cookies or fingerprints. Tool runs come from a small anonymous counter in our database. Neither stores personal data.</p>

        <h2 style={h2}>Third-party services</h2>
        <ul style={{ paddingLeft: 22 }}>
          <li><b>Cloudflare</b> — hosting, database, and page-view analytics.</li>
          <li><b>Google Sign-in</b> — optional. If you use it, Google shares your name and email with us, and only that.</li>
          <li><b>Email provider</b> — used to send verification and reset emails. Your email is shared only to deliver those messages.</li>
        </ul>

        <h2 style={h2}>Your rights</h2>
        <p>You can request a copy of the data we hold about you, ask us to correct it, or ask us to delete it. Write to <a href="mailto:hello@ppmcreator.com" style={{ color: '#F97316' }}>hello@ppmcreator.com</a>. We respond within 30 days.</p>

        <h2 style={h2}>Children</h2>
        <p>The site is not directed to children under 13. We do not knowingly store data from children.</p>

        <h2 style={h2}>Changes</h2>
        <p>If this policy changes, we will update the date at the top of this page. Continued use of the site after a change means you accept the new policy.</p>
      </main>
    </>
  )
}
const h2: React.CSSProperties = { fontSize: 20, color: '#1c1917', margin: '32px 0 12px' }
'@
[System.IO.File]::WriteAllText("$pages\Privacy.tsx", $privacy, $utf8)
Write-Host "[+] Privacy.tsx" -ForegroundColor Green

# 4. Terms.tsx
$terms = @'
import Seo from '../../components/Seo'
export default function Terms() {
  return (
    <>
      <Seo title="Terms of Use | PPM Creator" description="Terms under which PPM Creator tools are provided." path="/terms" />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '48px 18px', lineHeight: 1.75, color: '#374151' }}>
        <h1 style={{ fontSize: 32, margin: '0 0 8px', color: '#1c1917' }}>Terms of Use</h1>
        <p style={{ color: '#6b7280', margin: '0 0 32px' }}>Last updated: October 2026</p>

        <h2 style={h2}>1. Acceptance</h2>
        <p>By using ppmcreator.pages.dev or any tool on it, you agree to these terms. If you do not agree, please do not use the site.</p>

        <h2 style={h2}>2. Service</h2>
        <p>The tools are provided free of charge, as is, without any guarantee of availability, accuracy or fitness for a particular purpose. We may change, suspend or remove a tool at any time.</p>

        <h2 style={h2}>3. Acceptable use</h2>
        <p>You agree not to use the site to:</p>
        <ul style={{ paddingLeft: 22 }}>
          <li>Upload or process any file that you do not have the right to use.</li>
          <li>Attempt to break, overload or interfere with the site or its infrastructure.</li>
          <li>Use the site to break any law in your country.</li>
          <li>Resell the tools as your own.</li>
        </ul>

        <h2 style={h2}>4. Your files</h2>
        <p>Most tools process files inside your browser. You keep full ownership of any file you use. We do not claim any rights over your content. For tools that require a server (rare), the file is deleted from the temporary store as soon as the result is delivered.</p>

        <h2 style={h2}>5. Accounts</h2>
        <p>You are responsible for keeping your password and email secure. If you notice unauthorized access, write to <a href="mailto:hello@ppmcreator.com" style={{ color: '#F97316' }}>hello@ppmcreator.com</a> immediately. We may suspend an account that breaks these terms.</p>

        <h2 style={h2}>6. No warranty</h2>
        <p>The tools are provided without warranty of any kind, express or implied. We are not responsible for any loss caused by using the site, including loss of data, missed deadlines or incorrect output. Always keep a copy of the original file.</p>

        <h2 style={h2}>7. Limitation of liability</h2>
        <p>To the maximum extent permitted by law, we are not liable for indirect, incidental or consequential damages arising from the use of the site.</p>

        <h2 style={h2}>8. Changes</h2>
        <p>We may update these terms. The date at the top shows the latest version. Continued use after a change means you accept the new terms.</p>

        <h2 style={h2}>9. Contact</h2>
        <p>Questions? Write to <a href="mailto:hello@ppmcreator.com" style={{ color: '#F97316' }}>hello@ppmcreator.com</a>.</p>
      </main>
    </>
  )
}
const h2: React.CSSProperties = { fontSize: 20, color: '#1c1917', margin: '32px 0 12px' }
'@
[System.IO.File]::WriteAllText("$pages\Terms.tsx", $terms, $utf8)
Write-Host "[+] Terms.tsx" -ForegroundColor Green

# 5. Disclaimer.tsx
$disclaimer = @'
import Seo from '../../components/Seo'
export default function Disclaimer() {
  return (
    <>
      <Seo title="Disclaimer | PPM Creator" description="What PPM Creator tools do and do not guarantee." path="/disclaimer" />
      <main style={{ maxWidth: 760, margin: '0 auto', padding: '48px 18px', lineHeight: 1.75, color: '#374151' }}>
        <h1 style={{ fontSize: 32, margin: '0 0 8px', color: '#1c1917' }}>Disclaimer</h1>
        <p style={{ color: '#6b7280', margin: '0 0 32px' }}>Last updated: October 2026</p>

        <h2 style={h2}>General</h2>
        <p>PPM Creator provides free online tools for images, PDFs, text and everyday calculations. The tools are provided as-is. We do not guarantee any specific result, file size or outcome.</p>

        <h2 style={h2}>No guarantee of outcome</h2>
        <p>Compression, conversion and calculation results depend on the input file and your device. Always check important output before using it for a form, submission or publication.</p>

        <h2 style={h2}>Not professional advice</h2>
        <p>Nothing on this site is legal, financial, medical, tax or government advice. For official form sizes, fees, deadlines or document requirements, always check the official instructions published by the relevant authority.</p>

        <h2 style={h2}>Government forms</h2>
        <p>We do not publish or claim government form sizes, prices or photo specifications. Every form sets its own rules, and those rules change. Check the official instructions for the form you are filling.</p>

        <h2 style={h2}>Third-party links</h2>
        <p>Some pages link to external sites. We are not responsible for their content, availability or privacy practices.</p>

        <h2 style={h2}>No warranty on uptime</h2>
        <p>We aim to keep the site running, but we do not guarantee uptime. Plan ahead for time-sensitive tasks and keep a backup of your work.</p>

        <h2 style={h2}>Contact</h2>
        <p>Questions? Email <a href="mailto:hello@ppmcreator.com" style={{ color: '#F97316' }}>hello@ppmcreator.com</a>.</p>
      </main>
    </>
  )
}
const h2: React.CSSProperties = { fontSize: 20, color: '#1c1917', margin: '32px 0 12px' }
'@
[System.IO.File]::WriteAllText("$pages\Disclaimer.tsx", $disclaimer, $utf8)
Write-Host "[+] Disclaimer.tsx" -ForegroundColor Green

# 6. Backend contact endpoint
$contactApi = @'
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
'@
[System.IO.File]::WriteAllText("$functions\contact.js", $contactApi, $utf8)
Write-Host "[+] contact.js (backend)" -ForegroundColor Green

Write-Host "=== Legal pages + Contact form done ===" -ForegroundColor Green