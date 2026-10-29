export const DEMO_POSTS = [
  { id: 1, title: 'Sample post (demo)', slug: 'sample-post', status: 'draft', updated_at: '2026-10-29', content_len: 200, meta_title: '', meta_description: '' },
]

export const DEMO_POST_DETAIL = {
  title: 'Sample post',
  slug: 'sample-post',
  content: '## Sample\n\nThis is sample content because the database returned no posts.\n\n## Why\n\nThe admin panel is showing fallback data so you can see the UI.',
  meta_title: 'Sample post',
  meta_description: 'Sample post description.',
  status: 'draft',
}

export const DEMO_FAQS = [
  { q: 'Are my files uploaded to a server?', a: 'No. Everything runs in your browser.' },
  { q: 'How far can I reduce the size?', a: 'Keeping 70 to 90 percent of the original usually looks the same.' },
  { q: 'What size limit do forms use?', a: 'Each form sets its own limit. Check the official instructions for that form.' },
]

export const DEMO_ANALYTICS = {
  visits: 0, views: 0, runs: 0, downloads: 0,
  tools: [],
  sources: [],
  pages: [],
  live: 0,
}

export const DEMO_SESSIONS = [{ id: 1, user_agent: 'Windows Chrome', last_seen: 'now', current: true }]
export const DEMO_LOGINS = [{ ts: '2026-10-29 09:00', user: 'hellowsai', ok: true, ua: 'Chrome' }]