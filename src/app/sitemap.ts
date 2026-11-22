import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const PATHS = ["", "/about", "/services", "/portfolio", "/partners", "/developer-support", "/join", "/staff", "/contact"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return PATHS.map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: p === "" ? "weekly" : "monthly",
    priority: p === "" ? 1 : 0.7,
  }));
}
