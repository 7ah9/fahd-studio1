-- شغّل هذا الملف مرة واحدة في Supabase -> SQL Editor
-- (ماباتنا + المقبولون + إيميل المتقدمين)
alter table public.projects add column if not exists is_map boolean not null default false;

alter table public.join_applications  add column if not exists email text not null default '';
alter table public.join_applications  add column if not exists show_public boolean not null default false;
alter table public.join_applications  add column if not exists public_name text not null default '';

alter table public.staff_applications add column if not exists email text not null default '';
alter table public.staff_applications add column if not exists show_public boolean not null default false;
alter table public.staff_applications add column if not exists public_name text not null default '';
