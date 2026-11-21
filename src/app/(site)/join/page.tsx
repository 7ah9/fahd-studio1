import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { DynamicForm, type FormField } from "@/components/forms/DynamicForm";
import { dictionaries } from "@/lib/i18n";
import { getDict, getLang } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = dictionaries[await getLang()];
  return { title: t.nav.join, description: t.join.subtitle };
}

export default async function JoinPage() {
  const { t } = await getDict();
  const j = t.join;

  const fields: FormField[] = [
    { name: "full_name", label: j.fields.full_name, type: "text", half: true, maxLength: 80, autoComplete: "name" },
    { name: "age", label: j.fields.age, type: "number", half: true, min: 10, max: 80, ltr: true },
    { name: "discord_username", label: j.fields.discord_username, type: "text", half: true, ltr: true, maxLength: 33 },
    {
      name: "experience_level",
      label: j.fields.experience_level,
      type: "select",
      half: true,
      options: Object.entries(j.levels).map(([value, label]) => ({ value, label })),
    },
    {
      name: "specialty",
      label: j.fields.specialty,
      type: "select",
      options: Object.entries(j.specialties).map(([value, label]) => ({ value, label })),
    },
    {
      name: "portfolio_links",
      label: j.fields.portfolio_links,
      type: "textarea",
      hint: j.fields.portfolio_hint,
      optional: true,
      ltr: true,
      maxLength: 1500,
    },
    { name: "about", label: j.fields.about, type: "textarea", maxLength: 1500 },
  ];

  return (
    <>
      <PageHero kicker={j.kicker} title={j.title} subtitle={j.subtitle} />
      <section className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>
          <DynamicForm
            endpoint="/api/join"
            fields={fields}
            submitLabel={t.common.submit}
            success={j.success}
            note={j.note}
          />
        </Reveal>
      </section>
    </>
  );
}
