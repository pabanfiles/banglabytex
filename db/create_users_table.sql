CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT UNIQUE NOT NULL,
  provider TEXT NOT NULL,
  provider_id TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  password_hash TEXT,
  otp_code TEXT,
  otp_expires DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);