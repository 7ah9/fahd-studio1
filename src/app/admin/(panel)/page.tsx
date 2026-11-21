import { Card, PageTitle } from "@/components/admin/ui";
import { assertAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

async function total(table: string, filter?: [string, string | boolean]) {
  let q = db().from(table).select("id", { count: "exact", head: true });
  if (filter) q = q.eq(filter[0], filter[1]);
  const { count } = await q;
  return count ?? 0;
}

export default async function DashboardPage() {
  await assertAdmin();
  const [projects, applications, pending, accepted, support, openSupport, messages, unread] =
    await Promise.all([
      total("projects"),
      total("join_applications"),
      total("join_applications", ["status", "pending"]),
      total("join_applications", ["status", "accepted"]),
      total("support_requests"),
      total("support_requests", ["status", "new"]),
      total("contact_messages"),
      total("contact_messages", ["is_read", false]),
    ]);

  const { data: viewRows } = await db()
    .from("page_views")
    .select("day,views")
    .order("day", { ascending: false })
    .limit(365);
  const views = (viewRows ?? []) as { day: string; views: number }[];
  const allTime = views.reduce((s, r) => s + r.views, 0);
  const last14 = views.slice(0, 14).reverse();
  const peak = Math.max(1, ...last14.map((r) => r.views));
  const last7 = views.slice(0, 7).reduce((s, r) => s + r.views, 0);

  const cards = [
    { label: "الزيارات (آخر 7 أيام)", value: last7, sub: `الإجمالي ${allTime.toLocaleString("en-US")}` },
    { label: "المشاريع المنشورة", value: projects },
    { label: "طلبات الانضمام", value: applications, sub: `${pending} بانتظار المراجعة · ${accepted} مقبول` },
    { label: "طلبات دعم المطورين", value: support, sub: `${openSupport} جديد` },
    { label: "رسائل التواصل", value: messages, sub: `${unread} غير مقروءة` },
  ];

  return (
    <>
      <PageTitle title="لوحة المعلومات" subtitle="نظرة عامة على نشاط الموقع والطلبات الواردة." />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((c) => (
          <Card key={c.label}>
            <div className="text-sm text-white/50">{c.label}</div>
            <div className="mt-3 font-display text-4xl font-semibold text-white" dir="ltr">
              {c.value.toLocaleString("en-US")}
            </div>
            {c.sub && <div className="mt-2 text-xs text-white/35">{c.sub}</div>}
          </Card>
        ))}
      </div>

      <Card className="mt-6">
        <h2 className="text-lg font-semibold text-white">الزيارات اليومية (آخر 14 يوماً)</h2>
        <p className="mt-1 text-xs text-white/35">تُحتسب زيارة واحدة لكل جلسة متصفح.</p>
        {last14.length === 0 ? (
          <p className="mt-8 text-sm text-white/40">لا توجد بيانات زيارات بعد.</p>
        ) : (
          <div className="mt-8 flex h-44 items-end gap-2" dir="ltr" role="img" aria-label="رسم بياني للزيارات اليومية">
            {last14.map((r) => (
              <div key={r.day} className="flex h-full flex-1 flex-col items-center justify-end gap-2">
                <span className="text-[11px] text-white/50">{r.views}</span>
                <div
                  title={`${r.day}: ${r.views}`}
                  className="w-full rounded-t-md bg-gradient-to-t from-accent-deep to-accent"
                  style={{ height: `${Math.max(4, (r.views / peak) * 100)}%` }}
                />
                <span className="text-[10px] text-white/30">{r.day.slice(5)}</span>
              </div>
            ))}
          </div>
        )}
      </Card>
    </>
  );
}
