import { Reveal } from "@/components/ui/Reveal";
import { SERVICE_ICONS } from "@/components/ui/Icons";

export function ServicesGrid({ items }: { items: { title: string; text: string }[] }) {
  return (
    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item, i) => {
        const Icon = SERVICE_ICONS[i % SERVICE_ICONS.length];
        return (
          <Reveal key={item.title} delay={(i % 3) * 0.08}>
            <article className="glass glass-hover group relative h-full overflow-hidden rounded-3xl p-7 sm:p-8">
              <div
                aria-hidden
                className="pointer-events-none absolute -top-20 end-[-20%] h-48 w-48 rounded-full bg-[radial-gradient(closest-side,rgb(111_156_203/0.22),transparent)] opacity-0 blur-xl transition-opacity duration-700 group-hover:opacity-100"
              />
              <div className="mb-7 flex items-center justify-between">
                <div className="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.04] text-accent transition-colors duration-500 group-hover:border-accent/40 group-hover:bg-accent/10">
                  <Icon width={26} height={26} />
                </div>
                <span className="font-display text-sm tracking-widest text-white/20">
                  {String(i + 1).padStart(2, "0")}
                </span>
              </div>
              <h3 className="text-xl font-semibold leading-snug text-white">{item.title}</h3>
              <p className="mt-3 text-[15px] leading-7 text-white/55">{item.text}</p>
            </article>
          </Reveal>
        );
      })}
    </div>
  );
}
