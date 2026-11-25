import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminApi } from "@/lib/auth";
import { db } from "@/lib/supabase/admin";
import { RESOURCES } from "@/lib/admin-resources";
import { fieldErrors } from "@/lib/validation";
import { getSocialLinks } from "@/lib/data";
import { sendAcceptanceEmail } from "@/lib/mail";

const MAIL_KIND: Record<string, "join" | "staff"> = { applications: "join", staff: "staff" };
const ROLE_AR: Record<string, string> = {
  moderator: "أدمن (Admin)",
  support: "دعم الأعضاء",
  events: "تنظيم الفعاليات",
};

type Ctx = { params: Promise<{ resource: string; id: string }> };
const uuid = z.string().uuid();

export async function PATCH(req: Request, { params }: Ctx) {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;

  const { resource, id } = await params;
  const cfg = RESOURCES[resource];
  if (!cfg || !uuid.safeParse(id).success) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = cfg.schema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", fields: fieldErrors(parsed.error) },
      { status: 400 },
    );
  }

  const row = { ...parsed.data } as Record<string, unknown>;
  if (resource === "projects") {
    if ("image_url" in row) row.image_url = row.image_url || null;
    if ("link_url" in row) row.link_url = row.link_url || null;
  }
  if (cfg.touchUpdatedAt) row.updated_at = new Date().toISOString();
  if (Object.keys(row).length === 0) {
    return NextResponse.json({ error: "empty" }, { status: 400 });
  }

  const mailKind = MAIL_KIND[resource];
  let previous: Record<string, unknown> | null = null;
  if (mailKind) {
    // A visitor-facing list entry only makes sense while the application is accepted.
    if (typeof row.status === "string" && row.status !== "accepted") row.show_public = false;
    if (row.status === "accepted") {
      const { data: prev } = await db().from(cfg.table).select("*").eq("id", id).single();
      previous = prev as Record<string, unknown> | null;
    }
  }

  const { data, error } = await db()
    .from(cfg.table)
    .update(row)
    .eq("id", id)
    .select()
    .single();
  if (error) {
    console.error("[admin:update]", error);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }

  let mail: string | undefined;
  if (mailKind && previous && previous.status !== "accepted") {
    const to = String(previous.email ?? "").trim();
    if (!to) {
      mail = "no_email";
    } else {
      const discordUrl = (await getSocialLinks()).find((l) => l.platform === "discord")?.url;
      mail = await sendAcceptanceEmail({
        to,
        name: String(previous.full_name ?? ""),
        kind: mailKind,
        roleLabel: ROLE_AR[String(previous.role ?? "")],
        discordUrl,
      });
    }
  }
  return NextResponse.json({ data, mail });
}

export async function DELETE(_req: Request, { params }: Ctx) {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;

  const { resource, id } = await params;
  const cfg = RESOURCES[resource];
  if (!cfg || !uuid.safeParse(id).success) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const { error } = await db().from(cfg.table).delete().eq("id", id);
  if (error) {
    console.error("[admin:delete]", error);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
  return NextResponse.json({ ok: true });
}
