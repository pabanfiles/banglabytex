-- Analytics Table for Live Traffic
CREATE TABLE IF NOT EXISTS analytics (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  page_url TEXT,
  visitor_ip TEXT,
  timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tools Table (to manage them from Admin)
CREATE TABLE IF NOT EXISTS tools_data (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  slug TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  faq_json TEXT, -- Store FAQs as JSON string
  is_active INTEGER DEFAULT 1
);

-- Insert dummy tools for testing
INSERT OR IGNORE INTO tools_data (slug, name, description) VALUES 
('pdf-tools', 'PDF Tools', 'Edit, merge, split, compress PDFs.'),
('image-tools', 'Image Tools', 'Compress, resize, convert images.'),
('video-downloader', 'Video Downloader', 'Download videos from social media.');

-- Add cover_image column to posts if it doesn't exist
ALTER TABLE posts ADD COLUMN cover_image TEXT;