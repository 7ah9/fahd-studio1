import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { db } from "@/lib/supabase/admin";
import { fieldErrors, settingsSchema } from "@/lib/validation";

/** Upserts editable site settings (hero texts). Empty value = fall back to default copy. */
export async function PUT(req: Request) {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;

  const body = await req.json().catch(() => null);
  const parsed = settingsSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", fields: fieldErrors(parsed.error) },
      { status: 400 },
    );
  }

  const rows = Object.entries(parsed.data.values).map(([key, value]) => ({
    key,
    value,
    updated_at: new Date().toISOString(),
  }));
  if (rows.length === 0) return NextResponse.json({ ok: true });

  const { error } = await db().from("site_settings").upsert(rows, { onConflict: "key" });
  if (error) {
    console.error("[admin:settings]", error);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
