-- Run this in the Supabase SQL editor before starting the backend

-- Pinned companies (per anonymous user)
CREATE TABLE IF NOT EXISTS companies (
  id          TEXT NOT NULL,
  user_id     TEXT NOT NULL,
  name        TEXT NOT NULL,
  logo_url    TEXT,
  pinned_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  PRIMARY KEY (id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_companies_user ON companies(user_id);

-- Job applications
CREATE TABLE IF NOT EXISTS applications (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         TEXT NOT NULL,
  company_name    TEXT NOT NULL,
  company_logo    TEXT,
  role_title      TEXT NOT NULL,
  location        TEXT,
  salary          TEXT,
  job_url         TEXT,
  status          TEXT NOT NULL DEFAULT 'saved',
  status_history  JSONB NOT NULL DEFAULT '[]',
  interview_date  TIMESTAMPTZ,
  notes           TEXT,
  flagged         BOOLEAN NOT NULL DEFAULT FALSE,
  flag_reason     TEXT,
  added_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_applications_user   ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(user_id, status);

-- JSearch job results cache (shared across all users, keyed by company slug)
CREATE TABLE IF NOT EXISTS jobs_cache (
  company_id  TEXT PRIMARY KEY,
  jobs        JSONB NOT NULL,
  cached_at   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
