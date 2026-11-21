import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { ServicesGrid } from "@/components/home/ServicesGrid";
import { Button } from "@/components/ui/Button";
import { Reveal } from "@/components/ui/Reveal";
import { dictionaries } from "@/lib/i18n";
import { getDict, getLang } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = dictionaries[await getLang()];
  return { title: t.nav.services, description: t.services.subtitle };
}

export default async function ServicesPage() {
  const { t } = await getDict();
  return (
    <>
      <PageHero kicker={t.services.kicker} title={t.services.title} subtitle={t.services.subtitle} />
      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <ServicesGrid items={t.services.items} />
        <Reveal className="mt-16 text-center">
          <Button href="/contact" arrow>
            {t.nav.contact}
          </Button>
        </Reveal>
      </section>
    </>
  );
}
