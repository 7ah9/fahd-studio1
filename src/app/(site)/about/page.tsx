import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { IconTarget, IconSpark } from "@/components/ui/Icons";
import { dictionaries } from "@/lib/i18n";
import { getDict, getLang } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = dictionaries[await getLang()];
  return { title: t.nav.about, description: t.about.intro.slice(0, 160) };
}

export default async function AboutPage() {
  const { t } = await getDict();
  return (
    <>
      <PageHero kicker={t.about.kicker} title={t.about.title} subtitle={t.about.intro} />

      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Reveal>
            <div className="glass h-full rounded-3xl p-8 sm:p-10">
              <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
                <IconTarget width={24} height={24} />
              </div>
              <h2 className="text-2xl font-semibold text-white">{t.about.visionTitle}</h2>
              <p className="mt-4 text-base leading-8 text-white/60">{t.about.vision}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="glass h-full rounded-3xl p-8 sm:p-10">
              <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
                <IconSpark width={24} height={24} />
              </div>
              <h2 className="text-2xl font-semibold text-white">{t.about.goalsTitle}</h2>
              <ul className="mt-4 space-y-4">
                {t.about.goals.map((g) => (
                  <li key={g} className="flex gap-3 text-base leading-8 text-white/60">
                    <span className="mt-3 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
                    {g}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="mx-auto mt-28 max-w-6xl px-5 sm:px-8">
        <SectionHeading kicker={t.about.kicker} title={t.about.valuesTitle} />
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {t.about.values.map((v, i) => (
            <Reveal key={v.title} delay={i * 0.07}>
              <div className="glass glass-hover h-full rounded-3xl p-7">
                <div className="mb-5 font-display text-sm tracking-widest text-accent">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <h3 className="text-lg font-semibold text-white">{v.title}</h3>
                <p className="mt-3 text-[15px] leading-7 text-white/55">{v.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="mx-auto mt-28 max-w-6xl px-5 sm:px-8">
        <SectionHeading kicker={t.about.kicker} title={t.about.processTitle} />
        <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {t.about.process.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.08}>
              <li className="relative h-full rounded-3xl border border-white/[0.07] bg-coal/60 p-7">
                <span className="font-display text-5xl font-semibold text-white/[0.07]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-white">{s.title}</h3>
                <p className="mt-3 text-[15px] leading-7 text-white/55">{s.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section className="mx-auto mt-28 max-w-6xl px-5 text-center sm:px-8">
        <Reveal>
          <Button href="/join" arrow>
            {t.nav.join}
          </Button>
        </Reveal>
      </section>
    </>
  );
}
