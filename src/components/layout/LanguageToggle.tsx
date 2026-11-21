"use client";

import { useTransition } from "react";
import { setLanguage } from "@/app/actions";
import { useI18n } from "@/lib/i18n/client";
import { IconGlobe } from "@/components/ui/Icons";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { lang, t } = useI18n();
  const [pending, start] = useTransition();

  return (
    <button
      type="button"
      onClick={() => start(() => setLanguage(lang === "ar" ? "en" : "ar"))}
      disabled={pending}
      aria-label={lang === "ar" ? "Switch to English" : "التبديل إلى العربية"}
      className={`glass inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium text-white/80 transition-all duration-300 hover:border-accent/50 hover:text-white disabled:opacity-60 ${className}`}
    >
      <IconGlobe width={16} height={16} />
      <span className={lang === "ar" ? "font-display" : ""}>{t.nav.language}</span>
    </button>
  );
}
