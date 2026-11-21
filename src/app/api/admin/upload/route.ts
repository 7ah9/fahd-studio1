import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth";
import { db } from "@/lib/supabase/admin";

const BUCKET = "project-images";
const MAX_BYTES = 5 * 1024 * 1024;
const TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/webp": "webp",
  "image/avif": "avif",
};

/** Verifies the real file signature, not just the declared MIME type. */
function sniff(buf: Buffer): string | null {
  if (buf.length < 12) return null;
  if (buf.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])))
    return "image/png";
  if (buf[0] === 0xff && buf[1] === 0xd8 && buf[2] === 0xff) return "image/jpeg";
  if (buf.subarray(0, 4).toString("ascii") === "RIFF" && buf.subarray(8, 12).toString("ascii") === "WEBP")
    return "image/webp";
  if (buf.subarray(4, 8).toString("ascii") === "ftyp" && /avif|avis/.test(buf.subarray(8, 16).toString("ascii")))
    return "image/avif";
  return null;
}

export async function POST(req: Request) {
  const auth = await requireAdminApi();
  if ("response" in auth) return auth.response;

  const form = await req.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "no_file" }, { status: 400 });
  }
  if (file.size === 0 || file.size > MAX_BYTES) {
    return NextResponse.json({ error: "size" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  const mime = sniff(buffer);
  if (!mime || !TYPES[mime]) {
    return NextResponse.json({ error: "type" }, { status: 400 });
  }

  const path = `${new Date().getFullYear()}/${crypto.randomUUID()}.${TYPES[mime]}`;
  const { error } = await db().storage.from(BUCKET).upload(path, buffer, {
    contentType: mime,
    cacheControl: "31536000",
    upsert: false,
  });
  if (error) {
    console.error("[admin:upload]", error);
    return NextResponse.json({ error: "server" }, { status: 500 });
  }

  const { data } = db().storage.from(BUCKET).getPublicUrl(path);
  return NextResponse.json({ url: data.publicUrl });
}
