import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ProjectGrid } from "@/components/portfolio/ProjectGrid";
import { getProjects } from "@/lib/data";
import { dictionaries } from "@/lib/i18n";
import { getDict, getLang } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = dictionaries[await getLang()];
  return { title: t.nav.portfolio, description: t.portfolio.subtitle };
}

export default async function PortfolioPage() {
  const { t } = await getDict();
  const projects = await getProjects();
  return (
    <>
      <PageHero kicker={t.portfolio.kicker} title={t.portfolio.title} subtitle={t.portfolio.subtitle} />
      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <ProjectGrid projects={projects} />
      </section>
    </>
  );
}
