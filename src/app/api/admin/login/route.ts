import { NextResponse } from "next/server";
import { createAuthClient } from "@/lib/supabase/server";
import { db, isDbConfigured } from "@/lib/supabase/admin";
import { clientIp, rateLimit } from "@/lib/rate-limit";
import { loginSchema } from "@/lib/validation";

export async function POST(req: Request) {
  if (!isDbConfigured()) {
    return NextResponse.json({ error: "not_configured" }, { status: 503 });
  }
  if (!rateLimit(`login:${clientIp(req)}`, 6, 10 * 60 * 1000)) {
    return NextResponse.json({ error: "rate_limited" }, { status: 429 });
  }

  const body = await req.json().catch(() => null);
  const parsed = loginSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "invalid_credentials" }, { status: 400 });
  }

  const supabase = await createAuthClient();
  const { data, error } = await supabase.auth.signInWithPassword(parsed.data);
  if (error || !data.user) {
    console.error("[admin:login] sign-in failed:", error?.message);
    return NextResponse.json(
      { error: "invalid_credentials", detail: error?.message ?? "" },
      { status: 401 },
    );
  }

  // Must also be listed as an admin; otherwise drop the session immediately.
  const { data: admin, error: adminError } = await db()
    .from("admins")
    .select("user_id")
    .eq("user_id", data.user.id)
    .maybeSingle();
  if (adminError) {
    console.error("[admin:login] admin lookup failed:", adminError.message);
    await supabase.auth.signOut();
    return NextResponse.json(
      { error: "admin_lookup_failed", detail: adminError.message },
      { status: 500 },
    );
  }
  if (!admin) {
    await supabase.auth.signOut();
    return NextResponse.json({ error: "not_admin" }, { status: 403 });
  }

  return NextResponse.json({ ok: true });
}
