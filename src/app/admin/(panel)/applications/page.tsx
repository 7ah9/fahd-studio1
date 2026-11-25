import { InboxManager, type InboxConfig, type InboxRow } from "@/components/admin/InboxManager";
import { assertAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const config: InboxConfig = {
  resource: "applications",
  title: "طلبات الانضمام",
  subtitle: "راجع المتقدمين واقبل الطلبات أو ارفضها. تفاصيل كل متقدم تظهر عند اختياره.",
  empty: "لا توجد طلبات انضمام حتى الآن.",
  titleKey: "full_name",
  subKey: "discord_username",
  details: [
    { key: "discord_username", label: "Discord", ltr: true },
    { key: "age", label: "العمر" },
    { key: "email", label: "الإيميل", ltr: true },
    {
      key: "experience_level",
      label: "مستوى الخبرة",
      map: { beginner: "مبتدئ", intermediate: "متوسط", advanced: "متقدم", expert: "محترف" },
    },
    {
      key: "specialty",
      label: "التخصص",
      map: {
        scripting: "برمجة Luau",
        building: "بناء الخرائط",
        gui: "واجهات GUI",
        vehicles: "أنظمة المركبات",
        modeling: "النمذجة ثلاثية الأبعاد",
        other: "أخرى",
      },
    },
    { key: "portfolio_links", label: "نماذج الأعمال السابقة", long: true, ltr: true },
    { key: "about", label: "نبذة عن المتقدم", long: true },
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
  publicKey: { show: "show_public", name: "public_name" },
};

export default async function AdminApplicationsPage() {
  await assertAdmin();
  const { data } = await db()
    .from("join_applications")
    .select("*")
    .order("created_at", { ascending: false });
  return <InboxManager config={config} initial={(data ?? []) as InboxRow[]} />;
}
