import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { DynamicForm, type FormField } from "@/components/forms/DynamicForm";
import { dictionaries } from "@/lib/i18n";
import { getDict, getLang } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = dictionaries[await getLang()];
  return { title: t.staff.navLabel, description: t.staff.subtitle };
}

export default async function StaffPage() {
  const { t } = await getDict();
  const s = t.staff;

  const fields: FormField[] = [
    { name: "full_name", label: s.fields.full_name, type: "text", half: true, maxLength: 80, autoComplete: "name" },
    { name: "age", label: s.fields.age, type: "number", half: true, min: 14, max: 80, ltr: true },
    { name: "discord_username", label: s.fields.discord_username, type: "text", half: true, ltr: true, maxLength: 33 },
    {
      name: "role",
      label: s.fields.role,
      type: "select",
      half: true,
      options: Object.entries(s.roles).map(([value, label]) => ({ value, label })),
    },
    {
      name: "experience",
      label: s.fields.experience,
      type: "select",
      options: Object.entries(s.experiences).map(([value, label]) => ({ value, label })),
    },
    { name: "availability", label: s.fields.availability, type: "text", maxLength: 200 },
    { name: "motivation", label: s.fields.motivation, type: "textarea", maxLength: 1500 },
    { name: "scenario", label: s.fields.scenario, type: "textarea", maxLength: 1500 },
  ];

  return (
    <>
      <PageHero kicker={s.kicker} title={s.title} subtitle={s.subtitle} />
      <section className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>
          <DynamicForm
            endpoint="/api/staff"
            fields={fields}
            submitLabel={t.common.submit}
            success={s.success}
            note={s.note}
          />
        </Reveal>
      </section>
    </>
  );
}
