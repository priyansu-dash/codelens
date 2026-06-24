-- Run once against your Neon database to initialize the schema.
-- psql $DATABASE_URL -f src/schema.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto"; -- for gen_random_uuid()

-- ── Users ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email      TEXT NOT NULL UNIQUE,
  password   TEXT NOT NULL,           -- bcrypt hash
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ── Snippets ─────────────────────────────────────────────────────────────────
-- One row per unique piece of code a user has submitted.
CREATE TABLE IF NOT EXISTS snippets (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id    UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  language   TEXT NOT NULL,
  code       TEXT NOT NULL,
  code_hash  TEXT NOT NULL UNIQUE,    -- SHA-256 of (code + '::' + language)
  first_line TEXT,                    -- first line of code for sidebar display
  label      TEXT,                    -- optional user-given name
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS snippets_user_id_idx ON snippets(user_id);

-- ── Analyses ─────────────────────────────────────────────────────────────────
-- Stores the LLM output for each snippet (1-to-1 with snippets).
CREATE TABLE IF NOT EXISTS analyses (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  snippet_id       UUID NOT NULL UNIQUE REFERENCES snippets(id) ON DELETE CASCADE,
  explanation      TEXT,
  time_complexity  TEXT,              -- e.g. "O(n log n)"
  space_complexity TEXT,              -- e.g. "O(n)"
  complexity_notes TEXT,              -- explanation of complexity
  refactor         TEXT,              -- refactored code string
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS analyses_snippet_id_idx ON analyses(snippet_id);