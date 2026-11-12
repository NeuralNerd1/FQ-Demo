-- ============================================================
-- Migration 003: Events table + image columns + section visibility
-- Run this once in your Supabase SQL Editor (Dashboard → SQL Editor)
-- ============================================================

-- ── 1. Add cover_image_url to posts (Insights articles) ─────────────────────
ALTER TABLE posts
  ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

-- ── 2. Add cover_image_url to case_studies (Work cards) ─────────────────────
ALTER TABLE case_studies
  ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

-- ── 3. Add avatar_url to team members ───────────────────────────────────────
ALTER TABLE team
  ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- ── 4. Create events table ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS events (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title         TEXT NOT NULL,
  subtitle      TEXT,
  description   TEXT,
  event_date    TIMESTAMPTZ,
  event_type    TEXT DEFAULT 'webinar',   -- webinar | workshop | conference | demo
  platform      TEXT,                     -- e.g. gcode.in, Zoom, YouTube
  platform_url  TEXT,                     -- registration / stream link
  thumbnail_url TEXT,
  host_name     TEXT,
  host_title    TEXT,
  host_org      TEXT,
  price_inr     INTEGER DEFAULT 0,        -- 0 = free
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Enable RLS on events
ALTER TABLE events ENABLE ROW LEVEL SECURITY;

-- Public can read active events
CREATE POLICY IF NOT EXISTS "events_public_read"
  ON events FOR SELECT
  USING (is_active = TRUE);

-- Authenticated users (admins) can do everything
CREATE POLICY IF NOT EXISTS "events_admin_all"
  ON events FOR ALL
  USING (auth.role() = 'authenticated');

-- ── 5. Insert site_content rows for section visibility ───────────────────────
-- (uses ON CONFLICT DO NOTHING so safe to re-run)
INSERT INTO site_content (key, value, type, label) VALUES
  ('show_work_section',     'true', 'boolean', 'Work / Case Studies section'),
  ('show_insights_section', 'true', 'boolean', 'Insights / Blog section'),
  ('show_events_section',   'true', 'boolean', 'Events / Webinars section')
ON CONFLICT (key) DO NOTHING;

-- ── 6. Insert site_content rows for homepage stats ───────────────────────────
INSERT INTO site_content (key, value, type, label) VALUES
  ('stat_fde_engagements', '120+', 'text', 'Stat: FDE Engagements'),
  ('stat_services_offered', '25+',  'text', 'Stat: Services Offered'),
  ('stat_engines',          '6',    'text', 'Stat: Service Engines'),
  ('stat_client_retention', '94%',  'text', 'Stat: Client Retention')
ON CONFLICT (key) DO NOTHING;

-- ── 7. Insert mock event ─────────────────────────────────────────────────────
INSERT INTO events (
  title,
  subtitle,
  description,
  event_date,
  event_type,
  platform,
  platform_url,
  host_name,
  host_title,
  host_org,
  price_inr,
  is_active
) VALUES (
  'Why Learn FDE in 2027?',
  'The forward deployed engineering opportunity — what it is, why it matters, and how to get started.',
  'Join Arup Mohanty, Director at Oracle, as he breaks down what Forward Deployed Engineering really means in 2027 and why companies are racing to build this capability in-house. This free career webinar covers the FDE skill stack, real engagement patterns, and actionable steps to position yourself in this emerging field.',
  '2027-01-15 18:00:00+05:30',
  'webinar',
  'gcode.in',
  'https://gcode.in',
  'Arup Mohanty',
  'Director',
  'Oracle',
  149,
  TRUE
);
