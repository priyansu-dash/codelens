-- Migration: update tables to match application code
-- Run this against your Neon DB if the tables already exist with the old schema.

-- ── Snippets: add first_line, updated_at, and unique constraint on code_hash ──
ALTER TABLE snippets ADD COLUMN IF NOT EXISTS first_line TEXT;
ALTER TABLE snippets ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Drop old non-unique index on code_hash if it exists, then add unique constraint
DROP INDEX IF EXISTS snippets_code_hash_idx;
ALTER TABLE snippets ADD CONSTRAINT snippets_code_hash_key UNIQUE (code_hash);

-- ── Analyses: replace JSONB complexity with separate columns ──────────────────
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS time_complexity  TEXT;
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS space_complexity TEXT;
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS complexity_notes TEXT;
ALTER TABLE analyses ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT now();

-- Add unique constraint on snippet_id for ON CONFLICT upserts
ALTER TABLE analyses DROP CONSTRAINT IF EXISTS analyses_snippet_id_key;
ALTER TABLE analyses ADD CONSTRAINT analyses_snippet_id_key UNIQUE (snippet_id);

-- Migrate existing JSONB data into the new columns (safe even if complexity is NULL)
UPDATE analyses
SET time_complexity  = complexity->>'time',
    space_complexity = complexity->>'space',
    complexity_notes = complexity->>'notes'
WHERE complexity IS NOT NULL
  AND time_complexity IS NULL;

-- Optionally drop the old column after verifying migration
-- ALTER TABLE analyses DROP COLUMN IF EXISTS complexity;
-- ALTER TABLE analyses DROP COLUMN IF EXISTS model;
