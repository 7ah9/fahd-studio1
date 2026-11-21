import { Reveal } from "./Reveal";

/** Header block used at the top of every inner page. */
export function PageHero({
  kicker,
  title,
  subtitle,
}: {
  kicker: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden pt-36 pb-16 sm:pt-44 sm:pb-20">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[480px] bg-[radial-gradient(60%_80%_at_50%_0%,rgb(111_156_203/0.18),transparent_70%)]"
      />
      <div aria-hidden className="grid-floor pointer-events-none absolute inset-x-0 bottom-0 h-40 opacity-40" />
      <div className="relative mx-auto max-w-6xl px-5 sm:px-8">
        <Reveal y={18}>
          <div className="mb-5 flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.22em] text-accent">
            <span className="h-px w-8 bg-gradient-to-r from-transparent to-accent rtl:rotate-180" />
            {kicker}
          </div>
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.15] text-gradient sm:text-5xl lg:text-6xl">
            {title}
          </h1>
          {subtitle && (
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/60 sm:text-lg">
              {subtitle}
            </p>
          )}
        </Reveal>
      </div>
    </section>
  );
}
