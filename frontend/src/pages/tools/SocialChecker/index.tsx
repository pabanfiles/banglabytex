import { useMemo, useState } from 'react'
import ToolShell from '@/components/ToolShell'

const PLATFORMS = [
  { name: 'Instagram', url: (u: string) => 'https://instagram.com/' + u },
  { name: 'Twitter / X', url: (u: string) => 'https://x.com/' + u },
  { name: 'Facebook', url: (u: string) => 'https://facebook.com/' + u },
  { name: 'GitHub', url: (u: string) => 'https://github.com/' + u },
  { name: 'TikTok', url: (u: string) => 'https://tiktok.com/@' + u },
  { name: 'YouTube', url: (u: string) => 'https://youtube.com/@' + u },
  { name: 'Reddit', url: (u: string) => 'https://reddit.com/user/' + u },
  { name: 'Pinterest', url: (u: string) => 'https://pinterest.com/' + u },
  { name: 'LinkedIn', url: (u: string) => 'https://linkedin.com/in/' + u },
  { name: 'Telegram', url: (u: string) => 'https://t.me/' + u },
  { name: 'Medium', url: (u: string) => 'https://medium.com/@' + u },
  { name: 'Twitch', url: (u: string) => 'https://twitch.tv/' + u },
]

export default function SocialChecker() {
  const [name, setName] = useState('')

  const clean = useMemo(() => name.trim().toLowerCase().replace(/[^a-z0-9._-]/g, ''), [name])
  const valid = clean.length >= 3 && clean.length <= 30

  const faqGroups = [
    { heading: 'Basics', items: [
      { q: 'What does this tool do?', a: 'It builds a profile link for your username on twelve common platforms. You click a platform to open its page in a new tab and see whether the username is taken.' },
      { q: 'Is it free?', a: 'Yes. No account, no upload.' },
      { q: 'Does it check availability automatically?', a: 'No. Platforms do not offer a public availability API, and automated checks risk rate limits and blocks. The tool gives you the exact link so you can check manually in one click.' },
    ]},
    { heading: 'Using the links', items: [
      { q: 'What does "taken" mean?', a: 'A 404 page usually means the username is free. A profile page with content means it is taken. A login or captcha wall means you cannot tell from here without signing in.' },
      { q: 'Which characters are allowed?', a: 'Most platforms allow letters, numbers, dots, underscores and hyphens. Spaces and symbols are removed automatically so the link stays valid.' },
      { q: 'Can I check for a brand name?', a: 'Yes. Enter the brand and check each platform. Short, pronounceable usernames are usually more available than long ones.' },
    ]},
    { heading: 'Privacy', items: [
      { q: 'Is the username stored?', a: 'No. It stays in your browser. Nothing is sent to a server.' },
      { q: 'Does clicking a platform link share data?', a: 'You open that platform directly. This site does not track which link you clicked.' },
    ]},
  ]

  const article = (
    <>
      <h2>How to check a username</h2>
      <ol>
        <li>Type the username you want.</li>
        <li>Click a platform to open its profile link.</li>
        <li>If the page shows 404, the username is usually free.</li>
      </ol>
      <h2>Why use this tool</h2>
      <p>Building twelve URLs by hand is slow. This tool does it in one click and removes invalid characters automatically.</p>
      <h2>Privacy</h2>
      <p>The username stays in your browser.</p>
    </>
  )

  return (
    <ToolShell
      title="Social Username Checker Online Free | PPM Creator"
      description="Build profile links for a username on 12 platforms. Runs in your browser."
      path="/social-checker"
      crumb={[{ label: 'Utilities', to: '/calculators' }]}
      h1="Social & Domain Username Checker"
      lead="Type a username and open its profile link on any of twelve platforms."
      faqGroups={faqGroups}
      related={[
        { name: 'Password Generator', href: '/password-generator', blurb: 'Strong random password' },
        { name: 'QR Code Generator', href: '/qr-code-gen', blurb: 'Make a QR code' },
        { name: 'Text Case Converter', href: '/text-case-converter', blurb: 'Change text case' },
        { name: 'Word Counter', href: '/word-counter', blurb: 'Count words' },
      ]}
      guides={[
        { title: 'Choosing a brand username' },
        { title: 'Why availability checks are not automatic' },
        { title: 'Common username rules across platforms' },
      ]}
      article={article}
    >
      <section style={{ border: '1px solid #e7e5e4', borderRadius: 16, padding: 18, background: '#fafaf9', margin: '20px 0 8px' }}>
        <label style={{ fontSize: 13, color: '#6b7280' }}>Username</label>
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. ppmcreator" style={{ width: '100%', padding: '10px 12px', border: '1px solid #e7e5e4', borderRadius: 10, marginTop: 4, marginBottom: 6, fontSize: 14 }} />
        <div style={{ fontSize: 12, color: valid ? '#15803D' : '#6b7280', marginBottom: 12 }}>Cleaned: {clean || '(empty)'} {valid ? '- valid' : '- enter 3 to 30 letters, numbers, dots, dashes'}</div>
        {valid && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 8 }}>
            {PLATFORMS.map((p) => (
              <a key={p.name} href={p.url(clean)} target="_blank" rel="noopener noreferrer" style={{ display: 'block', padding: 12, border: '1px solid #e7e5e4', borderRadius: 10, background: '#fff', textDecoration: 'none', color: '#1c1917' }}>
                <b style={{ display: 'block', fontSize: 13 }}>{p.name}</b>
                <span style={{ fontSize: 11, color: '#6b7280', wordBreak: 'break-all' }}>{p.url(clean).replace('https://', '')}</span>
              </a>
            ))}
          </div>
        )}
        <p style={{ fontSize: 12, color: '#6b7280', marginTop: 12, background: '#FFF7ED', padding: 10, borderRadius: 8 }}>
          Open each link to see if the username is free. A 404 usually means available; a profile page means taken. The tool does not auto-check availability.
        </p>
      </section>
    </ToolShell>
  )
}