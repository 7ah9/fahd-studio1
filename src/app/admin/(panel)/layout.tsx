import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/AdminShell";
import { getAdminUser } from "@/lib/auth";
import { db } from "@/lib/supabase/admin";

async function count(table: string, column: string, value: string | boolean) {
  const { count: n } = await db()
    .from(table)
    .select("id", { count: "exact", head: true })
    .eq(column, value);
  return n ?? 0;
}

export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  // Server-side re-check: the proxy is only the first gate.
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");

  const [applications, staff, support, messages] = await Promise.all([
    count("join_applications", "status", "pending"),
    count("staff_applications", "status", "pending"),
    count("support_requests", "status", "new"),
    count("contact_messages", "is_read", false),
  ]);

  return (
    <AdminShell email={user.email ?? ""} badges={{ applications, staff, support, messages }}>
      {children}
    </AdminShell>
  );
}
