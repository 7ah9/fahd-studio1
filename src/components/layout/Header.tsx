"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/client";
import { LanguageToggle } from "./LanguageToggle";
import { IconClose, IconMenu } from "@/components/ui/Icons";

const LINKS = [
  { href: "/", key: "home" },
  { href: "/about", key: "about" },
  { href: "/services", key: "services" },
  { href: "/portfolio", key: "portfolio" },
  { href: "/developer-support", key: "support" },
  { href: "/contact", key: "contact" },
] as const;

export function Header() {
  const { t } = useI18n();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-[90] focus:rounded-full focus:bg-accent focus:px-5 focus:py-2 focus:text-ink"
      >
        {t.common.skip}
      </a>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          scrolled || open
            ? "border-b border-white/[0.07] bg-ink/70 backdrop-blur-xl"
            : "border-b border-transparent"
        }`}
      >
        <div className="mx-auto flex h-[72px] max-w-6xl items-center justify-between gap-6 px-5 sm:px-8">
          <Link href="/" className="group flex items-center gap-3" aria-label="FAHD STUDIO">
            <Image
              src="/brand/fahd-mark.png"
              alt=""
              width={1283}
              height={1187}
              priority
              className="h-10 w-auto transition-transform duration-500 group-hover:scale-105"
            />
            <span className="font-display text-[17px] font-semibold tracking-[0.18em] text-white">
              FAHD <span className="text-accent">STUDIO</span>
            </span>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                aria-current={isActive(l.href) ? "page" : undefined}
                className={`relative rounded-full px-4 py-2 text-[14.5px] transition-colors duration-300 ${
                  isActive(l.href) ? "text-white" : "text-white/55 hover:text-white"
                }`}
              >
                {t.nav[l.key]}
                {isActive(l.href) && (
                  <motion.span
                    layoutId="nav-pill"
                    className="absolute inset-0 -z-10 rounded-full border border-white/10 bg-white/[0.06]"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <LanguageToggle className="hidden sm:inline-flex" />
            <Link
              href="/join"
              className="hidden rounded-full bg-accent px-5 py-2.5 text-sm font-medium text-ink shadow-[0_8px_30px_-8px_rgb(111_156_203/0.7)] transition-all duration-300 hover:bg-white lg:inline-flex"
            >
              {t.nav.join}
            </Link>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? t.nav.close : t.nav.menu}
              className="glass grid h-11 w-11 place-items-center rounded-full text-white lg:hidden"
            >
              {open ? <IconClose width={20} height={20} /> : <IconMenu width={20} height={20} />}
            </button>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            key="mobile-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 overflow-y-auto bg-ink/95 pt-[88px] backdrop-blur-2xl lg:hidden"
          >
            <nav className="mx-auto flex max-w-6xl flex-col gap-1 px-5 pb-12 sm:px-8" aria-label="Mobile">
              {[...LINKS, { href: "/join", key: "join" as const }].map((l, i) => (
                <motion.div
                  key={l.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 * i + 0.05, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <Link
                    href={l.href}
                    className={`flex items-center justify-between border-b border-white/[0.07] py-5 text-2xl font-medium ${
                      isActive(l.href) ? "text-accent" : "text-white/85"
                    }`}
                  >
                    {t.nav[l.key]}
                    <span className="font-display text-sm text-white/25">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </Link>
                </motion.div>
              ))}
              <div className="mt-8">
                <LanguageToggle />
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
