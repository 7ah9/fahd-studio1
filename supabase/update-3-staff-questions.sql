-- شغّل هذا الملف مرة واحدة في Supabase -> SQL Editor
-- (أسئلة تقديم الإدارة الجديدة: كل إجابة تُحفظ مع نص سؤالها)
alter table public.staff_applications
  add column if not exists answers jsonb not null default '[]'::jsonb;

alter table public.staff_applications alter column availability drop not null;
alter table public.staff_applications alter column motivation  drop not null;
alter table public.staff_applications alter column scenario    drop not null;
alter table public.staff_applications alter column availability set default '';
alter table public.staff_applications alter column motivation  set default '';
alter table public.staff_applications alter column scenario    set default '';
