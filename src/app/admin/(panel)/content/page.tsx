import { ContentEditor } from "@/components/admin/ContentEditor";
import { assertAdmin } from "@/lib/auth";
import { db } from "@/lib/supabase/admin";
import { dictionaries } from "@/lib/i18n";
import type { SocialLink, Stat } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function AdminContentPage() {
  await assertAdmin();
  const [settingsRes, statsRes, socialRes] = await Promise.all([
    db().from("site_settings").select("key,value"),
    db().from("stats").select("*").order("sort_order", { ascending: true }),
    db().from("social_links").select("*").order("sort_order", { ascending: true }),
  ]);

  const settings: Record<string, string> = {};
  for (const row of (settingsRes.data ?? []) as { key: string; value: unknown }[]) {
    if (typeof row.value === "string") settings[row.key] = row.value;
  }

  return (
    <ContentEditor
      settings={settings}
      defaults={{
        hero_title_ar: dictionaries.ar.hero.title,
        hero_title_en: dictionaries.en.hero.title,
        hero_subtitle_ar: dictionaries.ar.hero.subtitle,
        hero_subtitle_en: dictionaries.en.hero.subtitle,
      }}
      stats={(statsRes.data ?? []) as Stat[]}
      socials={(socialRes.data ?? []) as SocialLink[]}
    />
  );
}
