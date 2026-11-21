"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import type { NewsItem } from "@/lib/types";
import { Badge, Btn, Card, Field, Message, PageTitle, Select, TextArea, TextInput, api, formatDate } from "./ui";

type Draft = {
  title_ar: string;
  title_en: string;
  body_ar: string;
  body_en: string;
  kind: "news" | "announcement";
  published: boolean;
};

const EMPTY: Draft = { title_ar: "", title_en: "", body_ar: "", body_en: "", kind: "news", published: true };

export function NewsManager({ initial }: { initial: NewsItem[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => {
    setDraft((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  function open(n: NewsItem | "new") {
    setMsg(null);
    setErrors({});
    if (n === "new") {
      setDraft(EMPTY);
      setEditing("new");
    } else {
      setDraft({
        title_ar: n.title_ar,
        title_en: n.title_en,
        body_ar: n.body_ar,
        body_en: n.body_en,
        kind: n.kind,
        published: n.published,
      });
      setEditing(n.id);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res =
      editing === "new"
        ? await api<NewsItem>("POST", "/api/admin/news", draft)
        : await api<NewsItem>("PATCH", `/api/admin/news/${editing}`, draft);
    setBusy(false);
    if (res.ok && res.data) {
      const saved = res.data;
      setItems((l) => (editing === "new" ? [saved, ...l] : l.map((x) => (x.id === saved.id ? saved : x))));
      setEditing(null);
      setMsg({ kind: "ok", text: "تم الحفظ." });
      router.refresh();
    } else if (res.fields) {
      setErrors(res.fields);
      setMsg({ kind: "error", text: "تحقق من الحقول المحددة." });
    } else {
      setMsg({ kind: "error", text: "تعذر الحفظ، حاول مرة أخرى." });
    }
  }

  async function remove(n: NewsItem) {
    if (!window.confirm(`حذف «${n.title_ar}» نهائياً؟`)) return;
    const res = await api("DELETE", `/api/admin/news/${n.id}`);
    if (res.ok) {
      setItems((l) => l.filter((x) => x.id !== n.id));
      setMsg({ kind: "ok", text: "تم الحذف." });
      router.refresh();
    } else {
      setMsg({ kind: "error", text: "تعذر الحذف." });
    }
  }

  async function togglePublished(n: NewsItem) {
    const res = await api<NewsItem>("PATCH", `/api/admin/news/${n.id}`, { published: !n.published });
    if (res.ok && res.data) {
      const saved = res.data;
      setItems((l) => l.map((x) => (x.id === saved.id ? saved : x)));
      router.refresh();
    }
  }

  return (
    <>
      <PageTitle
        title="الأخبار والإعلانات"
        subtitle="المنشور منها يظهر في الصفحة الرئيسية (آخر 4)."
        action={editing === null ? <Btn onClick={() => open("new")}>+ إضافة جديد</Btn> : undefined}
      />
      {msg && (
        <div className="mb-6">
          <Message kind={msg.kind}>{msg.text}</Message>
        </div>
      )}

      {editing !== null && (
        <Card className="mb-8">
          <h2 className="mb-6 text-lg font-semibold text-white">{editing === "new" ? "إضافة جديد" : "تعديل"}</h2>
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2" noValidate>
            <Field label="العنوان (عربي)" error={errors.title_ar}>
              <TextInput value={draft.title_ar} onChange={(e) => set("title_ar", e.target.value)} aria-invalid={!!errors.title_ar} />
            </Field>
            <Field label="Title (English)" error={errors.title_en}>
              <TextInput dir="ltr" value={draft.title_en} onChange={(e) => set("title_en", e.target.value)} aria-invalid={!!errors.title_en} />
            </Field>
            <Field label="النص (عربي)" error={errors.body_ar}>
              <TextArea rows={5} value={draft.body_ar} onChange={(e) => set("body_ar", e.target.value)} aria-invalid={!!errors.body_ar} />
            </Field>
            <Field label="Body (English)" error={errors.body_en}>
              <TextArea dir="ltr" rows={5} value={draft.body_en} onChange={(e) => set("body_en", e.target.value)} aria-invalid={!!errors.body_en} />
            </Field>
            <Field label="النوع">
              <Select value={draft.kind} onChange={(e) => set("kind", e.target.value as Draft["kind"])}>
                <option value="news" className="bg-coal">خبر</option>
                <option value="announcement" className="bg-coal">إعلان</option>
              </Select>
            </Field>
            <label className="flex items-center gap-3 self-end pb-3">
              <input
                type="checkbox"
                checked={draft.published}
                onChange={(e) => set("published", e.target.checked)}
                className="h-4 w-4 accent-[#9cc0e4]"
              />
              <span className="text-sm text-white/70">منشور</span>
            </label>
            <div className="flex gap-3 sm:col-span-2">
              <Btn type="submit" disabled={busy}>
                {busy ? "جارٍ الحفظ…" : "حفظ"}
              </Btn>
              <Btn variant="ghost" onClick={() => setEditing(null)}>
                إلغاء
              </Btn>
            </div>
          </form>
        </Card>
      )}

      {items.length === 0 ? (
        <Card>
          <p className="py-10 text-center text-sm text-white/40">لا توجد أخبار أو إعلانات بعد.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {items.map((n) => (
            <Card key={n.id} className="flex flex-wrap items-center gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate font-semibold text-white">{n.title_ar}</h3>
                  <Badge tone="accent">{n.kind === "announcement" ? "إعلان" : "خبر"}</Badge>
                  <Badge tone={n.published ? "good" : "neutral"}>{n.published ? "منشور" : "مسودة"}</Badge>
                </div>
                <p className="mt-1.5 text-xs text-white/30">{formatDate(n.created_at)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Btn variant="ghost" onClick={() => togglePublished(n)}>
                  {n.published ? "إخفاء" : "نشر"}
                </Btn>
                <Btn variant="ghost" onClick={() => open(n)}>
                  تعديل
                </Btn>
                <Btn variant="danger" onClick={() => remove(n)}>
                  حذف
                </Btn>
              </div>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
