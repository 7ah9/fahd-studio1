import { Reveal } from "./Reveal";

export function SectionHeading({
  kicker,
  title,
  subtitle,
  align = "start",
}: {
  kicker: string;
  title: string;
  subtitle?: string;
  align?: "start" | "center";
}) {
  const center = align === "center";
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <div
        className={`mb-5 flex items-center gap-3 text-[13px] font-medium uppercase tracking-[0.22em] text-accent ${
          center ? "justify-center" : ""
        }`}
      >
        <span className="h-px w-8 bg-gradient-to-r from-transparent to-accent rtl:rotate-180" />
        {kicker}
      </div>
      <h2 className="font-display text-3xl font-semibold leading-[1.2] text-gradient sm:text-4xl lg:text-[44px]">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-5 text-base leading-8 text-white/60 sm:text-lg">{subtitle}</p>
      )}
    </Reveal>
  );
}
