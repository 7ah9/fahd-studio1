import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import type { FormField } from "@/components/forms/DynamicForm";
import { StaffForm, type StaffQuestionView } from "@/components/forms/StaffForm";
import { dictionaries } from "@/lib/i18n";
import { getDict, getLang } from "@/lib/i18n/server";
import { STAFF_QUESTIONS } from "@/lib/staff-questions";

export async function generateMetadata(): Promise<Metadata> {
  const t = dictionaries[await getLang()];
  return { title: t.staff.navLabel, description: t.staff.subtitle };
}

export default async function StaffPage() {
  const { lang, t } = await getDict();
  const s = t.staff;

  const base: FormField[] = [
    { name: "full_name", label: s.fields.full_name, type: "text", half: true, maxLength: 80, autoComplete: "name" },
    { name: "age", label: s.fields.age, type: "number", half: true, min: 14, max: 80, ltr: true },
    { name: "discord_username", label: s.fields.discord_username, type: "text", half: true, ltr: true, maxLength: 33 },
    { name: "email", label: s.fields.email, type: "email", half: true, ltr: true, maxLength: 120, autoComplete: "email", hint: s.fields.email_hint },
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
      half: true,
      options: Object.entries(s.experiences).map(([value, label]) => ({ value, label })),
    },
  ];

  const questions: StaffQuestionView[] = STAFF_QUESTIONS.map((q) => ({
    id: q.id,
    type: q.type,
    group: q.group,
    roles: q.roles,
    label: lang === "ar" ? q.ar : q.en,
    options: q.options?.map((o) => ({ value: o.value, label: lang === "ar" ? o.ar : o.en })),
  }));

  return (
    <>
      <PageHero kicker={s.kicker} title={s.title} subtitle={s.subtitle} />
      <section className="mx-auto max-w-3xl px-5 sm:px-8">
        <Reveal>
          <p className="glass mb-6 rounded-2xl px-5 py-4 text-sm leading-7 text-white/60">{s.pickRoleHint}</p>
          <StaffForm
            questions={questions}
            base={base}
            headings={{ general: s.headingGeneral, scenario: s.headingScenario }}
            submitLabel={t.common.submit}
            success={s.success}
            note={s.note}
          />
        </Reveal>
      </section>
    </>
  );
}
