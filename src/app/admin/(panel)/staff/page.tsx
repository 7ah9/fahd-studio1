import { InboxManager, type InboxConfig, type InboxRow } from "@/components/admin/InboxManager";
import { assertAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const config: InboxConfig = {
  resource: "staff",
  title: "تقديمات إدارة السيرفر",
  subtitle: "راجع المتقدمين لإدارة سيرفر Discord، واقبل الطلبات أو ارفضها.",
  empty: "لا توجد تقديمات لإدارة السيرفر حتى الآن.",
  titleKey: "full_name",
  subKey: "discord_username",
  details: [
    { key: "discord_username", label: "Discord", ltr: true },
    { key: "age", label: "العمر" },
    {
      key: "role",
      label: "الدور المطلوب",
      map: { moderator: "مشرف (Moderator)", support: "دعم الأعضاء", events: "تنظيم الفعاليات" },
    },
    {
      key: "experience",
      label: "الخبرة السابقة",
      map: { none: "لا يملك خبرة", some: "خبرة بسيطة", experienced: "خبرة جيدة" },
    },
    { key: "availability", label: "أوقات التواجد", long: true },
    { key: "motivation", label: "سبب التقديم", long: true },
    { key: "scenario", label: "إجابة السيناريو", long: true },
  ],
  status: {
    key: "status",
    options: [
      { value: "pending", label: "قيد المراجعة", tone: "neutral" },
      { value: "accepted", label: "مقبول", tone: "good" },
      { value: "rejected", label: "مرفوض", tone: "bad" },
    ],
  },
  noteKey: "admin_note",
};

export default async function AdminStaffPage() {
  await assertAdmin();
  const { data } = await db()
    .from("staff_applications")
    .select("*")
    .order("created_at", { ascending: false });
  return <InboxManager config={config} initial={(data ?? []) as InboxRow[]} />;
}
