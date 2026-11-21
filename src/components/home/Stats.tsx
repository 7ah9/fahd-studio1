"use client";

import { animate, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Reveal } from "@/components/ui/Reveal";

export type StatView = { id: string; label: string; value: number; suffix: string };

function CountUp({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.8,
      ease: [0.16, 1, 0.3, 1],
      onUpdate: (v) => setN(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value]);

  return (
    <span ref={ref} dir="ltr">
      {n.toLocaleString("en-US")}
      {suffix}
    </span>
  );
}

export function Stats({ stats, title }: { stats: StatView[]; title: string }) {
  if (!stats.length) return null;
  return (
    <section id="stats" className="relative mx-auto max-w-6xl scroll-mt-24 px-5 sm:px-8">
      <Reveal>
        <h2 className="sr-only">{title}</h2>
        <div className="glass grid grid-cols-2 overflow-hidden rounded-3xl md:grid-cols-4">
          {stats.map((s, i) => (
            <div
              key={s.id}
              className={`relative px-6 py-9 text-center sm:py-11 ${
                i % 2 === 1 ? "border-s border-white/[0.07]" : ""
              } ${i >= 2 ? "border-t border-white/[0.07] md:border-t-0" : ""} ${
                i > 0 ? "md:border-s md:border-white/[0.07]" : "md:border-s-0"
              }`}
            >
              <div className="font-display text-4xl font-semibold text-gradient sm:text-5xl">
                <CountUp value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-3 text-sm text-white/50 sm:text-[15px]">{s.label}</div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
