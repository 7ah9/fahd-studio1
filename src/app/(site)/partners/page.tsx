import type { Metadata } from "next";
import Image from "next/image";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { IconExternal } from "@/components/ui/Icons";
import { getPartners } from "@/lib/data";
import { dictionaries } from "@/lib/i18n";
import { getDict, getLang } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const t = dictionaries[await getLang()];
  return { title: t.partners.title, description: t.partners.subtitle };
}

const isOptimizable = (src: string) => src.includes("/storage/v1/object/public/");

export default async function PartnersPage() {
  const { t } = await getDict();
  const p = t.partners;
  const partners = await getPartners();

  return (
    <>
      <PageHero kicker={p.kicker} title={p.title} subtitle={p.subtitle} />
      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        {partners.length === 0 ? (
          <Reveal>
            <p className="glass rounded-3xl px-8 py-16 text-center text-white/55">{p.empty}</p>
          </Reveal>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {partners.map((partner, i) => {
              const body = (
                <>
                  <div className="relative grid h-28 w-full place-items-center">
                    {partner.logo_url ? (
                      <Image
                        src={partner.logo_url}
                        alt={partner.name}
                        fill
                        sizes="(min-width: 1024px) 300px, 50vw"
                        unoptimized={!isOptimizable(partner.logo_url)}
                        className="object-contain p-2"
                      />
                    ) : (
                      <span className="font-display text-3xl font-semibold text-gradient">
                        {partner.name}
                      </span>
                    )}
                  </div>
                  <div className="mt-6 flex items-center justify-between gap-3">
                    <h2 className="text-lg font-semibold text-white">{partner.name}</h2>
                    {partner.url && (
                      <span className="inline-flex items-center gap-1.5 text-sm text-white/40 transition-colors group-hover:text-accent">
                        {p.visit}
                        <IconExternal width={14} height={14} />
                      </span>
                    )}
                  </div>
                </>
              );
              return (
                <li key={partner.id}>
                  <Reveal delay={(i % 3) * 0.08}>
                    {partner.url ? (
                      <a
                        href={partner.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="glass glass-hover group block rounded-3xl p-7"
                      >
                        {body}
                      </a>
                    ) : (
                      <div className="glass rounded-3xl p-7">{body}</div>
                    )}
                  </Reveal>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </>
  );
}
