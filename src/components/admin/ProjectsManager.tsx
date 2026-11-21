"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState, type FormEvent } from "react";
import type { Project } from "@/lib/types";
import { Badge, Btn, Card, Field, Message, PageTitle, Select, TextArea, TextInput, api } from "./ui";

type Draft = {
  title_ar: string;
  title_en: string;
  description_ar: string;
  description_en: string;
  details_ar: string;
  details_en: string;
  category: string;
  status: "current" | "completed";
  image_url: string;
  link_url: string;
  featured: boolean;
  sort_order: string;
};

const EMPTY: Draft = {
  title_ar: "",
  title_en: "",
  description_ar: "",
  description_en: "",
  details_ar: "",
  details_en: "",
  category: "",
  status: "completed",
  image_url: "",
  link_url: "",
  featured: false,
  sort_order: "0",
};

const toDraft = (p: Project): Draft => ({
  title_ar: p.title_ar,
  title_en: p.title_en,
  description_ar: p.description_ar,
  description_en: p.description_en,
  details_ar: p.details_ar,
  details_en: p.details_en,
  category: p.category,
  status: p.status,
  image_url: p.image_url ?? "",
  link_url: p.link_url ?? "",
  featured: p.featured,
  sort_order: String(p.sort_order),
});

export function ProjectsManager({ initial }: { initial: Project[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [draft, setDraft] = useState<Draft>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const set = <K extends keyof Draft>(k: K, v: Draft[K]) => {
    setDraft((d) => ({ ...d, [k]: v }));
    if (errors[k]) setErrors((e) => ({ ...e, [k]: "" }));
  };

  function open(p: Project | "new") {
    setMsg(null);
    setErrors({});
    if (p === "new") {
      setDraft(EMPTY);
      setEditing("new");
    } else {
      setDraft(toDraft(p));
      setEditing(p.id);
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  async function upload(file: File) {
    setUploading(true);
    setMsg(null);
    const body = new FormData();
    body.append("file", file);
    try {
      const res = await fetch("/api/admin/upload", { method: "POST", body });
      const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
      if (res.ok && json.url) {
        set("image_url", json.url);
      } else {
        setMsg({
          kind: "error",
          text:
            json.error === "type"
              ? "نوع الملف غير مدعوم. استخدم PNG أو JPG أو WebP أو AVIF."
              : json.error === "size"
                ? "حجم الصورة يجب ألا يتجاوز 5 ميغابايت."
                : "تعذر رفع الصورة.",
        });
      }
    } finally {
      setUploading(false);
      if (fileRef.current) fileRef.current.value = "";
    }
  }

  async function save(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const payload = { ...draft, sort_order: Number(draft.sort_order || 0) };
    const res =
      editing === "new"
        ? await api<Project>("POST", "/api/admin/projects", payload)
        : await api<Project>("PATCH", `/api/admin/projects/${editing}`, payload);
    setBusy(false);

    if (res.ok && res.data) {
      const saved = res.data;
      setItems((list) =>
        editing === "new" ? [saved, ...list] : list.map((p) => (p.id === saved.id ? saved : p)),
      );
      setEditing(null);
      setMsg({ kind: "ok", text: "تم حفظ المشروع." });
      router.refresh();
    } else if (res.fields) {
      setErrors(res.fields);
      setMsg({ kind: "error", text: "تحقق من الحقول المحددة." });
    } else {
      setMsg({ kind: "error", text: "تعذر الحفظ، حاول مرة أخرى." });
    }
  }

  async function remove(p: Project) {
    if (!window.confirm(`حذف المشروع «${p.title_ar}» نهائياً؟`)) return;
    const res = await api("DELETE", `/api/admin/projects/${p.id}`);
    if (res.ok) {
      setItems((list) => list.filter((x) => x.id !== p.id));
      setMsg({ kind: "ok", text: "تم حذف المشروع." });
      router.refresh();
    } else {
      setMsg({ kind: "error", text: "تعذر الحذف." });
    }
  }

  async function toggleFeatured(p: Project) {
    const res = await api<Project>("PATCH", `/api/admin/projects/${p.id}`, { featured: !p.featured });
    if (res.ok && res.data) {
      const saved = res.data;
      setItems((list) => list.map((x) => (x.id === saved.id ? saved : x)));
    }
  }

  return (
    <>
      <PageTitle
        title="المشاريع"
        subtitle="أضف أعمال الاستديو وعدّلها. المشاريع المميّزة تظهر في الصفحة الرئيسية."
        action={editing === null ? <Btn onClick={() => open("new")}>+ مشروع جديد</Btn> : undefined}
      />

      {msg && (
        <div className="mb-6">
          <Message kind={msg.kind}>{msg.text}</Message>
        </div>
      )}

      {editing !== null && (
        <Card className="mb-8">
          <h2 className="mb-6 text-lg font-semibold text-white">
            {editing === "new" ? "مشروع جديد" : "تعديل المشروع"}
          </h2>
          <form onSubmit={save} className="grid gap-4 sm:grid-cols-2" noValidate>
            <Field label="العنوان (عربي)" error={errors.title_ar}>
              <TextInput value={draft.title_ar} onChange={(e) => set("title_ar", e.target.value)} aria-invalid={!!errors.title_ar} />
            </Field>
            <Field label="العنوان (English)" error={errors.title_en}>
              <TextInput dir="ltr" value={draft.title_en} onChange={(e) => set("title_en", e.target.value)} aria-invalid={!!errors.title_en} />
            </Field>
            <Field label="وصف مختصر (عربي)" error={errors.description_ar}>
              <TextArea rows={3} value={draft.description_ar} onChange={(e) => set("description_ar", e.target.value)} aria-invalid={!!errors.description_ar} />
            </Field>
            <Field label="Short description (English)" error={errors.description_en}>
              <TextArea dir="ltr" rows={3} value={draft.description_en} onChange={(e) => set("description_en", e.target.value)} aria-invalid={!!errors.description_en} />
            </Field>
            <Field label="تفاصيل المشروع (عربي)" hint="اختياري — تظهر في نافذة التفاصيل" error={errors.details_ar}>
              <TextArea rows={4} value={draft.details_ar} onChange={(e) => set("details_ar", e.target.value)} />
            </Field>
            <Field label="Project details (English)" hint="Optional" error={errors.details_en}>
              <TextArea dir="ltr" rows={4} value={draft.details_en} onChange={(e) => set("details_en", e.target.value)} />
            </Field>
            <Field label="التصنيف" hint="مثال: خريطة، نظام، واجهة" error={errors.category}>
              <TextInput value={draft.category} onChange={(e) => set("category", e.target.value)} aria-invalid={!!errors.category} />
            </Field>
            <Field label="الحالة">
              <Select value={draft.status} onChange={(e) => set("status", e.target.value as Draft["status"])}>
                <option value="completed" className="bg-coal">مكتمل</option>
                <option value="current" className="bg-coal">قيد التطوير</option>
              </Select>
            </Field>
            <Field label="رابط المشروع" hint="اختياري — رابط اللعبة على Roblox مثلاً" error={errors.link_url}>
              <TextInput dir="ltr" type="url" placeholder="https://" value={draft.link_url} onChange={(e) => set("link_url", e.target.value)} aria-invalid={!!errors.link_url} />
            </Field>
            <Field label="ترتيب العرض" hint="الأصغر يظهر أولاً">
              <TextInput dir="ltr" type="number" min={0} max={9999} value={draft.sort_order} onChange={(e) => set("sort_order", e.target.value)} />
            </Field>

            <div className="sm:col-span-2">
              <span className="mb-1.5 block text-[13px] font-medium text-white/65">صورة المشروع</span>
              <div className="flex flex-wrap items-center gap-4">
                {draft.image_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={draft.image_url} alt="" className="h-24 w-40 rounded-xl border border-white/10 object-cover" />
                ) : (
                  <div className="grid h-24 w-40 place-items-center rounded-xl border border-dashed border-white/15 text-xs text-white/30">
                    لا توجد صورة
                  </div>
                )}
                <div className="flex flex-wrap gap-2">
                  <Btn variant="ghost" onClick={() => fileRef.current?.click()} disabled={uploading}>
                    {uploading ? "جارٍ الرفع…" : "رفع صورة"}
                  </Btn>
                  {draft.image_url && (
                    <Btn variant="danger" onClick={() => set("image_url", "")}>
                      إزالة
                    </Btn>
                  )}
                </div>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp,image/avif"
                  className="hidden"
                  onChange={(e) => e.target.files?.[0] && upload(e.target.files[0])}
                />
              </div>
              <p className="mt-2 text-xs text-white/30">PNG أو JPG أو WebP أو AVIF — حتى 5 ميغابايت. يفضل نسبة 16:10.</p>
              {errors.image_url && <p className="mt-1 text-xs text-rose-300">رابط الصورة غير صالح.</p>}
            </div>

            <label className="flex items-center gap-3 sm:col-span-2">
              <input
                type="checkbox"
                checked={draft.featured}
                onChange={(e) => set("featured", e.target.checked)}
                className="h-4 w-4 accent-[#9cc0e4]"
              />
              <span className="text-sm text-white/70">مشروع مميّز (يظهر في الصفحة الرئيسية)</span>
            </label>

            <div className="flex gap-3 sm:col-span-2">
              <Btn type="submit" disabled={busy || uploading}>
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
          <p className="py-10 text-center text-sm text-white/40">لا توجد مشاريع بعد. أضف أول مشروع.</p>
        </Card>
      ) : (
        <div className="grid gap-4">
          {items.map((p) => (
            <Card key={p.id} className="flex flex-wrap items-center gap-5">
              <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl border border-white/10 bg-graphite">
                {p.image_url ? (
                  <Image src={p.image_url} alt="" fill sizes="128px" unoptimized className="object-cover" />
                ) : (
                  <div className="grid h-full place-items-center text-[10px] text-white/25">بدون صورة</div>
                )}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h3 className="truncate font-semibold text-white">{p.title_ar}</h3>
                  <Badge tone="accent">{p.category}</Badge>
                  <Badge>{p.status === "current" ? "قيد التطوير" : "مكتمل"}</Badge>
                  {p.featured && <Badge tone="good">مميّز</Badge>}
                </div>
                <p className="mt-1.5 line-clamp-1 text-sm text-white/45" dir="ltr">
                  {p.title_en}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <Btn variant="ghost" onClick={() => toggleFeatured(p)}>
                  {p.featured ? "إلغاء التمييز" : "تمييز"}
                </Btn>
                <Btn variant="ghost" onClick={() => open(p)}>
                  تعديل
                </Btn>
                <Btn variant="danger" onClick={() => remove(p)}>
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
