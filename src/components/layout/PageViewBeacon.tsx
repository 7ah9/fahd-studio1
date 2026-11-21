"use client";

import { useEffect } from "react";

/** Sends one anonymous visit ping per browser session (no cookies, no personal data). */
export function PageViewBeacon() {
  useEffect(() => {
    try {
      if (sessionStorage.getItem("fahd_view") === "1") return;
      sessionStorage.setItem("fahd_view", "1");
    } catch {
      return;
    }
    fetch("/api/track", { method: "POST", keepalive: true }).catch(() => {});
  }, []);
  return null;
}
