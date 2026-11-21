import { Reveal } from "@/components/ui/Reveal";
import type { Lang } from "@/lib/i18n";
import { pick } from "@/lib/i18n";
import type { NewsItem } from "@/lib/types";

export function NewsList({
  items,
  lang,
  labels,
}: {
  items: NewsItem[];
  lang: Lang;
  labels: { news: string; announcement: string };
}) {
  const fmt = new Intl.DateTimeFormat(lang === "ar" ? "ar-SA-u-ca-gregory-nu-latn" : "en-US", {
    dateStyle: "medium",
  });
  return (
    <div className="grid gap-5 md:grid-cols-2">
      {items.map((n, i) => (
        <Reveal key={n.id} delay={(i % 2) * 0.08}>
          <article className="glass glass-hover h-full rounded-3xl p-7">
            <div className="mb-4 flex items-center gap-3 text-xs">
              <span className="rounded-full border border-accent/30 bg-accent/10 px-3 py-1 font-medium text-accent">
                {n.kind === "announcement" ? labels.announcement : labels.news}
              </span>
              <time dateTime={n.created_at} className="text-white/35">
                {fmt.format(new Date(n.created_at))}
              </time>
            </div>
            <h3 className="text-lg font-semibold leading-snug text-white">
              {pick(lang, n.title_ar, n.title_en)}
            </h3>
            <p className="mt-3 line-clamp-4 whitespace-pre-line text-[15px] leading-7 text-white/55">
              {pick(lang, n.body_ar, n.body_en)}
            </p>
          </article>
        </Reveal>
      ))}
    </div>
  );
}
