"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { Button } from "@/components/ui/Button";

type HeroProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  ctaWork: string;
  ctaJoin: string;
  scroll: string;
  chips: string[];
};

const CHIP_POS = [
  "top-[10%] start-[0%]",
  "top-[44%] end-[-2%]",
  "bottom-[10%] start-[10%]",
];

export function Hero({ eyebrow, title, subtitle, ctaWork, ctaJoin, scroll, chips }: HeroProps) {
  const stage = useRef<HTMLDivElement>(null);
  const section = useRef<HTMLElement>(null);
  const [inView, setInView] = useState(true);

  // Same look, less work: stop the endless floor animation once the hero is scrolled out of view.
  useEffect(() => {
    const el = section.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold: 0 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 70, damping: 16 });
  const sy = useSpring(my, { stiffness: 70, damping: 16 });
  const rotateY = useTransform(sx, [-1, 1], [-14, 14]);
  const rotateX = useTransform(sy, [-1, 1], [10, -10]);

  function onMove(e: React.PointerEvent<HTMLDivElement>) {
    if (e.pointerType !== "mouse") return;
    const el = stage.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    mx.set(((e.clientX - r.left) / r.width) * 2 - 1);
    my.set(((e.clientY - r.top) / r.height) * 2 - 1);
  }
  function onLeave() {
    mx.set(0);
    my.set(0);
  }

  return (
    <section ref={section} className="noise relative isolate flex min-h-[100svh] items-center overflow-hidden pt-28 pb-20">
      {/* ambient light */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 start-1/2 -z-10 h-[620px] w-[900px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(111_156_203/0.22),transparent)] blur-3xl rtl:translate-x-1/2"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 end-0 -z-10 h-[420px] w-[420px] rounded-full bg-[radial-gradient(closest-side,rgb(58_84_120/0.35),transparent)] blur-3xl"
      />
      {/* perspective grid floor */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 -z-10 h-[52%] overflow-hidden [perspective:620px]"
      >
        <div className={`grid-floor absolute inset-x-[-60%] bottom-0 h-full animate-[floor-move_4s_linear_infinite] [transform-origin:50%_100%] [transform:rotateX(64deg)] ${inView ? "" : "[animation-play-state:paused]"}`} />
      </div>

      <div className="mx-auto grid w-full max-w-6xl items-center gap-14 px-5 sm:px-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
            className="glass mb-8 inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[13px] font-medium tracking-wide text-white/75"
          >
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent/70" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-accent" />
            </span>
            {eyebrow}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 28 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[40px] font-semibold leading-[1.12] text-gradient sm:text-6xl lg:text-[68px]"
          >
            {title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.75, ease: [0.16, 1, 0.3, 1] }}
            className="mt-7 max-w-xl text-base leading-8 text-white/60 sm:text-lg sm:leading-9"
          >
            {subtitle}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1.9, ease: [0.16, 1, 0.3, 1] }}
            className="mt-10 flex flex-wrap items-center gap-4"
          >
            <Button href="/portfolio" arrow>
              {ctaWork}
            </Button>
            <Button href="/join" variant="ghost">
              {ctaJoin}
            </Button>
          </motion.div>
        </div>

        {/* 3D logo stage */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 1.5, ease: [0.16, 1, 0.3, 1] }}
          ref={stage}
          onPointerMove={onMove}
          onPointerLeave={onLeave}
          className="relative mx-auto aspect-square w-full max-w-[300px] [perspective:1200px] sm:max-w-[460px] lg:max-w-[520px]"
        >
          <motion.div
            style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
            className="absolute inset-0"
          >
            <div
              aria-hidden
              className="absolute inset-[10%] rounded-full bg-[radial-gradient(circle,rgb(111_156_203/0.38),transparent_66%)] blur-2xl"
              style={{ transform: "translateZ(-110px)" }}
            />
            <div
              aria-hidden
              className="absolute inset-[4%] rounded-full border border-accent/20"
              style={{ transform: "translateZ(-70px)" }}
            />
            <div aria-hidden className="absolute inset-[15%]" style={{ transform: "translateZ(-35px)" }}>
              <div className="h-full w-full animate-[spin-slow_48s_linear_infinite] rounded-full border border-dashed border-white/15" />
            </div>

            <motion.div
              animate={{ y: [0, -14, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
              style={{ z: 70 }}
              className="absolute inset-0 grid place-items-center"
            >
              <Image
                src="/brand/fahd-mark.png"
                alt="FAHAD STUDIO"
                width={1283}
                height={1187}
                priority
                sizes="(min-width: 1024px) 420px, 70vw"
                className="h-auto w-[80%] drop-shadow-[0_30px_50px_rgb(0_0_0/0.55)]"
              />
            </motion.div>

            {chips.slice(0, 3).map((chip, i) => (
              <motion.div
                key={chip}
                aria-hidden
                animate={{ y: [0, i % 2 ? 10 : -10, 0] }}
                transition={{ duration: 5 + i, repeat: Infinity, ease: "easeInOut" }}
                style={{ z: 130 }}
                className={`glass absolute rounded-full px-4 py-2 font-display text-[13px] tracking-wider text-white/80 shadow-[0_10px_30px_-10px_rgb(0_0_0/0.7)] ${CHIP_POS[i]}`}
              >
                {chip}
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>

      <motion.a
        href="#stats"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.4, duration: 1 }}
        className="absolute bottom-7 start-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 text-xs tracking-[0.2em] text-white/35 transition-colors hover:text-white/70 rtl:translate-x-1/2 md:flex"
        aria-label={scroll}
      >
        {scroll}
        <span className="h-9 w-px bg-gradient-to-b from-accent/70 to-transparent" />
      </motion.a>
    </section>
  );
}
