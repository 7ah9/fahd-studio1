import "server-only";
import { db, isDbConfigured } from "./supabase/admin";
import type { NewsItem, Project, SocialLink, Stat } from "./types";

/** Runs a query, returning `fallback` if the database is unconfigured or fails. */
async function safe<T>(fallback: T, run: () => PromiseLike<{ data: T | null; error: unknown }>): Promise<T> {
  if (!isDbConfigured()) return fallback;
  try {
    const { data, error } = await run();
    if (error) {
      console.error("[data]", error);
      return fallback;
    }
    return data ?? fallback;
  } catch (err) {
    console.error("[data]", err);
    return fallback;
  }
}

export async function getSettings(): Promise<Record<string, string>> {
  const rows = await safe<{ key: string; value: unknown }[]>([], () =>
    db().from("site_settings").select("key,value"),
  );
  const out: Record<string, string> = {};
  for (const row of rows) {
    if (typeof row.value === "string" && row.value.trim()) out[row.key] = row.value;
  }
  return out;
}

export function getStats(): Promise<Stat[]> {
  return safe<Stat[]>([], () =>
    db().from("stats").select("*").order("sort_order", { ascending: true }),
  );
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const rows = await safe<SocialLink[]>([], () =>
    db().from("social_links").select("*").order("sort_order", { ascending: true }),
  );
  return rows.filter((r) => r.url.trim() !== "");
}

export function getProjects(opts: { featuredOnly?: boolean; limit?: number } = {}): Promise<Project[]> {
  return safe<Project[]>([], () => {
    let q = db()
      .from("projects")
      .select("*")
      .order("sort_order", { ascending: true })
      .order("created_at", { ascending: false });
    if (opts.featuredOnly) q = q.eq("featured", true);
    if (opts.limit) q = q.limit(opts.limit);
    return q;
  });
}

export function getNews(limit = 4): Promise<NewsItem[]> {
  return safe<NewsItem[]>([], () =>
    db()
      .from("news")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(limit),
  );
}
