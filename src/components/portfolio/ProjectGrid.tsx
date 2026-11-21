"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/client";
import { pick } from "@/lib/i18n";
import type { Project } from "@/lib/types";
import { IconArrow, IconClose, IconExternal } from "@/components/ui/Icons";

/** next/image can only optimise hosts allowed in next.config; other URLs render unoptimised. */
const isOptimizable = (src: string) => src.includes("/storage/v1/object/public/");

function Cover({ src, alt, sizes }: { src: string | null; alt: string; sizes: string }) {
  if (!src) {
    return (
      <div className="absolute inset-0 grid place-items-center bg-[radial-gradient(80%_80%_at_50%_30%,rgb(58_84_120/0.35),transparent)]">
        <Image
          src="/brand/fahd-mark.png"
          alt=""
          width={1283}
          height={1187}
          className="h-1/2 w-auto opacity-25"
        />
      </div>
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      unoptimized={!isOptimizable(src)}
      className="object-cover transition-transform duration-700 ease-[var(--ease-expo)] group-hover:scale-[1.06]"
    />
  );
}

export function ProjectGrid({
  projects,
  showFilters = true,
}: {
  projects: Project[];
  showFilters?: boolean;
}) {
  const { lang, t } = useI18n();
  const [filter, setFilter] = useState<string>("all");
  const [active, setActive] = useState<Project | null>(null);

  const categories = useMemo(
    () => Array.from(new Set(projects.map((p) => p.category))),
    [projects],
  );
  const visible = filter === "all" ? projects : projects.filter((p) => p.category === filter);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setActive(null);
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [active]);

  if (!projects.length) {
    return (
      <div className="glass rounded-3xl px-8 py-20 text-center text-white/50">
        {t.portfolio.empty}
      </div>
    );
  }

  const statusLabel = (s: Project["status"]) =>
    s === "current" ? t.common.current : t.common.completed;

  return (
    <>
      {showFilters && categories.length > 1 && (
        <div
          role="group"
          aria-label={t.portfolio.filterLabel}
          className="mb-10 flex flex-wrap gap-2.5"
        >
          {["all", ...categories].map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setFilter(c)}
              aria-pressed={filter === c}
              className={`rounded-full border px-5 py-2 text-sm transition-all duration-300 ${
                filter === c
                  ? "border-accent bg-accent text-ink"
                  : "border-white/10 bg-white/[0.03] text-white/65 hover:border-accent/40 hover:text-white"
              }`}
            >
              {c === "all" ? t.common.all : c}
            </button>
          ))}
        </div>
      )}

      <motion.div layout className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <AnimatePresence mode="popLayout">
          {visible.map((p) => (
            <motion.button
              layout
              key={p.id}
              type="button"
              onClick={() => setActive(p)}
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="glass glass-hover group overflow-hidden rounded-3xl text-start"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-graphite">
                <Cover
                  src={p.image_url}
                  alt={pick(lang, p.title_ar, p.title_en)}
                  sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-transparent" />
                <span className="glass absolute start-4 top-4 rounded-full px-3 py-1 text-xs text-white/85">
                  {statusLabel(p.status)}
                </span>
              </div>
              <div className="p-6">
                <div className="mb-2 text-[12px] font-medium uppercase tracking-[0.18em] text-accent">
                  {p.category}
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {pick(lang, p.title_ar, p.title_en)}
                </h3>
                <p className="mt-2 line-clamp-2 text-[15px] leading-7 text-white/55">
                  {pick(lang, p.description_ar, p.description_en)}
                </p>
                <span className="mt-5 inline-flex items-center gap-2 text-sm text-white/60 transition-colors group-hover:text-accent">
                  {t.common.details}
                  <IconArrow
                    width={16}
                    height={16}
                    className="transition-transform duration-500 group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1"
                  />
                </span>
              </div>
            </motion.button>
          ))}
        </AnimatePresence>
      </motion.div>

      <AnimatePresence>
        {active && (
          <motion.div
            key="modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[80] grid place-items-center overflow-y-auto bg-ink/80 p-4 backdrop-blur-md"
            onClick={() => setActive(null)}
          >
            <motion.div
              role="dialog"
              aria-modal="true"
              aria-label={pick(lang, active.title_ar, active.title_en)}
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.98 }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="glass relative my-8 w-full max-w-3xl overflow-hidden rounded-3xl bg-coal/90"
            >
              <button
                type="button"
                autoFocus
                onClick={() => setActive(null)}
                aria-label={t.nav.close}
                className="glass absolute end-4 top-4 z-10 grid h-10 w-10 place-items-center rounded-full text-white transition-colors hover:border-accent/50"
              >
                <IconClose width={18} height={18} />
              </button>
              <div className="relative aspect-[16/9] bg-graphite">
                <Cover
                  src={active.image_url}
                  alt={pick(lang, active.title_ar, active.title_en)}
                  sizes="(min-width: 768px) 768px, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-coal via-transparent to-transparent" />
              </div>
              <div className="p-7 sm:p-10">
                <div className="mb-3 flex flex-wrap items-center gap-3 text-xs">
                  <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-medium text-accent">
                    {active.category}
                  </span>
                  <span className="rounded-full border border-white/10 px-3 py-1 text-white/60">
                    {statusLabel(active.status)}
                  </span>
                </div>
                <h3 className="font-display text-3xl font-semibold text-white">
                  {pick(lang, active.title_ar, active.title_en)}
                </h3>
                <p className="mt-4 text-base leading-8 text-white/70">
                  {pick(lang, active.description_ar, active.description_en)}
                </p>
                {pick(lang, active.details_ar, active.details_en) && (
                  <p className="mt-4 whitespace-pre-line text-[15px] leading-8 text-white/55">
                    {pick(lang, active.details_ar, active.details_en)}
                  </p>
                )}
                {active.link_url && (
                  <a
                    href={active.link_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 inline-flex items-center gap-2.5 rounded-full bg-accent px-6 py-3 text-sm font-medium text-ink transition-colors hover:bg-white"
                  >
                    {t.common.visit}
                    <IconExternal width={16} height={16} />
                  </a>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
