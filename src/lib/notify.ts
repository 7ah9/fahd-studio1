import "server-only";

/**
 * Sends a short summary of a new form submission to a Discord channel through
 * an incoming webhook (env DISCORD_WEBHOOK_URL). It never throws and never
 * pings @everyone/@here: failures are logged and the form still succeeds.
 */

const LABELS: Record<string, string> = {
  full_name: "الاسم",
  name: "الاسم",
  age: "العمر",
  discord_username: "Discord",
  experience_level: "مستوى الخبرة",
  specialty: "التخصص",
  portfolio_links: "نماذج الأعمال",
  about: "نبذة",
  topic: "مجال الدعم",
  message: "الرسالة",
  email: "البريد",
  subject: "الموضوع",
  role: "الدور المطلوب",
  experience: "الخبرة السابقة",
  availability: "أوقات التواجد",
  motivation: "سبب التقديم",
  scenario: "إجابة السيناريو",
};

const ROLE_NAMES: Record<string, string> = {
  moderator: "أدمن (Admin)",
  support: "دعم الأعضاء",
  events: "تنظيم الفعاليات",
};

const WEBHOOK_RE = /^https:\/\/(?:(?:ptb|canary)\.)?discord(?:app)?\.com\/api\/webhooks\/\d+\/[\w-]+$/;

const clip = (v: string, max: number) => (v.length > max ? `${v.slice(0, max - 1)}…` : v);

export async function notifyDiscord(opts: {
  title: string;
  color: number;
  data: Record<string, unknown>;
  adminPath: string;
}) {
  const url = process.env.DISCORD_WEBHOOK_URL?.trim();
  if (!url) return;
  if (!WEBHOOK_RE.test(url)) {
    console.error("[notify] DISCORD_WEBHOOK_URL is not a valid Discord webhook URL");
    return;
  }

  const fields = Object.entries(opts.data)
    .filter(([key, value]) => key in LABELS && value !== "" && value != null)
    .slice(0, 20)
    .map(([key, value]) => ({
      name: LABELS[key],
      value: clip(key === "role" ? (ROLE_NAMES[String(value)] ?? String(value)) : String(value), 900) || "-",
      inline: String(value).length < 40,
    }));

  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  const link = site && !site.includes("example.com") ? `${site}${opts.adminPath}` : null;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(4000),
      body: JSON.stringify({
        username: "FAHAD STUDIO",
        allowed_mentions: { parse: [] },
        embeds: [
          {
            title: opts.title,
            color: opts.color,
            fields,
            description: link ? `[فتح لوحة الإدارة](${link})` : undefined,
            timestamp: new Date().toISOString(),
          },
        ],
      }),
    });
    if (!res.ok) console.error("[notify] Discord responded", res.status);
  } catch (err) {
    console.error("[notify] failed", err);
  }
}
