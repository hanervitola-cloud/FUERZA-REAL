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
