import { NewsManager } from "@/components/admin/NewsManager";
import { assertAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase/admin";
import type { NewsItem } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminNewsPage() {
  await assertAdmin();
  const { data } = await db().from("news").select("*").order("created_at", { ascending: false });
  return <NewsManager initial={(data ?? []) as NewsItem[]} />;
}
