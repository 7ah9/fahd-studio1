import "server-only";
import { cookies } from "next/headers";
import { dictionaries, normalizeLang, type Lang } from "./index";

export async function getLang(): Promise<Lang> {
  const store = await cookies();
  return normalizeLang(store.get("lang")?.value);
}

export async function getDict() {
  const lang = await getLang();
  return { lang, t: dictionaries[lang] };
}
