import { ar, type Dict } from "./ar";
import { en } from "./en";

export type Lang = "ar" | "en";
export const LANGS: Lang[] = ["ar", "en"];
export const DEFAULT_LANG: Lang = "ar";

export const dictionaries: Record<Lang, Dict> = { ar, en };

export function normalizeLang(value: string | undefined | null): Lang {
  return value === "en" ? "en" : "ar";
}

/** Pick the localized value of a bilingual DB field, falling back to the other language. */
export function pick(
  lang: Lang,
  arValue?: string | null,
  enValue?: string | null,
): string {
  return lang === "ar" ? arValue || enValue || "" : enValue || arValue || "";
}

export type { Dict };
