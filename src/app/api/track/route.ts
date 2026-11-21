import { NextResponse } from "next/server";
import { db, isDbConfigured } from "@/lib/supabase/admin";
import { clientIp, rateLimit } from "@/lib/rate-limit";

/** Counts one visit per browser session (the client sends this once). */
export async function POST(req: Request) {
  if (!isDbConfigured()) return NextResponse.json({ ok: false }, { status: 503 });
  if (!rateLimit(`track:${clientIp(req)}`, 30, 60 * 60 * 1000)) {
    return NextResponse.json({ ok: false }, { status: 429 });
  }
  const { error } = await db().rpc("increment_page_view");
  if (error) console.error("[track]", error);
  return NextResponse.json({ ok: !error });
}
