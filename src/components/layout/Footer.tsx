import Image from "next/image";
import Link from "next/link";
import { getDict } from "@/lib/i18n/server";
import { getSocialLinks } from "@/lib/data";
import { PLATFORM_LABELS } from "@/lib/social";
import { IconExternal } from "@/components/ui/Icons";

export async function Footer() {
  const { t } = await getDict();
  const socials = await getSocialLinks();
  const links = [
    { href: "/about", label: t.nav.about },
    { href: "/services", label: t.nav.services },
    { href: "/portfolio", label: t.nav.portfolio },
    { href: "/partners", label: t.nav.partners },
    { href: "/developer-support", label: t.nav.support },
    { href: "/join", label: t.nav.join },
    { href: "/staff", label: t.staff.navLabel },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <footer className="relative mt-32 overflow-hidden border-t border-white/[0.07] bg-coal">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/50 to-transparent"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -bottom-40 start-1/2 h-80 w-[640px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgb(111_156_203/0.16),transparent_70%)] blur-2xl rtl:translate-x-1/2"
      />
      <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="grid gap-12 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link href="/" className="inline-flex items-center gap-3" aria-label="FAHAD STUDIO">
              <Image
                src="/brand/fahd-mark.png"
                alt=""
                width={1283}
                height={1187}
                className="h-14 w-auto"
              />
              <span className="font-display text-xl font-semibold tracking-[0.18em]">
                FAHAD <span className="text-accent">STUDIO</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-[15px] leading-7 text-white/55">{t.footer.tagline}</p>
            <Image
              src="/brand/fahd-tagline.png"
              alt=""
              width={906}
              height={173}
              className="mt-7 h-9 w-auto opacity-80"
            />
          </div>

          <nav aria-label="Footer">
            <h3 className="mb-5 text-[13px] font-medium uppercase tracking-[0.2em] text-white/40">
              {t.footer.links}
            </h3>
            <ul className="space-y-3">
              {links.map((l) => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-[15px] text-white/65 transition-colors hover:text-accent"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {socials.length > 0 && (
            <div>
              <h3 className="mb-5 text-[13px] font-medium uppercase tracking-[0.2em] text-white/40">
                {t.footer.follow}
              </h3>
              <ul className="space-y-3">
                {socials.map((s) => (
                  <li key={s.id}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group inline-flex items-center gap-2 text-[15px] text-white/65 transition-colors hover:text-accent"
                    >
                      {PLATFORM_LABELS[s.platform] ?? s.platform}
                      <IconExternal
                        width={14}
                        height={14}
                        className="opacity-0 transition-opacity group-hover:opacity-100"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="hairline mt-14" />
        <p className="mt-6 text-sm text-white/35">
          © {new Date().getFullYear()} FAHAD STUDIO. {t.footer.rights}
        </p>
      </div>
    </footer>
  );
}
