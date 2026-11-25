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
      map: { moderator: "أدمن (Admin)", support: "دعم الأعضاء", events: "تنظيم الفعاليات" },
    },
    {
      key: "experience",
      label: "الخبرة السابقة",
      map: { none: "لا يملك خبرة", some: "خبرة بسيطة", experienced: "خبرة جيدة" },
    },
    // Older applications (before the new question sets) kept these as separate columns.
    { key: "availability", label: "أوقات التواجد (تقديم قديم)", long: true, hideEmpty: true },
    { key: "motivation", label: "سبب التقديم (تقديم قديم)", long: true, hideEmpty: true },
    {
      key: "scenario",
      label: "جواب سؤال: عضو يخالف القوانين ويستفز الآخرين في الشات، كيف تتصرف؟",
      long: true,
      hideEmpty: true,
    },
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
  qaKey: "answers",
};

export default async function AdminStaffPage() {
  await assertAdmin();
  const { data } = await db()
    .from("staff_applications")
    .select("*")
    .order("created_at", { ascending: false });
  return <InboxManager config={config} initial={(data ?? []) as InboxRow[]} />;
}
