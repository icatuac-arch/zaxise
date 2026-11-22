-- Internships feed
CREATE TABLE IF NOT EXISTS internships (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  company TEXT NOT NULL,
  vertical TEXT NOT NULL,
  location TEXT NOT NULL DEFAULT '',
  work_mode TEXT NOT NULL DEFAULT 'onsite' CHECK (work_mode IN ('onsite', 'hybrid', 'remote')),
  term TEXT NOT NULL DEFAULT '',
  apply_url TEXT NOT NULL,
  source TEXT NOT NULL DEFAULT '',
  application_deadline DATE,
  posted_date DATE,
  description TEXT NOT NULL DEFAULT '',
  requirements TEXT NOT NULL DEFAULT '',
  pay TEXT,
  first_seen_at DATE NOT NULL DEFAULT CURRENT_DATE,
  last_verified_at DATE NOT NULL DEFAULT CURRENT_DATE,
  retired_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_internships_vertical ON internships (vertical);
CREATE INDEX IF NOT EXISTS idx_internships_first_seen ON internships (first_seen_at DESC);
CREATE INDEX IF NOT EXISTS idx_internships_deadline ON internships (application_deadline);
CREATE INDEX IF NOT EXISTS idx_internships_retired ON internships (retired_at);

ALTER TABLE internships ENABLE ROW LEVEL SECURITY;
CREATE POLICY "internships_public_read" ON internships FOR SELECT USING (retired_at IS NULL);
