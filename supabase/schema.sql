-- ─────────────────────────────────────────────────────────────────────────
-- Teen4Teen — Supabase schema (matches Product Spec v1.0, Section 11)
--
-- HOW TO USE:
-- 1. Create a free project at https://supabase.com
-- 2. Open the SQL Editor in your project dashboard
-- 3. Paste this entire file in and run it
-- 4. Copy your Project URL and service_role key into server/.env
--    (Settings → API in the Supabase dashboard)
-- 5. Restart the server — it will automatically switch from local JSON
--    storage to Supabase. Nothing else changes.
-- ─────────────────────────────────────────────────────────────────────────

create extension if not exists "pgcrypto";

create table volunteers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  country text,
  age_range text,
  is_therapist boolean default false,
  is_peer_supporter boolean default false,
  languages text,
  availability_hours text,
  timezone text,
  status text default 'Pending', -- Pending | In Review | Awaiting Mock Session | Flagged for Interview | Approved | Declined
  volunteer_tier text, -- 'Verified' | 'Young'
  motivation text,
  created_at timestamptz default now()
);

create table onboarding_progress (
  id uuid primary key default gen_random_uuid(),
  volunteer_id uuid references volunteers(id) on delete cascade,
  checklist_completed boolean default false,
  mock_session_completed boolean default false,
  mock_session_transcript jsonb,
  interview_required boolean default false,
  interview_completed boolean default false,
  approved_at timestamptz,
  created_at timestamptz default now()
);

create table community_posts (
  id uuid primary key default gen_random_uuid(),
  display_name text not null,
  tier_label text default 'Seeker', -- Seeker | Verified Responder | Young Responder
  content text not null,
  is_pinned boolean default false,
  is_hidden boolean default false,
  flag_count integer default 0,
  moderator_note text,
  created_at timestamptz default now()
);

create table community_replies (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references community_posts(id) on delete cascade,
  display_name text not null,
  tier_label text default 'Seeker',
  content text not null,
  is_hidden boolean default false,
  flag_count integer default 0,
  created_at timestamptz default now()
);

create table videos (
  id uuid primary key default gen_random_uuid(),
  youtube_url text not null,
  title text not null,
  description text,
  category_tag text,
  is_visible boolean default true,
  created_at timestamptz default now()
);

create table workshops (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date,
  time time,
  format text, -- 'in-person' | 'virtual'
  location_or_link text,
  description text,
  is_visible boolean default true,
  created_at timestamptz default now()
);

create table meeting_requests (
  id uuid primary key default gen_random_uuid(),
  display_name text,
  email text not null,
  support_type text,
  preferred_responder_type text, -- 'therapy' | 'peer' | 'either'
  notes text,
  availability text,
  status text default 'New', -- New | Matched | In Progress | Closed
  matched_volunteer_id uuid references volunteers(id),
  created_at timestamptz default now()
);

create table admins (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  role text default 'admin', -- 'super_admin' | 'admin'
  created_at timestamptz default now()
);

-- ── Row Level Security ──────────────────────────────────────────────────
-- The server talks to Supabase using the service_role key, which bypasses
-- RLS entirely, so the API keeps working exactly as it does today.
-- Enabling RLS here just makes sure the anon/public key (if ever exposed
-- to the browser) can't read or write anything on its own.

alter table volunteers enable row level security;
alter table onboarding_progress enable row level security;
alter table community_posts enable row level security;
alter table community_replies enable row level security;
alter table videos enable row level security;
alter table workshops enable row level security;
alter table meeting_requests enable row level security;
alter table admins enable row level security;

-- Public, read-only access to content that's meant to be public:
create policy "Public can read visible videos" on videos for select using (is_visible = true);
create policy "Public can read visible workshops" on workshops for select using (is_visible = true);
create policy "Public can read non-hidden posts" on community_posts for select using (is_hidden = false);
create policy "Public can read non-hidden replies" on community_replies for select using (is_hidden = false);

-- Everything else (volunteer applications, meeting requests, admin actions)
-- only goes through the server's service_role key — no public policies needed.
