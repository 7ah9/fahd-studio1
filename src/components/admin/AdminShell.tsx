"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";

type Badges = { applications: number; support: number; messages: number };

const NAV: { href: string; label: string; badge?: keyof Badges }[] = [
  { href: "/admin", label: "لوحة المعلومات" },
  { href: "/admin/projects", label: "المشاريع" },
  { href: "/admin/applications", label: "طلبات الانضمام", badge: "applications" },
  { href: "/admin/support", label: "دعم المطورين", badge: "support" },
  { href: "/admin/messages", label: "رسائل التواصل", badge: "messages" },
  { href: "/admin/news", label: "الأخبار والإعلانات" },
  { href: "/admin/content", label: "محتوى الموقع" },
];

export function AdminShell({
  email,
  badges,
  children,
}: {
  email: string;
  badges: Badges;
  children: ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    await fetch("/api/admin/logout", { method: "POST" }).catch(() => {});
    router.replace("/admin/login");
    router.refresh();
  }

  const active = (href: string) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));

  return (
    <div className="min-h-screen lg:flex">
      <aside className="border-b border-white/[0.07] bg-coal lg:sticky lg:top-0 lg:h-screen lg:w-64 lg:shrink-0 lg:border-b-0 lg:border-e">
        <div className="flex items-center justify-between gap-3 px-5 py-4 lg:block lg:py-6">
          <Link href="/admin" className="flex items-center gap-3" aria-label="FAHD STUDIO admin">
            <Image src="/brand/fahd-mark.png" alt="" width={1283} height={1187} className="h-9 w-auto" />
            <span className="font-display text-sm font-semibold tracking-[0.16em]">
              FAHD <span className="text-accent">ADMIN</span>
            </span>
          </Link>
          <button
            onClick={logout}
            disabled={busy}
            className="text-xs text-white/45 transition-colors hover:text-white lg:hidden"
          >
            تسجيل الخروج
          </button>
        </div>

        <nav
          aria-label="لوحة الإدارة"
          className="flex gap-1 overflow-x-auto px-3 pb-3 lg:flex-col lg:overflow-visible lg:pb-0"
        >
          {NAV.map((n) => {
            const count = n.badge ? badges[n.badge] : 0;
            return (
              <Link
                key={n.href}
                href={n.href}
                aria-current={active(n.href) ? "page" : undefined}
                className={`flex shrink-0 items-center justify-between gap-3 rounded-xl px-4 py-2.5 text-sm transition-colors ${
                  active(n.href)
                    ? "bg-white/[0.07] text-white"
                    : "text-white/55 hover:bg-white/[0.04] hover:text-white"
                }`}
              >
                {n.label}
                {count > 0 && (
                  <span className="grid min-w-5 place-items-center rounded-full bg-accent px-1.5 text-[11px] font-semibold text-ink">
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="hidden px-5 pb-6 lg:absolute lg:inset-x-0 lg:bottom-0 lg:block">
          <div className="hairline mb-4" />
          <p className="truncate text-xs text-white/35" dir="ltr">
            {email}
          </p>
          <button
            onClick={logout}
            disabled={busy}
            className="mt-3 text-sm text-white/55 transition-colors hover:text-white"
          >
            تسجيل الخروج
          </button>
          <Link href="/" target="_blank" className="mt-3 block text-sm text-white/35 transition-colors hover:text-accent">
            عرض الموقع ↗
          </Link>
        </div>
      </aside>

      <div className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10 lg:py-10">{children}</div>
    </div>
  );
}
