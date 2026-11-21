-- ============================================================
-- Zaxise Travel Content Feed — Supabase Schema
-- ============================================================

-- Single table for all travel feed entities (country, city, attraction)
-- Keyed by stable slug ID, field-level merge on upsert
CREATE TABLE IF NOT EXISTS travel_entities (
  id TEXT PRIMARY KEY,                          -- e.g. "country:jp", "city:jp/tokyo", "attraction:jp/meiji-jingu"
  entity_type TEXT NOT NULL CHECK (entity_type IN ('country', 'city', 'attraction')),
  parent_id TEXT,                               -- country:jp for cities, city:jp/tokyo for attractions
  name TEXT NOT NULL DEFAULT '',

  -- Images (verified, stable URLs)
  hero_image_url TEXT,
  card_image_url TEXT,
  image_url TEXT,                               -- for attractions
  image_alt TEXT,

  -- Content
  description TEXT,
  essentials TEXT,                              -- country travel essentials text

  -- Counts (canonical, single-source)
  counts JSONB,                                 -- {"cities": 23, "attractions": 120, "restaurants": 340}

  -- Pricing
  avg_daily_budget_usd JSONB,                   -- {"low": 60, "high": 150}
  hotel_price_bands_usd JSONB,                  -- {"budget": "40-80", "mid": "80-180", "luxury": "180+"}

  -- Attraction-specific
  entry_fee JSONB,                              -- {"amount": 0, "currency": "JPY", "note": "Free entry"}
  opening_hours TEXT,
  top_rank INTEGER,                             -- position in Top 10 list (null = not ranked)

  -- Country-specific
  best_time_to_visit TEXT,

  -- Metadata
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  pushed_by TEXT NOT NULL DEFAULT 'gundya',
  push_count INTEGER NOT NULL DEFAULT 1
);

CREATE INDEX idx_travel_entities_type ON travel_entities (entity_type);
CREATE INDEX idx_travel_entities_parent ON travel_entities (parent_id);
CREATE INDEX idx_travel_entities_type_updated ON travel_entities (entity_type, updated_at DESC);

-- Push log for audit trail
CREATE TABLE IF NOT EXISTS travel_feed_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_id TEXT NOT NULL,
  fields_updated TEXT[] NOT NULL DEFAULT '{}',
  pushed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  pushed_by TEXT NOT NULL DEFAULT 'gundya'
);

CREATE INDEX idx_travel_feed_log_entity ON travel_feed_log (entity_id, pushed_at DESC);

-- RLS
ALTER TABLE travel_entities ENABLE ROW LEVEL SECURITY;
ALTER TABLE travel_feed_log ENABLE ROW LEVEL SECURITY;

-- Public read for travel entities
CREATE POLICY "travel_entities_public_read" ON travel_entities FOR SELECT USING (true);

-- Log only accessible via service role
CREATE POLICY "travel_feed_log_no_public" ON travel_feed_log FOR SELECT USING (false);
