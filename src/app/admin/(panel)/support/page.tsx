import { InboxManager, type InboxConfig, type InboxRow } from "@/components/admin/InboxManager";
import { assertAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const config: InboxConfig = {
  resource: "support",
  title: "طلبات دعم المطورين",
  subtitle: "تابع طلبات الدعم الواردة وحدّث حالتها.",
  empty: "لا توجد طلبات دعم حتى الآن.",
  titleKey: "full_name",
  subKey: "discord_username",
  details: [
    { key: "discord_username", label: "Discord", ltr: true },
    {
      key: "topic",
      label: "مجال الدعم",
      map: {
        scripting: "البرمجة (Luau)",
        building: "بناء الخرائط",
        gui: "واجهات GUI",
        vehicles: "أنظمة المركبات",
        other: "أخرى",
      },
    },
    { key: "message", label: "الطلب", long: true },
  ],
  status: {
    key: "status",
    options: [
      { value: "new", label: "جديد", tone: "accent" },
      { value: "in_progress", label: "قيد المتابعة", tone: "neutral" },
      { value: "resolved", label: "تم الحل", tone: "good" },
    ],
  },
};

export default async function AdminSupportPage() {
  await assertAdmin();
  const { data } = await db()
    .from("support_requests")
    .select("*")
    .order("created_at", { ascending: false });
  return <InboxManager config={config} initial={(data ?? []) as InboxRow[]} />;
}
