-- Earned Strength server database (Cloudflare D1).
-- Accounts have no email or password: the phone keeps a secret token, and only its hash is stored here.
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  token_hash TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  code TEXT UNIQUE NOT NULL,      -- friend code people share, like K7M2QX
  created INTEGER NOT NULL,
  seen INTEGER NOT NULL
);
-- Friendship is stored both ways (a -> b and b -> a).
CREATE TABLE IF NOT EXISTS friends (
  a TEXT NOT NULL,
  b TEXT NOT NULL,
  created INTEGER NOT NULL,
  PRIMARY KEY (a, b)
);
-- Best camera-counted score per person and challenge.
CREATE TABLE IF NOT EXISTS scores (
  user_id TEXT NOT NULL,
  cid TEXT NOT NULL,
  n INTEGER NOT NULL,
  w REAL,
  u TEXT,
  at INTEGER NOT NULL,
  PRIMARY KEY (user_id, cid)
);
CREATE INDEX IF NOT EXISTS scores_by_challenge ON scores (cid, n DESC);
-- Copy of the app's data, so a new phone can restore it.
CREATE TABLE IF NOT EXISTS backups (
  user_id TEXT PRIMARY KEY,
  data TEXT NOT NULL,
  updated INTEGER NOT NULL
);
-- Daily counters for limits (AI questions, new accounts per network, scores).
CREATE TABLE IF NOT EXISTS usage (
  who TEXT NOT NULL,
  day INTEGER NOT NULL,
  kind TEXT NOT NULL,
  n INTEGER NOT NULL,
  PRIMARY KEY (who, day, kind)
);
-- What friends see: workouts, records, goals and levels (kept 30 days).
CREATE TABLE IF NOT EXISTS events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id TEXT NOT NULL,
  kind TEXT NOT NULL,
  data TEXT NOT NULL,
  at INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS events_by_user ON events (user_id, at DESC);
-- "Strength!" reactions from friends.
CREATE TABLE IF NOT EXISTS cheers (
  event_id INTEGER NOT NULL,
  user_id TEXT NOT NULL,
  PRIMARY KEY (event_id, user_id)
);
-- XP earned each week, for the weekly league with friends.
CREATE TABLE IF NOT EXISTS xpweek (
  user_id TEXT NOT NULL,
  week INTEGER NOT NULL,
  xp INTEGER NOT NULL,
  PRIMARY KEY (user_id, week)
);
-- Training reminders: where to wake the phone, at what local time and on which days.
CREATE TABLE IF NOT EXISTS push (
  endpoint TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  hour INTEGER NOT NULL,
  minute INTEGER NOT NULL,
  days TEXT NOT NULL,
  tz INTEGER NOT NULL,
  next_at INTEGER NOT NULL,
  created INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS push_due ON push (next_at);
-- More sign-ins for the same account (another phone after "Continuar con Google"). Only the key's hash is kept.
CREATE TABLE IF NOT EXISTS sessions (
  token_hash TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  created INTEGER NOT NULL
);
CREATE INDEX IF NOT EXISTS sessions_by_user ON sessions (user_id);
-- Sign-in providers joined to an account. Only a hash of the provider's user id is kept: no email.
CREATE TABLE IF NOT EXISTS logins (
  provider TEXT NOT NULL,
  sub_hash TEXT NOT NULL,
  user_id TEXT NOT NULL,
  created INTEGER NOT NULL,
  PRIMARY KEY (provider, sub_hash)
);
CREATE INDEX IF NOT EXISTS logins_by_user ON logins (user_id);
