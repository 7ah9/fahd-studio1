"use client";

import { createContext, useContext, type ReactNode } from "react";
import { dictionaries, type Dict, type Lang } from "./index";

type Ctx = { lang: Lang; t: Dict; dir: "rtl" | "ltr" };
const I18nContext = createContext<Ctx | null>(null);

export function I18nProvider({
  lang,
  children,
}: {
  lang: Lang;
  children: ReactNode;
}) {
  return (
    <I18nContext.Provider
      value={{ lang, t: dictionaries[lang], dir: lang === "ar" ? "rtl" : "ltr" }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): Ctx {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used inside <I18nProvider>");
  return ctx;
}
