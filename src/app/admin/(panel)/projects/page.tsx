import { ProjectsManager } from "@/components/admin/ProjectsManager";
import { assertAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase/admin";
import type { Project } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminProjectsPage() {
  await assertAdmin();
  const { data } = await db()
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false });
  return <ProjectsManager initial={(data ?? []) as Project[]} />;
}
