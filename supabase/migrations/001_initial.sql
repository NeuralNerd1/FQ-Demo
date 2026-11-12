-- FormatiQs initial schema
-- Run this in Supabase SQL editor or via supabase db push

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ============================================================
-- POSTS (Engine 1 · Insights / Blog)
-- ============================================================
create table if not exists posts (
  id          uuid primary key default uuid_generate_v4(),
  title       text not null,
  slug        text unique not null,
  excerpt     text,
  content     text,
  author      text,
  engine_tag  text,
  tags        text[],
  published   boolean not null default false,
  published_at timestamptz,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create index if not exists posts_slug_idx on posts(slug);
create index if not exists posts_published_idx on posts(published, published_at desc);

-- ============================================================
-- INQUIRIES (all engines, submitted via forms)
-- ============================================================
create table if not exists inquiries (
  id              uuid primary key default uuid_generate_v4(),
  name            text not null,
  email           text not null,
  company         text not null,
  role            text,
  engine_interest text,
  company_size    text,
  challenge       text not null,
  budget          text,
  timeline        text,
  track           text,
  source          text,
  status          text not null default 'new',  -- new | contacted | qualified | proposal | won | lost
  notes           text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists inquiries_status_idx on inquiries(status);
create index if not exists inquiries_engine_idx on inquiries(engine_interest);
create index if not exists inquiries_created_idx on inquiries(created_at desc);

-- ============================================================
-- TEAM
-- ============================================================
create table if not exists team (
  id           uuid primary key default uuid_generate_v4(),
  name         text not null,
  role         text not null,
  bio          text,
  avatar_url   text,
  linkedin_url text,
  order_index  integer not null default 0,
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

create index if not exists team_order_idx on team(order_index) where active = true;

-- ============================================================
-- CASE STUDIES (Engine 1 · Work)
-- ============================================================
create table if not exists case_studies (
  id              uuid primary key default uuid_generate_v4(),
  title           text not null,
  slug            text unique not null,
  summary         text,
  industry        text,
  engine_id       text,
  service_slug    text,
  client_size     text,
  metric          text,
  metric_value    text,
  metric2         text,
  metric2_value   text,
  metric3         text,
  metric3_value   text,
  engagement_type text,
  duration        text,
  team_size       text,
  challenge       text,
  approach        text,
  outcome         text,
  technologies    text[],
  featured        boolean not null default false,
  published       boolean not null default false,
  published_at    timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists case_studies_slug_idx on case_studies(slug);
create index if not exists case_studies_published_idx on case_studies(published, published_at desc);

-- ============================================================
-- NEWSLETTER SUBSCRIBERS (Engines 1, 2, 3)
-- ============================================================
create table if not exists newsletter_subscribers (
  id         uuid primary key default uuid_generate_v4(),
  email      text unique not null,
  name       text,
  source     text,          -- 'footer' | 'insights' | 'academy' | 'talent' | ...
  interest   text,          -- extra field from coming-soon forms
  type       text,          -- extra field (hiring/fde/etc from talent form)
  confirmed  boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists newsletter_email_idx on newsletter_subscribers(email);

-- ============================================================
-- SETTINGS (key-value store for site config)
-- ============================================================
create table if not exists settings (
  key        text primary key,
  value      text,
  updated_at timestamptz not null default now()
);

insert into settings (key, value) values
  ('site_title', 'FormatiQs'),
  ('site_tagline', 'India''s Forward Deployed Engineering company'),
  ('contact_email', 'hello@formatiqs.in'),
  ('contact_phone', '+91 98200 00000'),
  ('linkedin_url', ''),
  ('twitter_url', '')
on conflict (key) do nothing;

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

-- Posts: public read for published only; authenticated full access
alter table posts enable row level security;
create policy "Public can read published posts"
  on posts for select
  using (published = true);
create policy "Authenticated can manage posts"
  on posts for all
  using (auth.role() = 'authenticated');

-- Inquiries: authenticated only
alter table inquiries enable row level security;
create policy "Authenticated can manage inquiries"
  on inquiries for all
  using (auth.role() = 'authenticated');
-- Allow public INSERT (form submissions)
create policy "Public can submit inquiries"
  on inquiries for insert
  with check (true);

-- Team: public read active; authenticated full
alter table team enable row level security;
create policy "Public can read active team"
  on team for select
  using (active = true);
create policy "Authenticated can manage team"
  on team for all
  using (auth.role() = 'authenticated');

-- Case studies: public read published; authenticated full
alter table case_studies enable row level security;
create policy "Public can read published case studies"
  on case_studies for select
  using (published = true);
create policy "Authenticated can manage case studies"
  on case_studies for all
  using (auth.role() = 'authenticated');

-- Newsletter: public insert; authenticated read all
alter table newsletter_subscribers enable row level security;
create policy "Public can subscribe"
  on newsletter_subscribers for insert
  with check (true);
create policy "Authenticated can read subscribers"
  on newsletter_subscribers for select
  using (auth.role() = 'authenticated');

-- Settings: authenticated only
alter table settings enable row level security;
create policy "Authenticated can manage settings"
  on settings for all
  using (auth.role() = 'authenticated');
-- Public read (needed for site config)
create policy "Public can read settings"
  on settings for select
  using (true);

-- ============================================================
-- TRIGGERS: auto-update updated_at
-- ============================================================
create or replace function update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger posts_updated_at before update on posts
  for each row execute function update_updated_at();

create trigger inquiries_updated_at before update on inquiries
  for each row execute function update_updated_at();

create trigger case_studies_updated_at before update on case_studies
  for each row execute function update_updated_at();
