-- Aligns the 001 tables with the column names the app (src/lib/db.js) and 002 use.
-- Idempotent: safe to re-run. Run in the Supabase SQL editor.

DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='published') THEN
    ALTER TABLE posts RENAME COLUMN published TO is_published;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='posts' AND column_name='author') THEN
    ALTER TABLE posts RENAME COLUMN author TO author_name;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='team' AND column_name='active') THEN
    ALTER TABLE team RENAME COLUMN active TO is_visible;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='team' AND column_name='order_index') THEN
    ALTER TABLE team RENAME COLUMN order_index TO display_order;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='case_studies' AND column_name='published') THEN
    ALTER TABLE case_studies RENAME COLUMN published TO is_published;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='case_studies' AND column_name='industry') THEN
    ALTER TABLE case_studies RENAME COLUMN industry TO client_industry;
  END IF;
END $$;

ALTER TABLE posts        ADD COLUMN IF NOT EXISTS author_name TEXT, ADD COLUMN IF NOT EXISTS cover_image_url TEXT;
ALTER TABLE team         ADD COLUMN IF NOT EXISTS engine_focus INTEGER[], ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE case_studies ADD COLUMN IF NOT EXISTS solution TEXT, ADD COLUMN IF NOT EXISTS display_order INTEGER NOT NULL DEFAULT 0,
                         ADD COLUMN IF NOT EXISTS cover_image_url TEXT;

-- Public-read policies referenced the old column names (Postgres rewrites them on rename, but recreate to be explicit)
DROP POLICY IF EXISTS "Public can read published posts" ON posts;
CREATE POLICY "Public can read published posts" ON posts FOR SELECT USING (is_published = true);
DROP POLICY IF EXISTS "Public can read active team" ON team;
CREATE POLICY "Public can read active team" ON team FOR SELECT USING (is_visible = true);
DROP POLICY IF EXISTS "Public can read published case studies" ON case_studies;
CREATE POLICY "Public can read published case studies" ON case_studies FOR SELECT USING (is_published = true);
