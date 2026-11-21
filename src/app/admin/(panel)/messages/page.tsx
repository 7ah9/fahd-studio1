import { InboxManager, type InboxConfig, type InboxRow } from "@/components/admin/InboxManager";
import { assertAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

const config: InboxConfig = {
  resource: "messages",
  title: "رسائل التواصل",
  subtitle: "الرسائل الواردة من نموذج التواصل في الموقع.",
  empty: "لا توجد رسائل حتى الآن.",
  titleKey: "name",
  subKey: "subject",
  details: [
    { key: "email", label: "البريد الإلكتروني", ltr: true },
    { key: "subject", label: "الموضوع" },
    { key: "message", label: "الرسالة", long: true },
  ],
  readKey: "is_read",
  emailKey: "email",
};

export default async function AdminMessagesPage() {
  await assertAdmin();
  const { data } = await db()
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  return <InboxManager config={config} initial={(data ?? []) as InboxRow[]} />;
}
