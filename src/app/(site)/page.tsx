import { Hero } from "@/components/home/Hero";
import { Stats } from "@/components/home/Stats";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { NewsList } from "@/components/home/NewsList";
import { ProjectGrid } from "@/components/portfolio/ProjectGrid";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { getNews, getProjects, getSettings, getStats } from "@/lib/data";
import { pick } from "@/lib/i18n";
import { getDict } from "@/lib/i18n/server";

export default async function HomePage() {
  const { lang, t } = await getDict();
  const [settings, stats, projects, news] = await Promise.all([
    getSettings(),
    getStats(),
    getProjects({ featuredOnly: true, limit: 3 }),
    getNews(4),
  ]);

  const title = settings[`hero_title_${lang}`] ?? t.hero.title;
  const subtitle = settings[`hero_subtitle_${lang}`] ?? t.hero.subtitle;

  const statViews = stats
    .filter((s) => s.value > 0)
    .map((s) => ({
      id: s.id,
      label: pick(lang, s.label_ar, s.label_en),
      value: s.value,
      suffix: s.suffix,
    }));

  return (
    <>
      <Hero
        eyebrow={t.hero.eyebrow}
        title={title}
        subtitle={subtitle}
        ctaWork={t.hero.ctaWork}
        ctaJoin={t.hero.ctaJoin}
        scroll={t.hero.scroll}
        chips={t.hero.chips}
      />

      <Stats stats={statViews} title={t.stats.title} />

      {/* About teaser */}
      <section className="mx-auto mt-32 max-w-6xl px-5 sm:px-8">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading kicker={t.about.kicker} title={t.about.title} />
            <Reveal delay={0.1}>
              <p className="mt-6 max-w-xl text-base leading-8 text-white/60">{t.about.intro}</p>
              <div className="mt-8">
                <Button href="/about" variant="ghost" arrow>
                  {t.common.learnMore}
                </Button>
              </div>
            </Reveal>
          </div>
          <Reveal delay={0.15}>
            <div className="glass relative overflow-hidden rounded-3xl p-8 sm:p-10">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-24 end-[-10%] h-64 w-64 rounded-full bg-[radial-gradient(closest-side,rgb(111_156_203/0.25),transparent)] blur-xl"
              />
              <div className="relative">
                <div className="mb-3 text-[13px] font-medium uppercase tracking-[0.22em] text-accent">
                  {t.about.visionTitle}
                </div>
                <p className="text-xl leading-9 text-white/90 sm:text-2xl sm:leading-10">
                  {t.about.vision}
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Services */}
      <section className="mx-auto mt-32 max-w-6xl px-5 sm:px-8">
        <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
          <SectionHeading
            kicker={t.services.kicker}
            title={t.services.title}
            subtitle={t.services.subtitle}
          />
          <Reveal>
            <Button href="/services" variant="ghost" arrow>
              {t.common.viewAll}
            </Button>
          </Reveal>
        </div>
        <ServicesGrid items={t.services.items} />
      </section>

      {/* Featured work (only when the admin marked projects as featured) */}
      {projects.length > 0 && (
        <section className="mx-auto mt-32 max-w-6xl px-5 sm:px-8">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <SectionHeading
              kicker={t.portfolio.kicker}
              title={t.portfolio.title}
              subtitle={t.portfolio.subtitle}
            />
            <Reveal>
              <Button href="/portfolio" variant="ghost" arrow>
                {t.common.viewAll}
              </Button>
            </Reveal>
          </div>
          <ProjectGrid projects={projects} showFilters={false} />
        </section>
      )}

      {/* News & announcements */}
      {news.length > 0 && (
        <section className="mx-auto mt-32 max-w-6xl px-5 sm:px-8">
          <div className="mb-14">
            <SectionHeading kicker={t.news.kicker} title={t.news.title} />
          </div>
          <NewsList items={news} lang={lang} labels={t.news} />
        </section>
      )}

      {/* Closing call to action */}
      <section className="mx-auto mt-32 max-w-6xl px-5 sm:px-8">
        <Reveal>
          <div className="glass relative overflow-hidden rounded-[2rem] px-8 py-16 text-center sm:px-16 sm:py-20">
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_90%_at_50%_0%,rgb(111_156_203/0.22),transparent_70%)]"
            />
            <div className="relative">
              <h2 className="mx-auto max-w-2xl font-display text-3xl font-semibold leading-[1.25] text-gradient sm:text-5xl">
                {t.join.title}
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-base leading-8 text-white/60">
                {t.join.subtitle}
              </p>
              <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
                <Button href="/join" arrow>
                  {t.nav.join}
                </Button>
                <Button href="/developer-support" variant="ghost">
                  {t.nav.support}
                </Button>
              </div>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
