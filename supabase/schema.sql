-- FAHAD STUDIO — database schema
-- Run once in Supabase: Dashboard -> SQL Editor -> New query -> paste -> Run.
-- Safe to re-run (uses IF NOT EXISTS / ON CONFLICT).

create extension if not exists pgcrypto;

-- ───────────── Admins (who may use /admin) ─────────────
create table if not exists public.admins (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

-- ───────────── Content ─────────────
create table if not exists public.site_settings (
  key text primary key,
  value jsonb not null default '""'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.stats (
  id uuid primary key default gen_random_uuid(),
  label_ar text not null,
  label_en text not null,
  value integer not null default 0 check (value >= 0),
  suffix text not null default '',
  sort_order integer not null default 0
);

create table if not exists public.social_links (
  id uuid primary key default gen_random_uuid(),
  platform text not null check (platform in
    ('discord','roblox','youtube','x','tiktok','instagram','github')),
  url text not null default '',
  sort_order integer not null default 0
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  title_ar text not null,
  title_en text not null,
  description_ar text not null,
  description_en text not null,
  details_ar text not null default '',
  details_en text not null default '',
  category text not null,
  status text not null default 'completed' check (status in ('current','completed')),
  image_url text,
  link_url text,
  featured boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists public.news (
  id uuid primary key default gen_random_uuid(),
  title_ar text not null,
  title_en text not null,
  body_ar text not null,
  body_en text not null,
  kind text not null default 'news' check (kind in ('news','announcement')),
  published boolean not null default true,
  created_at timestamptz not null default now()
);

-- ───────────── Submissions ─────────────
create table if not exists public.join_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  age integer not null check (age between 10 and 80),
  discord_username text not null,
  experience_level text not null check (experience_level in
    ('beginner','intermediate','advanced','expert')),
  specialty text not null,
  portfolio_links text not null default '',
  about text not null,
  status text not null default 'pending' check (status in ('pending','accepted','rejected')),
  admin_note text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.support_requests (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  discord_username text not null,
  topic text not null,
  message text not null,
  status text not null default 'new' check (status in ('new','in_progress','resolved')),
  created_at timestamptz not null default now()
);

create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text not null,
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ───────────── Visits (simple daily counter) ─────────────
create table if not exists public.page_views (
  day date primary key,
  views integer not null default 0
);

create or replace function public.increment_page_view()
returns void
language sql
security definer
set search_path = public
as $$
  insert into public.page_views (day, views) values (current_date, 1)
  on conflict (day) do update set views = public.page_views.views + 1;
$$;

revoke all on function public.increment_page_view() from public, anon, authenticated;
grant execute on function public.increment_page_view() to service_role;

-- ───────────── Row Level Security ─────────────
-- RLS is ON for every table with NO policies: the public (anon) key cannot read
-- or write anything. All access goes through the Next.js server using the
-- service-role key, after validation and (for /admin) an admin check.
alter table public.admins            enable row level security;
alter table public.site_settings     enable row level security;
alter table public.stats             enable row level security;
alter table public.social_links      enable row level security;
alter table public.projects          enable row level security;
alter table public.news              enable row level security;
alter table public.partners          enable row level security;
alter table public.join_applications enable row level security;
alter table public.support_requests  enable row level security;
alter table public.contact_messages  enable row level security;
alter table public.page_views        enable row level security;

-- ───────────── Storage (project images) ─────────────
-- Public bucket: anyone can VIEW images by URL; only the server can upload.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-images', 'project-images', true, 5242880,
  array['image/png','image/jpeg','image/webp','image/avif']
)
on conflict (id) do nothing;

-- ───────────── Starter rows (editable from the admin panel) ─────────────
-- Numbers start at 0 on purpose: the public stats section stays hidden until
-- you enter real numbers. Social URLs start empty and are hidden until set.
insert into public.stats (label_ar, label_en, value, suffix, sort_order)
select * from (values
  ('مشاريع منجزة',   'Projects delivered', 0, '', 1),
  ('مطورون تم دعمهم','Developers supported', 0, '', 2),
  ('أعضاء الفريق',   'Team members',        0, '', 3),
  ('سنوات الخبرة',   'Years of experience', 0, '', 4)
) as v(label_ar, label_en, value, suffix, sort_order)
where not exists (select 1 from public.stats);

insert into public.social_links (platform, url, sort_order)
select * from (values
  ('discord','',1), ('roblox','',2), ('youtube','',3), ('x','',4)
) as v(platform, url, sort_order)
where not exists (select 1 from public.social_links);

-- ───────────── Make yourself an admin ─────────────
-- 1) Dashboard -> Authentication -> Users -> Add user (email + password).
-- 2) Then run (replace the email):
--
--   insert into public.admins (user_id)
--   select id from auth.users where email = 'you@example.com';
