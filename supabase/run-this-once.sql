-- شغّل هذا الملف مرة واحدة في Supabase -> SQL Editor (يشمل أسئلة الإدارة + ماباتنا + المقبولين + الإيميل)
alter table public.staff_applications
  add column if not exists answers jsonb not null default '[]'::jsonb;

alter table public.staff_applications alter column availability drop not null;
alter table public.staff_applications alter column motivation  drop not null;
alter table public.staff_applications alter column scenario    drop not null;
alter table public.staff_applications alter column availability set default '';
alter table public.staff_applications alter column motivation  set default '';
alter table public.staff_applications alter column scenario    set default '';

alter table public.projects add column if not exists is_map boolean not null default false;

alter table public.join_applications  add column if not exists email text not null default '';
alter table public.join_applications  add column if not exists show_public boolean not null default false;
alter table public.join_applications  add column if not exists public_name text not null default '';

alter table public.staff_applications add column if not exists email text not null default '';
alter table public.staff_applications add column if not exists show_public boolean not null default false;
alter table public.staff_applications add column if not exists public_name text not null default '';
