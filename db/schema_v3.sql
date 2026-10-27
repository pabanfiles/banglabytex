-- 1. Analytics Table (আসল ভিজিটর ট্র্যাকিং)
CREATE TABLE IF NOT EXISTS analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_url TEXT,
  visitor_ip TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. Tools Table (FAQ এবং কন্টেন্ট এডিট করার জন্য)
CREATE TABLE IF NOT EXISTS tool_pages (
  slug TEXT PRIMARY KEY,
  h1_title TEXT,
  meta_desc TEXT,
  intro_text TEXT,
  faq_json TEXT,
  is_active INTEGER DEFAULT 1
);

-- 3. ডিফল্ট টুল ডেটা ইনসার্ট করা
INSERT OR IGNORE INTO tool_pages (slug, h1_title, meta_desc, intro_text, faq_json, is_active) VALUES 
('pdf-tools', 'Free PDF Tools Online', 'Merge, split, compress PDF online.', 'Edit your PDF files easily.', '[{"q":"Is it free?","a":"Yes."}]', 1),
('video-downloader', 'Download Videos Fast', 'Download videos from social media.', 'Save your favorite videos.', '[{"q":"No watermark?","a":"Yes."}]', 1);

-- 4. Admin Users Table আপডেট (পাসওয়ার্ড হ্যাশের জন্য)
CREATE TABLE IF NOT EXISTS admin_users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);