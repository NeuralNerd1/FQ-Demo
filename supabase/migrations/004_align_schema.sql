-- Aligns the 001 tables with the column names the app (src/lib/db.js) and 002 use.
-- Idempotent: safe to re-run. Run in the Supabase SQL editor.

DO $$
DECLARE
  m RECORD;
  has_old BOOLEAN;
  has_new BOOLEAN;
BEGIN
  FOR m IN SELECT * FROM (VALUES
    ('posts','published','is_published'),
    ('posts','author','author_name'),
    ('team','active','is_visible'),
    ('team','order_index','display_order'),
    ('case_studies','published','is_published'),
    ('case_studies','industry','client_industry')
  ) AS t(tbl, old_col, new_col)
  LOOP
    SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name=m.tbl AND column_name=m.old_col) INTO has_old;
    SELECT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_schema='public' AND table_name=m.tbl AND column_name=m.new_col) INTO has_new;
    IF has_old AND has_new THEN
      -- both exist: keep the new column, carry over old values where new is still default/null, drop old
      EXECUTE format('UPDATE %I SET %I = %I WHERE %I IS DISTINCT FROM %I', m.tbl, m.new_col, m.old_col, m.new_col, m.old_col);
      EXECUTE format('DROP INDEX IF EXISTS %I', m.tbl || '_' || m.old_col || '_idx');
      EXECUTE format('ALTER TABLE %I DROP COLUMN %I CASCADE', m.tbl, m.old_col);
    ELSIF has_old THEN
      EXECUTE format('ALTER TABLE %I RENAME COLUMN %I TO %I', m.tbl, m.old_col, m.new_col);
    END IF;
  END LOOP;
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
