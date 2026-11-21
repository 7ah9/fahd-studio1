import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { db } from "@/lib/supabase/admin";
import { RESOURCES } from "@/lib/admin-resources";
import { fieldErrors } from "@/lib/validation";

type Ctx = { params: Promise<{ resource: string }> };

export async function GET(_req: Request, { params }: Ctx) {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;

  const { resource } = await params;
  const cfg = RESOURCES[resource];
  if (!cfg) return NextResponse.json({ error: "not_found" }, { status: 404 });

  let q = db().from(cfg.table).select("*");
  for (const o of cfg.order) q = q.order(o.column, { ascending: o.ascending });
  const { data, error } = await q;
  if (error) {
    console.error("[admin:list]", error);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
  return NextResponse.json({ data });
}

export async function POST(req: Request, { params }: Ctx) {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;

  const { resource } = await params;
  const cfg = RESOURCES[resource];
  if (!cfg || !cfg.canCreate) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  const parsed = cfg.schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation", fields: fieldErrors(parsed.error) },
      { status: 400 },
    );
  }

  const row = { ...parsed.data } as Record<string, unknown>;
  // Empty image/link strings are stored as NULL for projects.
  if (resource === "projects") {
    row.image_url = row.image_url || null;
    row.link_url = row.link_url || null;
  }

  const { data, error } = await db().from(cfg.table).insert(row).select().single();
  if (error) {
    console.error("[admin:create]", error);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }
  return NextResponse.json({ data }, { status: 201 });
}
