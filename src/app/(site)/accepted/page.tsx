import type { Metadata } from "next";
import { PageHero } from "@/components/ui/PageHero";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { getAccepted } from "@/lib/data";
import { dictionaries } from "@/lib/i18n";
import { getDict, getLang } from "@/lib/i18n/server";

export async function generateMetadata(): Promise<Metadata> {
  const t = dictionaries[await getLang()];
  return { title: t.nav.accepted, description: t.accepted.subtitle };
}

function Person({ name, tag }: { name: string; tag: string }) {
  return (
    <div className="glass glass-hover flex items-center gap-4 rounded-2xl p-4">
      <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-accent/30 bg-accent/10 font-display text-lg font-semibold text-accent">
        {Array.from(name)[0]?.toUpperCase()}
      </span>
      <div className="min-w-0">
        <div className="truncate font-medium text-white">{name}</div>
        <div className="mt-0.5 truncate text-sm text-white/45">{tag}</div>
      </div>
    </div>
  );
}

export default async function AcceptedPage() {
  const { t } = await getDict();
  const a = t.accepted;
  const { members, staff } = await getAccepted();
  const specialties = t.join.specialties as Record<string, string>;
  const roles = t.staff.roles as Record<string, string>;

  return (
    <>
      <PageHero kicker={a.kicker} title={a.title} subtitle={a.subtitle} />
      <section className="mx-auto max-w-5xl px-5 sm:px-8">
        {members.length === 0 && staff.length === 0 ? (
          <p className="glass rounded-3xl px-6 py-16 text-center text-white/50">{a.empty}</p>
        ) : (
          <div className="space-y-12">
            {staff.length > 0 && (
              <Reveal>
                <h2 className="mb-5 font-display text-xl font-semibold text-white">{a.staff}</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {staff.map((p, i) => (
                    <Person key={`s${i}`} name={p.public_name} tag={roles[p.role] ?? p.role} />
                  ))}
                </div>
              </Reveal>
            )}
            {members.length > 0 && (
              <Reveal>
                <h2 className="mb-5 font-display text-xl font-semibold text-white">{a.developers}</h2>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {members.map((p, i) => (
                    <Person key={`m${i}`} name={p.public_name} tag={specialties[p.specialty] ?? p.specialty} />
                  ))}
                </div>
              </Reveal>
            )}
          </div>
        )}

        <Reveal>
          <div className="glass mt-14 flex flex-wrap items-center justify-between gap-4 rounded-2xl p-6">
            <p className="text-white/80">{a.cta}</p>
            <div className="flex flex-wrap gap-3">
              <Button href="/join" variant="ghost">
                {a.ctaJoin}
              </Button>
              <Button href="/staff" variant="ghost">
                {a.ctaStaff}
              </Button>
            </div>
          </div>
        </Reveal>
      </section>
    </>
  );
}
