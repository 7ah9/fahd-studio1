import "server-only";
import { unstable_cache } from "next/cache";
import { db, isDbConfigured } from "./supabase/admin";
import type { NewsItem, Partner, Project, SocialLink, Stat } from "./types";

const TTL_SECONDS = 30;

/**
 * Runs a read query with a short server-side cache (so most visits don't hit
 * the database), returning `fallback` if the database is unconfigured or fails.
 * Failures are never cached. Admin edits show up on the site within ~30s.
 */
async function safe<T>(
  key: string,
  fallback: T,
  run: () => PromiseLike<{ data: T | null; error: unknown }>,
): Promise<T> {
  if (!isDbConfigured()) return fallback;
  const cached = unstable_cache(
    async () => {
      const { data, error } = await run();
      if (error) throw error;
      return data ?? fallback;
    },
    ["site-data", key],
    { revalidate: TTL_SECONDS },
  );
  try {
    return await cached();
  } catch (err) {
    console.error("[data]", err);
    return fallback;
  }
}

export async function getSettings(): Promise<Record<string, string>> {
  const rows = await safe<{ key: string; value: unknown }[]>("settings", [], () =>
    db().from("site_settings").select("key,value"),
  );
  const out: Record<string, string> = {};
  for (const row of rows) {
    if (typeof row.value === "string" && row.value.trim()) out[row.key] = row.value;
  }
  return out;
}

export function getStats(): Promise<Stat[]> {
  return safe<Stat[]>("stats", [], () =>
    db().from("stats").select("*").order("sort_order", { ascending: true }),
  );
}

export async function getSocialLinks(): Promise<SocialLink[]> {
  const rows = await safe<SocialLink[]>("social", [], () =>
    db().from("social_links").select("*").order("sort_order", { ascending: true }),
  );
  return rows.filter((r) => r.url.trim() !== "");
}

export function getProjects(opts: { featuredOnly?: boolean; limit?: number } = {}): Promise<Project[]> {
  return safe<Project[]>(`projects:${JSON.stringify(opts)}`, [], () => {
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
  return safe<NewsItem[]>(`news:${limit}`, [], () =>
    db()
      .from("news")
      .select("*")
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(limit),
  );
}

export function getPartners(): Promise<Partner[]> {
  return safe<Partner[]>("partners", [], () =>
    db().from("partners").select("*").order("sort_order", { ascending: true }),
  );
}
