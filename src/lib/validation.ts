import { z } from "zod";
import { questionsForRole } from "./staff-questions";

/**
 * Error messages are stable codes ("required", "tooShort", ...). The UI maps
 * them to translated text (see `errors` in the i18n dictionaries).
 */
const text = (min: number, max: number) =>
  z
    .string({ required_error: "required", invalid_type_error: "invalid" })
    .trim()
    .min(min, min <= 1 ? "required" : "tooShort")
    .max(max, "tooLong");

const optionalText = (max: number) =>
  z.string().trim().max(max, "tooLong").default("");

const httpUrl = z
  .string()
  .trim()
  .max(600, "tooLong")
  .refine((v) => v === "" || /^https?:\/\/[^\s]+$/i.test(v), "invalid");

const enumOf = <const U extends string>(values: readonly [U, ...U[]]) =>
  z.enum(values as [U, ...U[]], { errorMap: () => ({ message: "invalid" }) });

const discord = z
  .string({ required_error: "required" })
  .trim()
  .transform((v) => v.replace(/^@/, ""))
  .pipe(z.string().regex(/^[A-Za-z0-9_.]{2,32}$/, "discord"));

export const EXPERIENCE = ["beginner", "intermediate", "advanced", "expert"] as const;
export const SPECIALTIES = [
  "scripting",
  "building",
  "gui",
  "vehicles",
  "modeling",
  "other",
] as const;
export const SUPPORT_TOPICS = ["scripting", "building", "gui", "vehicles", "other"] as const;
export const STAFF_ROLES = ["moderator", "support", "events"] as const;
export const STAFF_EXPERIENCE = ["none", "some", "experienced"] as const;
export const PLATFORMS = [
  "discord",
  "roblox",
  "youtube",
  "x",
  "tiktok",
  "instagram",
  "github",
] as const;

/* ---------- public forms ---------- */

export const joinSchema = z.object({
  full_name: text(2, 80),
  age: z.coerce.number({ invalid_type_error: "age" }).int("age").min(10, "age").max(80, "age"),
  discord_username: discord,
  experience_level: enumOf(EXPERIENCE),
  specialty: enumOf(SPECIALTIES),
  portfolio_links: optionalText(1500),
  about: text(10, 1500),
});

export const staffSchema = z
  .object({
    full_name: text(2, 80),
    age: z.coerce.number({ invalid_type_error: "age" }).int("age").min(14, "age").max(80, "age"),
    discord_username: discord,
    role: enumOf(STAFF_ROLES),
    experience: enumOf(STAFF_EXPERIENCE),
    answers: z.record(z.string(), z.string().trim().max(1500, "tooLong")).default({}),
  })
  .superRefine((d, ctx) => {
    for (const q of questionsForRole(d.role)) {
      const a = (d.answers[q.id] ?? "").trim();
      if (!a) {
        ctx.addIssue({ code: "custom", message: "required", path: ["q_" + q.id] });
      } else if (q.type === "select") {
        if (!q.options?.some((o) => o.value === a)) {
          ctx.addIssue({ code: "custom", message: "invalid", path: ["q_" + q.id] });
        }
      } else if (q.min && a.length < q.min) {
        ctx.addIssue({ code: "custom", message: "tooShort", path: ["q_" + q.id] });
      }
    }
  })
  .transform((d) => ({
    full_name: d.full_name,
    age: d.age,
    discord_username: d.discord_username,
    role: d.role,
    experience: d.experience,
    // Stored with the (Arabic) question text so the admin sees what was asked.
    answers: questionsForRole(d.role).map((q) => {
      const a = (d.answers[q.id] ?? "").trim();
      const label = q.type === "select" ? (q.options?.find((o) => o.value === a)?.ar ?? a) : a;
      return { id: q.id, q: q.ar, a: label };
    }),
  }));

export const supportSchema = z.object({
  full_name: text(2, 80),
  discord_username: discord,
  topic: enumOf(SUPPORT_TOPICS),
  message: text(10, 1500),
});

export const contactSchema = z.object({
  name: text(2, 80),
  email: z
    .string({ required_error: "required" })
    .trim()
    .max(200, "tooLong")
    .email("email"),
  subject: text(3, 120),
  message: text(10, 2000),
});

/* ---------- admin ---------- */

export const loginSchema = z.object({
  email: z.string().trim().email().max(200),
  password: z.string().min(8).max(200),
});

export const projectSchema = z.object({
  title_ar: text(2, 120),
  title_en: text(2, 120),
  description_ar: text(2, 400),
  description_en: text(2, 400),
  details_ar: optionalText(4000),
  details_en: optionalText(4000),
  category: text(2, 60),
  status: enumOf(["current", "completed"]),
  image_url: z
    .string()
    .trim()
    .max(600, "tooLong")
    .refine((v) => v === "" || /^https?:\/\//i.test(v), "invalid")
    .default(""),
  link_url: httpUrl.default(""),
  featured: z.boolean().default(false),
  sort_order: z.coerce.number().int().min(0).max(9999).default(0),
});

export const newsSchema = z.object({
  title_ar: text(2, 140),
  title_en: text(2, 140),
  body_ar: text(2, 3000),
  body_en: text(2, 3000),
  kind: enumOf(["news", "announcement"]),
  published: z.boolean().default(true),
});

export const statSchema = z.object({
  label_ar: text(2, 60),
  label_en: text(2, 60),
  value: z.coerce.number().int().min(0).max(1_000_000_000),
  suffix: optionalText(8),
  sort_order: z.coerce.number().int().min(0).max(9999).default(0),
});

export const socialSchema = z.object({
  platform: enumOf(PLATFORMS),
  url: httpUrl.default(""),
  sort_order: z.coerce.number().int().min(0).max(9999).default(0),
});

export const partnerSchema = z.object({
  name: text(2, 80),
  logo_url: z
    .string()
    .trim()
    .max(600, "tooLong")
    .refine((v) => v === "" || /^https?:\/\//i.test(v), "invalid")
    .default(""),
  url: httpUrl.default(""),
  sort_order: z.coerce.number().int().min(0).max(9999).default(0),
});

export const applicationUpdateSchema = z.object({
  status: enumOf(["pending", "accepted", "rejected"]),
  admin_note: optionalText(2000),
});

export const supportUpdateSchema = z.object({
  status: enumOf(["new", "in_progress", "resolved"]),
});

export const messageUpdateSchema = z.object({
  is_read: z.boolean(),
});

export const SETTING_KEYS = [
  "hero_title_ar",
  "hero_title_en",
  "hero_subtitle_ar",
  "hero_subtitle_en",
] as const;

export const settingsSchema = z.object({
  values: z.record(z.string(), z.string().trim().max(600, "tooLong")).refine(
    (obj) => Object.keys(obj).every((k) => (SETTING_KEYS as readonly string[]).includes(k)),
    "invalid",
  ),
});

export function fieldErrors(error: z.ZodError): Record<string, string> {
  const out: Record<string, string> = {};
  for (const issue of error.issues) {
    const key = String(issue.path[0] ?? "form");
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}
