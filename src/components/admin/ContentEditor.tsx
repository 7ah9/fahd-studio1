"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import type { SocialLink, Stat } from "@/lib/types";
import { Btn, Card, Field, Message, PageTitle, Select, TextArea, TextInput, api } from "./ui";

type Notice = { kind: "ok" | "error"; text: string } | null;

const PLATFORMS: { value: string; label: string }[] = [
  { value: "discord", label: "Discord" },
  { value: "roblox", label: "Roblox" },
  { value: "youtube", label: "YouTube" },
  { value: "x", label: "X" },
  { value: "tiktok", label: "TikTok" },
  { value: "instagram", label: "Instagram" },
  { value: "github", label: "GitHub" },
];

/* ───────────────────────── Hero texts ───────────────────────── */

type HeroKeys = "hero_title_ar" | "hero_title_en" | "hero_subtitle_ar" | "hero_subtitle_en";

function HeroTexts({
  settings,
  defaults,
}: {
  settings: Record<string, string>;
  defaults: Record<HeroKeys, string>;
}) {
  const router = useRouter();
  const [v, setV] = useState<Record<HeroKeys, string>>({
    hero_title_ar: settings.hero_title_ar ?? "",
    hero_title_en: settings.hero_title_en ?? "",
    hero_subtitle_ar: settings.hero_subtitle_ar ?? "",
    hero_subtitle_en: settings.hero_subtitle_en ?? "",
  });
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);

  async function save() {
    setBusy(true);
    setNotice(null);
    const res = await api("PUT", "/api/admin/settings", { values: v });
    setBusy(false);
    if (res.ok) {
      setNotice({ kind: "ok", text: "تم حفظ نصوص الواجهة الرئيسية." });
      router.refresh();
    } else {
      setNotice({ kind: "error", text: "تعذر الحفظ. تأكد من أن النصوص لا تتجاوز 600 حرف." });
    }
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold text-white">نصوص الواجهة الرئيسية</h2>
      <p className="mt-1 text-sm text-white/40">اترك الحقل فارغاً لاستخدام النص الافتراضي المعروض أسفله.</p>
      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Field label="العنوان الرئيسي (عربي)">
          <TextInput value={v.hero_title_ar} placeholder={defaults.hero_title_ar} onChange={(e) => setV({ ...v, hero_title_ar: e.target.value })} />
        </Field>
        <Field label="Main headline (English)">
          <TextInput dir="ltr" value={v.hero_title_en} placeholder={defaults.hero_title_en} onChange={(e) => setV({ ...v, hero_title_en: e.target.value })} />
        </Field>
        <Field label="الوصف (عربي)">
          <TextArea rows={4} value={v.hero_subtitle_ar} placeholder={defaults.hero_subtitle_ar} onChange={(e) => setV({ ...v, hero_subtitle_ar: e.target.value })} />
        </Field>
        <Field label="Description (English)">
          <TextArea dir="ltr" rows={4} value={v.hero_subtitle_en} placeholder={defaults.hero_subtitle_en} onChange={(e) => setV({ ...v, hero_subtitle_en: e.target.value })} />
        </Field>
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-4">
        <Btn onClick={save} disabled={busy}>
          {busy ? "جارٍ الحفظ…" : "حفظ النصوص"}
        </Btn>
        {notice && <Message kind={notice.kind}>{notice.text}</Message>}
      </div>
    </Card>
  );
}

/* ───────────────────────── Stats ───────────────────────── */

type StatRow = { id: string; label_ar: string; label_en: string; value: string; suffix: string; sort_order: number };

const toStatRow = (s: Stat): StatRow => ({ ...s, value: String(s.value) });

