-- شغّل هذا الملف مرة واحدة في Supabase -> SQL Editor (تقديمات إدارة السيرفر)
create table if not exists public.staff_applications (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  age integer not null check (age between 14 and 80),
  discord_username text not null,
  role text not null check (role in ('moderator','support','events')),
  experience text not null check (experience in ('none','some','experienced')),
  availability text not null,
  motivation text not null,
  scenario text not null,
  status text not null default 'pending' check (status in ('pending','accepted','rejected')),
  admin_note text not null default '',
  created_at timestamptz not null default now()
);
alter table public.staff_applications enable row level security;
grant all on public.staff_applications to service_role;
