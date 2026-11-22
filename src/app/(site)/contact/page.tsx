import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { DynamicForm, type FormField } from "@/components/forms/DynamicForm";
import { IconExternal } from "@/components/ui/Icons";
import { getSocialLinks } from "@/lib/data";
import { PLATFORM_LABELS } from "@/lib/social";
import { dictionaries } from "@/lib/i18n";
import { getDict, getLang } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = dictionaries[await getLang()];
  return { title: t.nav.contact, description: t.contact.subtitle };
}

export default async function ContactPage() {
  const { t } = await getDict();
  const c = t.contact;
  const socials = await getSocialLinks();
  // Discord is the main channel: it gets its own direct button.
  const discord = socials.find((s) => s.platform === "discord");
  const sorted = socials.filter((s) => s.platform !== "discord");

  const fields: FormField[] = [
    { name: "name", label: c.fields.name, type: "text", half: true, maxLength: 80, autoComplete: "name" },
    { name: "email", label: c.fields.email, type: "email", half: true, ltr: true, maxLength: 200, autoComplete: "email" },
    { name: "subject", label: c.fields.subject, type: "text", maxLength: 120 },
    { name: "message", label: c.fields.message, type: "textarea", maxLength: 2000 },
  ];

  return (
    <>
      <PageHero kicker={c.kicker} title={c.title} subtitle={c.subtitle} />
      <section className="mx-auto grid max-w-6xl gap-10 px-5 sm:px-8 lg:grid-cols-[0.8fr_1.2fr]">
        <Reveal>
          <div>
            <h2 className="mb-5 text-[13px] font-medium uppercase tracking-[0.2em] text-white/40">
              {c.channels}
            </h2>
            {discord && (
              <a
                href={discord.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group mb-4 flex items-center justify-between gap-4 rounded-2xl bg-accent px-6 py-5 text-ink shadow-[0_14px_40px_-12px_rgb(111_156_203/0.7)] transition-all duration-300 hover:bg-white"
              >
                <span>
                  <span className="block text-lg font-semibold">{c.discordCta}</span>
                  <span className="mt-0.5 block text-sm text-ink/65">{c.discordHint}</span>
                </span>
                <IconExternal width={22} height={22} />
              </a>
            )}
            {sorted.length > 0 ? (
              <ul className="space-y-3">
                {sorted.map((s) => (
                  <li key={s.id}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="glass glass-hover group flex items-center justify-between rounded-2xl px-6 py-5"
                    >
                      <span className="text-lg font-medium text-white">
                        {PLATFORM_LABELS[s.platform] ?? s.platform}
                      </span>
                      <IconExternal
                        width={18}
                        height={18}
                        className="text-white/30 transition-colors group-hover:text-accent"
                      />
                    </a>
                  </li>
                ))}
              </ul>
            ) : !discord ? (
              <p className="glass rounded-2xl px-6 py-5 text-white/50">{c.noLinks}</p>
            ) : null}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <h2 className="sr-only">{c.formTitle}</h2>
          <DynamicForm
            endpoint="/api/contact"
            fields={fields}
            submitLabel={t.common.submit}
            success={c.success}
          />
        </Reveal>
      </section>
    </>
  );
}
