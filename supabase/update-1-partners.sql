-- شغّل هذا الملف مرة واحدة في Supabase -> SQL Editor (لإضافة قسم الشركاء)
create table if not exists public.partners (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo_url text,
  url text,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);
alter table public.partners enable row level security;