function StatsEditor({ initial }: { initial: Stat[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<StatRow[]>(initial.map(toStatRow));
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);

  const edit = (id: string, patch: Partial<StatRow>) =>
    setRows((l) => l.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  async function saveRow(r: StatRow) {
    setBusyId(r.id);
    setNotice(null);
    const res = await api<Stat>("PATCH", `/api/admin/stats/${r.id}`, {
      label_ar: r.label_ar,
      label_en: r.label_en,
      value: Number(r.value || 0),
      suffix: r.suffix,
      sort_order: r.sort_order,
    });
    setBusyId(null);
    if (res.ok && res.data) {
      edit(r.id, toStatRow(res.data));
      setNotice({ kind: "ok", text: "تم حفظ الإحصائية." });
      router.refresh();
    } else {
      setNotice({ kind: "error", text: "تعذر الحفظ. تأكد من التسميات (حرفان على الأقل) والرقم." });
    }
  }

  async function addRow() {
    setNotice(null);
    const res = await api<Stat>("POST", "/api/admin/stats", {
      label_ar: "إحصائية جديدة",
      label_en: "New stat",
      value: 0,
      suffix: "",
      sort_order: rows.length + 1,
    });
    if (res.ok && res.data) {
      const created = res.data;
      setRows((l) => [...l, toStatRow(created)]);
      router.refresh();
    } else {
      setNotice({ kind: "error", text: "تعذر إضافة الإحصائية." });
    }
  }

  async function removeRow(r: StatRow) {
    if (!window.confirm("حذف هذه الإحصائية؟")) return;
    const res = await api("DELETE", `/api/admin/stats/${r.id}`);
    if (res.ok) {
      setRows((l) => l.filter((x) => x.id !== r.id));
      router.refresh();
    } else {
      setNotice({ kind: "error", text: "تعذر الحذف." });
    }
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold text-white">إحصائيات الاستديو</h2>
      <p className="mt-1 text-sm text-white/40">
        تظهر في الصفحة الرئيسية. الإحصائيات ذات القيمة 0 لا تُعرض، وإذا كانت كلها 0 يختفي القسم.
      </p>
      <div className="mt-6 space-y-4">
        {rows.map((r) => (
          <div key={r.id} className="grid gap-3 rounded-2xl border border-white/[0.07] p-4 sm:grid-cols-[1fr_1fr_110px_90px_auto]">
            <Field label="التسمية (عربي)">
              <TextInput value={r.label_ar} onChange={(e) => edit(r.id, { label_ar: e.target.value })} />
            </Field>
            <Field label="Label (English)">
              <TextInput dir="ltr" value={r.label_en} onChange={(e) => edit(r.id, { label_en: e.target.value })} />
            </Field>
            <Field label="الرقم">
              <TextInput dir="ltr" type="number" min={0} value={r.value} onChange={(e) => edit(r.id, { value: e.target.value })} />
            </Field>
            <Field label="لاحقة">
              <TextInput dir="ltr" maxLength={8} placeholder="+" value={r.suffix} onChange={(e) => edit(r.id, { suffix: e.target.value })} />
            </Field>
            <div className="flex items-end gap-2">
              <Btn onClick={() => saveRow(r)} disabled={busyId === r.id}>
                حفظ
              </Btn>
              <Btn variant="danger" onClick={() => removeRow(r)}>
                حذف
              </Btn>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <Btn variant="ghost" onClick={addRow}>
          + إضافة إحصائية
        </Btn>
        {notice && <Message kind={notice.kind}>{notice.text}</Message>}
      </div>
    </Card>
  );
}

/* ───────────────────────── Social links ───────────────────────── */

function SocialEditor({ initial }: { initial: SocialLink[] }) {
  const router = useRouter();
  const [rows, setRows] = useState<SocialLink[]>(initial);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [notice, setNotice] = useState<Notice>(null);

  const edit = (id: string, patch: Partial<SocialLink>) =>
    setRows((l) => l.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  async function saveRow(r: SocialLink) {
    setBusyId(r.id);
    setNotice(null);
    const res = await api<SocialLink>("PATCH", `/api/admin/social/${r.id}`, {
      platform: r.platform,
      url: r.url,
      sort_order: r.sort_order,
    });
    setBusyId(null);
    if (res.ok && res.data) {
      edit(r.id, res.data);
      setNotice({ kind: "ok", text: "تم حفظ الرابط." });
      router.refresh();
    } else {
      setNotice({ kind: "error", text: "الرابط غير صالح. يجب أن يبدأ بـ https://" });
    }
  }

  async function addRow() {
    setNotice(null);
    const res = await api<SocialLink>("POST", "/api/admin/social", {
      platform: "discord",
      url: "",
      sort_order: rows.length + 1,
    });
    if (res.ok && res.data) {
      const created = res.data;
      setRows((l) => [...l, created]);
    } else {
      setNotice({ kind: "error", text: "تعذر إضافة الرابط." });
    }
  }

  async function removeRow(r: SocialLink) {
    if (!window.confirm("حذف هذا الرابط؟")) return;
    const res = await api("DELETE", `/api/admin/social/${r.id}`);
    if (res.ok) {
      setRows((l) => l.filter((x) => x.id !== r.id));
      router.refresh();
    } else {
      setNotice({ kind: "error", text: "تعذر الحذف." });
    }
  }

  return (
    <Card>
      <h2 className="text-lg font-semibold text-white">روابط التواصل</h2>
      <p className="mt-1 text-sm text-white/40">
        تظهر في صفحة التواصل والتذييل. الروابط الفارغة لا تُعرض. ضع رابط دعوة Discord هنا.
      </p>
      <div className="mt-6 space-y-4">
        {rows.map((r) => (
          <div key={r.id} className="grid gap-3 rounded-2xl border border-white/[0.07] p-4 sm:grid-cols-[160px_1fr_auto]">
            <Field label="المنصة">
              <Select value={r.platform} onChange={(e) => edit(r.id, { platform: e.target.value })}>
                {PLATFORMS.map((p) => (
                  <option key={p.value} value={p.value} className="bg-coal">
                    {p.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="الرابط">
              <TextInput dir="ltr" type="url" placeholder="https://" value={r.url} onChange={(e) => edit(r.id, { url: e.target.value })} />
            </Field>
            <div className="flex items-end gap-2">
              <Btn onClick={() => saveRow(r)} disabled={busyId === r.id}>
                حفظ
              </Btn>
              <Btn variant="danger" onClick={() => removeRow(r)}>
                حذف
              </Btn>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-4">
        <Btn variant="ghost" onClick={addRow}>
          + إضافة رابط
        </Btn>
        {notice && <Message kind={notice.kind}>{notice.text}</Message>}
      </div>
    </Card>
  );
}

/* ───────────────────────── Page ───────────────────────── */

export function ContentEditor(props: {
  settings: Record<string, string>;
  defaults: Record<HeroKeys, string>;
  stats: Stat[];
  socials: SocialLink[];
}) {
  return (
    <>
      <PageTitle title="محتوى الموقع" subtitle="عدّل نصوص الواجهة الرئيسية والإحصائيات وروابط التواصل." />
      <div className="space-y-6">
        <HeroTexts settings={props.settings} defaults={props.defaults} />
        <StatsEditor initial={props.stats} />
        <SocialEditor initial={props.socials} />
      </div>
    </>
  );
}
