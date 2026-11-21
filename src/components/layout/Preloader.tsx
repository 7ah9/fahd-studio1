"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

/** Loading screen using the official mark and tagline. Shown once per browser session. */
export function Preloader() {
  const [show, setShow] = useState(true);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem("fahd_loaded") === "1";
    } catch {
      /* storage unavailable */
    }
    if (seen) {
      setShow(false);
      return;
    }
    const id = window.setTimeout(() => {
      try {
        sessionStorage.setItem("fahd_loaded", "1");
      } catch {
        /* ignore */
      }
      setShow(false);
    }, 1700);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="preloader"
          id="preloader"
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ink"
          exit={{ opacity: 0, scale: 1.02 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        >
          <div
            aria-hidden
            className="absolute h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,rgb(111_156_203/0.25),transparent_65%)] blur-2xl"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.88, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            <Image
              src="/brand/fahd-mark.png"
              alt="FAHD STUDIO"
              width={1283}
              height={1187}
              priority
              className="h-40 w-auto sm:h-52"
            />
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.9 }}
            className="relative mt-6"
          >
            <Image
              src="/brand/fahd-tagline.png"
              alt=""
              width={906}
              height={173}
              priority
              className="h-10 w-auto opacity-90 sm:h-12"
            />
          </motion.div>
          <div className="relative mt-10 h-px w-40 overflow-hidden bg-white/10">
            <motion.span
              className="absolute inset-y-0 start-0 w-full origin-left bg-accent rtl:origin-right"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </div>
          <noscript>
            <style>{"#preloader{display:none!important}"}</style>
          </noscript>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
