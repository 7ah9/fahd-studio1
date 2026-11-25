# FAHAD STUDIO

Next.js + TypeScript + Tailwind v4 + Framer Motion + Supabase.

## التشغيل
1. أنشئ مشروع Supabase ثم نفّذ `supabase/schema.sql` في SQL Editor.
2. انسخ `.env.example` إلى `.env.local` واملأ القيم (مفتاح `SUPABASE_SERVICE_ROLE_KEY` سري للخادم فقط).
3. من Supabase → Authentication أنشئ مستخدم الإدارة (وعطّل التسجيل العام)، ثم أضفه إلى جدول `admins` كما في تعليقات `schema.sql`.
4. `npm install` ثم `npm run dev`، ولوحة الإدارة على `/admin`.
5. الإحصائيات تُخفى من الصفحة الرئيسية حتى تضع أرقاماً أكبر من صفر من لوحة التحكم.

## إشعارات Discord وتقديم إدارة السيرفر
- أضف متغير البيئة `DISCORD_WEBHOOK_URL` (رابط Webhook لقناة Discord) في Vercel ليصلك إشعار عند كل طلب انضمام/دعم/رسالة/تقديم إدارة.
- شغّل `supabase/update-2-staff.sql` مرة واحدة في Supabase.

## تحديث 4
- شغّل `supabase/update-3-staff-questions.sql` مرة واحدة في Supabase (يضيف عمود الإجابات).
- أسئلة تقديم الإدارة تعدّل من الملف `src/lib/staff-questions.ts`.
