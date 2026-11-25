import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ProjectGrid } from "@/components/portfolio/ProjectGrid";
import { getProjects } from "@/lib/data";
import { dictionaries } from "@/lib/i18n";
import { getDict, getLang } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = dictionaries[await getLang()];
  return { title: t.nav.maps, description: t.maps.subtitle };
}

export default async function MapsPage() {
  const { t } = await getDict();
  const projects = await getProjects({ mapsOnly: true });
  return (
    <>
      <PageHero kicker={t.maps.kicker} title={t.maps.title} subtitle={t.maps.subtitle} />
      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <ProjectGrid projects={projects} />
      </section>
    </>
  );
}
