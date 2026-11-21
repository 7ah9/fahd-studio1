import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/Button";
import { DynamicForm, type FormField } from "@/components/forms/DynamicForm";
import { IconCode, IconUsers, IconSpark } from "@/components/ui/Icons";
import { dictionaries } from "@/lib/i18n";
import { getDict, getLang } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = dictionaries[await getLang()];
  return { title: t.nav.support, description: t.support.subtitle };
}

const OFFER_ICONS = [IconUsers, IconCode, IconSpark];

export default async function DeveloperSupportPage() {
  const { t } = await getDict();
  const s = t.support;

  const fields: FormField[] = [
    { name: "full_name", label: s.fields.full_name, type: "text", half: true, maxLength: 80, autoComplete: "name" },
    { name: "discord_username", label: s.fields.discord_username, type: "text", half: true, ltr: true, maxLength: 33 },
    {
      name: "topic",
      label: s.fields.topic,
      type: "select",
      options: Object.entries(s.topics).map(([value, label]) => ({ value, label })),
    },
    { name: "message", label: s.fields.message, type: "textarea", maxLength: 1500 },
  ];

  return (
    <>
      <PageHero kicker={s.kicker} title={s.title} subtitle={s.subtitle} />

      <section className="mx-auto max-w-6xl px-5 sm:px-8">
        <SectionHeading kicker={s.kicker} title={s.offerTitle} />
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {s.offers.map((o, i) => {
            const Icon = OFFER_ICONS[i % OFFER_ICONS.length];
            return (
              <Reveal key={o.title} delay={i * 0.08}>
                <div className="glass glass-hover h-full rounded-3xl p-8">
                  <div className="mb-6 grid h-12 w-12 place-items-center rounded-2xl border border-accent/30 bg-accent/10 text-accent">
                    <Icon width={24} height={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-white">{o.title}</h3>
                  <p className="mt-3 text-[15px] leading-7 text-white/55">{o.text}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </section>

      <section className="mx-auto mt-28 max-w-6xl px-5 sm:px-8">
        <SectionHeading kicker={s.kicker} title={s.stepsTitle} />
        <ol className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
          {s.steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 0.08}>
              <li className="h-full rounded-3xl border border-white/[0.07] bg-coal/60 p-7">
                <span className="font-display text-5xl font-semibold text-white/[0.07]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="mt-4 text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-[15px] leading-7 text-white/55">{step.text}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </section>

      <section id="request" className="mx-auto mt-28 grid max-w-6xl scroll-mt-28 gap-12 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <SectionHeading kicker={s.kicker} title={s.formTitle} subtitle={s.formText} />
          <Reveal delay={0.1} className="mt-10">
            <div className="glass rounded-3xl p-7">
              <h3 className="text-lg font-semibold text-white">{s.joinTitle}</h3>
              <p className="mt-2 text-[15px] leading-7 text-white/55">{s.joinText}</p>
              <div className="mt-6">
                <Button href="/join" variant="ghost" arrow>
                  {t.nav.join}
                </Button>
              </div>
            </div>
          </Reveal>
        </div>
        <Reveal delay={0.1}>
          <DynamicForm
            endpoint="/api/support"
            fields={fields}
            submitLabel={t.common.submit}
            success={s.success}
          />
        </Reveal>
      </section>
    </>
  );
}
