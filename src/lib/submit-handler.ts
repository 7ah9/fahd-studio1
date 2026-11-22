import "server-only";
import { NextResponse } from "next/server";
import type { ZodTypeAny } from "zod";
import { db, isDbConfigured } from "./supabase/admin";
import { clientIp, rateLimit } from "./rate-limit";
import { fieldErrors } from "./validation";
import { notifyDiscord } from "./notify";

const MAX_BODY_BYTES = 20_000;

/**
 * Factory for the public form endpoints (join / support / contact).
 * Order: size check → rate limit → honeypot → zod validation → insert.
 */
export function createSubmitHandler(opts: {
  schema: ZodTypeAny;
  table: string;
  name: string;
  limit?: number;
  windowMs?: number;
  /** Optional Discord notification sent after a successful insert. */
  notify?: { title: string; color: number; adminPath: string };
}) {
  const { schema, table, name, limit = 5, windowMs = 10 * 60 * 1000, notify } = opts;

  return async function POST(req: Request) {
    if (!isDbConfigured()) {
      return NextResponse.json({ error: "not_configured" }, { status: 503 });
    }

    const length = Number(req.headers.get("content-length") ?? 0);
    if (length > MAX_BODY_BYTES) {
      return NextResponse.json({ error: "too_large" }, { status: 413 });
    }

    if (!rateLimit(`${name}:${clientIp(req)}`, limit, windowMs)) {
      return NextResponse.json({ error: "rate_limited" }, { status: 429 });
    }

    let body: unknown;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "bad_json" }, { status: 400 });
    }
    if (typeof body !== "object" || body === null) {
      return NextResponse.json({ error: "bad_json" }, { status: 400 });
    }

    // Honeypot: real users never fill this hidden field. Pretend success to bots.
    if ((body as Record<string, unknown>).website) {
      return NextResponse.json({ ok: true });
    }

    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "validation", fields: fieldErrors(parsed.error) },
        { status: 400 },
      );
    }

    const { error } = await db().from(table).insert(parsed.data);
    if (error) {
      console.error(`[${name}]`, error);
      return NextResponse.json({ error: "server" }, { status: 500 });
    }
    if (notify) {
      await notifyDiscord({ ...notify, data: parsed.data as Record<string, unknown> });
    }
    return NextResponse.json({ ok: true });
  };
}
