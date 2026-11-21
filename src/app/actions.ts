"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { normalizeLang } from "@/lib/i18n";

export async function setLanguage(value: string) {
  const lang = normalizeLang(value);
  const store = await cookies();
  store.set("lang", lang, {
    path: "/",
    maxAge: 60 * 60 * 24 * 365,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  revalidatePath("/", "layout");
}
