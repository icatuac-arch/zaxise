-- ============================================================
-- Zaxise Tech Deals — Supabase Schema
-- ============================================================

-- API keys table (same pattern as indianprograms)
CREATE TABLE IF NOT EXISTS api_keys (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key_hash TEXT NOT NULL UNIQUE,
  label TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  revoked_at TIMESTAMPTZ
);

CREATE INDEX idx_api_keys_hash ON api_keys (key_hash);

-- Daily deals board
CREATE TABLE IF NOT EXISTS tech_deals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_date DATE NOT NULL,

  -- Product identity
  product_name TEXT NOT NULL,
  brand TEXT NOT NULL DEFAULT '',
  model TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL,
  retailer TEXT NOT NULL,

  -- Links & images
  product_url TEXT NOT NULL,
  image_url TEXT NOT NULL,

  -- Pricing
  price_current NUMERIC(10,2) NOT NULL,
  price_list NUMERIC(10,2) NOT NULL DEFAULT 0,
  price_previous NUMERIC(10,2) NOT NULL DEFAULT 0,
  discount_pct NUMERIC(5,1) NOT NULL DEFAULT 0,
  price_90d_low NUMERIC(10,2),
  is_historical_low BOOLEAN NOT NULL DEFAULT false,
  shipping_cost NUMERIC(10,2),
  shipping_note TEXT,
  price_total NUMERIC(10,2),

  -- Stock
  in_stock BOOLEAN NOT NULL DEFAULT true,
  stock_note TEXT NOT NULL DEFAULT '',

  -- Metadata
  first_posted_at DATE,
  last_verified_at TIMESTAMPTZ,
  deal_note TEXT NOT NULL DEFAULT '',
  tier INTEGER NOT NULL DEFAULT 5,
  at_or_below_trigger BOOLEAN NOT NULL DEFAULT false,
  source_page TEXT NOT NULL DEFAULT '',

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),

  -- Ensure one entry per product per feed date
  UNIQUE (feed_date, product_url)
);

-- Indexes for the public page queries
CREATE INDEX idx_tech_deals_feed_date ON tech_deals (feed_date DESC);
CREATE INDEX idx_tech_deals_category ON tech_deals (category);
CREATE INDEX idx_tech_deals_date_category ON tech_deals (feed_date, category, tier);

-- Feed metadata (tracks each daily push)
CREATE TABLE IF NOT EXISTS tech_deals_feeds (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feed_date DATE NOT NULL UNIQUE,
  deal_count INTEGER NOT NULL DEFAULT 0,
  rejected_count INTEGER NOT NULL DEFAULT 0,
  pushed_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  pushed_by TEXT NOT NULL DEFAULT 'gundya'
);

-- RLS: deals are publicly readable, only service role can write
ALTER TABLE tech_deals ENABLE ROW LEVEL SECURITY;
ALTER TABLE tech_deals_feeds ENABLE ROW LEVEL SECURITY;
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Public read access for deals
CREATE POLICY "tech_deals_public_read" ON tech_deals
  FOR SELECT USING (true);

CREATE POLICY "tech_deals_feeds_public_read" ON tech_deals_feeds
  FOR SELECT USING (true);

-- No public access to api_keys
CREATE POLICY "api_keys_no_public" ON api_keys
  FOR SELECT USING (false);
