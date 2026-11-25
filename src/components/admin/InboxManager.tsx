"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Badge, Btn, Card, Message, PageTitle, TextArea, api, formatDate } from "./ui";

export type InboxRow = { id: string; created_at: string } & Record<string, unknown>;

export type InboxConfig = {
  resource: "applications" | "staff" | "support" | "messages";
  title: string;
  subtitle: string;
  empty: string;
  /** Row key shown as the list title / subtitle. */
  titleKey: string;
  subKey: string;
  details: { key: string; label: string; map?: Record<string, string>; ltr?: boolean; long?: boolean; hideEmpty?: boolean }[];
  /** Row key holding an array of { q, a } question/answer pairs. */
  qaKey?: string;
  /** Status select (applications, support). */
  status?: {
    key: string;
    options: { value: string; label: string; tone: "neutral" | "accent" | "good" | "bad" }[];
  };
  /** Boolean read flag (messages). */
  readKey?: string;
  /** Free-text admin note (applications). */
  noteKey?: string;
  /** Show a mailto reply button using this row key as the address. */
  emailKey?: string;
};

export function InboxManager({ config, initial }: { config: InboxConfig; initial: InboxRow[] }) {
  const router = useRouter();
  const [items, setItems] = useState(initial);
  const [selectedId, setSelectedId] = useState<string | null>(initial[0]?.id ?? null);
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<{ kind: "ok" | "error"; text: string } | null>(null);
  const [busy, setBusy] = useState(false);

  const selected = items.find((r) => r.id === selectedId) ?? null;
  const url = (id: string) => `/api/admin/${config.resource}/${id}`;

  const replace = (row: InboxRow) => setItems((l) => l.map((r) => (r.id === row.id ? row : r)));

  async function patch(id: string, body: Record<string, unknown>, okText?: string) {
    setBusy(true);
    const res = await api<InboxRow>("PATCH", url(id), body);
    setBusy(false);
    if (res.ok && res.data) {
      replace(res.data);
      setMsg(okText ? { kind: "ok", text: okText } : null);
      router.refresh();
      return true;
    }
    setMsg({ kind: "error", text: "تعذر تنفيذ العملية." });
    return false;
  }

  function select(row: InboxRow) {
    setSelectedId(row.id);
    setMsg(null);
    setNote(config.noteKey ? String(row[config.noteKey] ?? "") : "");
    // Opening a message marks it as read.
    if (config.readKey && row[config.readKey] === false) {
      void patch(row.id, { [config.readKey]: true });
    }
  }

  async function remove(row: InboxRow) {
    if (!window.confirm("حذف هذا السجل نهائياً؟")) return;
    const res = await api("DELETE", url(row.id));
    if (res.ok) {
      const rest = items.filter((r) => r.id !== row.id);
      setItems(rest);
      setSelectedId(rest[0]?.id ?? null);
      setMsg({ kind: "ok", text: "تم الحذف." });
      router.refresh();
    } else {
      setMsg({ kind: "error", text: "تعذر الحذف." });
    }
  }

  const statusOf = (row: InboxRow) =>
    config.status ? config.status.options.find((o) => o.value === row[config.status!.key]) : undefined;
  const isUnread = (row: InboxRow) => (config.readKey ? row[config.readKey] === false : false);

  return (
    <>
      <PageTitle title={config.title} subtitle={config.subtitle} />
      {msg && (
        <div className="mb-6">
          <Message kind={msg.kind}>{msg.text}</Message>
        </div>
      )}

      {items.length === 0 ? (
        <Card>
          <p className="py-12 text-center text-sm text-white/40">{config.empty}</p>
        </Card>
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(280px,380px)_1fr]">
          <div className="max-h-[70vh] space-y-2 overflow-y-auto pe-1">
            {items.map((row) => {
              const st = statusOf(row);
              const active = row.id === selectedId;
              return (
                <button
                  key={row.id}
                  type="button"
                  onClick={() => select(row)}
                  className={`block w-full rounded-2xl border p-4 text-start transition-colors ${
                    active
                      ? "border-accent/40 bg-white/[0.06]"
                      : "border-white/[0.07] bg-coal/60 hover:border-white/20"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex items-center gap-2 truncate font-medium text-white">
                      {isUnread(row) && <span className="h-2 w-2 shrink-0 rounded-full bg-accent" aria-label="غير مقروءة" />}
                      <span className="truncate">{String(row[config.titleKey] ?? "")}</span>
                    </span>
                    {st && <Badge tone={st.tone}>{st.label}</Badge>}
                  </div>
                  <div className="mt-1.5 truncate text-sm text-white/45">{String(row[config.subKey] ?? "")}</div>
                  <div className="mt-1.5 text-xs text-white/25">{formatDate(row.created_at)}</div>
                </button>
              );
            })}
          </div>

          {selected ? (
            <Card className="h-fit">
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">{String(selected[config.titleKey] ?? "")}</h2>
                  <p className="mt-1 text-xs text-white/35">{formatDate(selected.created_at)}</p>
                </div>
                <Btn variant="danger" onClick={() => remove(selected)}>
                  حذف
                </Btn>
              </div>

              <dl className="mt-6 grid gap-5 sm:grid-cols-2">
                {config.details.map((d) => {
                  const raw = selected[d.key];
                  if (d.hideEmpty && !String(raw ?? "").trim()) return null;
                  const text = d.map ? (d.map[String(raw)] ?? String(raw ?? "")) : String(raw ?? "");
                  return (
                    <div key={d.key} className={d.long ? "sm:col-span-2" : ""}>
                      <dt className="text-xs text-white/40">{d.label}</dt>
                      <dd
                        dir={d.ltr ? "ltr" : undefined}
                        className={`mt-1.5 whitespace-pre-wrap break-words text-[15px] leading-7 text-white/85 ${
                          d.ltr ? "text-end" : ""
                        }`}
                      >
                        {text || "—"}
                      </dd>
                    </div>
                  );
                })}
              </dl>

              {config.qaKey && Array.isArray(selected[config.qaKey]) && (selected[config.qaKey] as unknown[]).length > 0 && (
                <div className="mt-8 space-y-4">
                  <div className="text-xs text-white/40">الأسئلة والإجابات</div>
                  {(selected[config.qaKey] as { q: string; a: string }[]).map((qa, i) => (
                    <div key={i} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
                      <div className="text-[13px] leading-6 text-accent/90">{qa.q}</div>
                      <div className="mt-2 whitespace-pre-wrap break-words text-[15px] leading-7 text-white/85">
                        {qa.a || "—"}
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {config.status && (
                <div className="mt-8">
                  <div className="mb-2 text-xs text-white/40">تغيير الحالة</div>
                  <div className="flex flex-wrap gap-2">
                    {config.status.options.map((o) => {
                      const current = selected[config.status!.key] === o.value;
                      return (
                        <Btn
                          key={o.value}
                          variant={current ? "primary" : "ghost"}
                          disabled={busy || current}
                          onClick={() => patch(selected.id, { [config.status!.key]: o.value }, `الحالة: ${o.label}`)}
                        >
                          {o.label}
                        </Btn>
                      );
                    })}
                  </div>
                </div>
              )}

              {config.noteKey && (
                <div className="mt-8">
                  <label className="mb-2 block text-xs text-white/40" htmlFor="admin-note">
                    ملاحظة داخلية (لا تظهر للمتقدم)
                  </label>
                  <TextArea id="admin-note" rows={3} value={note} onChange={(e) => setNote(e.target.value)} />
                  <div className="mt-3">
                    <Btn
                      variant="ghost"
                      disabled={busy}
                      onClick={() => patch(selected.id, { [config.noteKey!]: note }, "تم حفظ الملاحظة.")}
                    >
                      حفظ الملاحظة
                    </Btn>
                  </div>
                </div>
              )}

              {config.readKey && (
                <div className="mt-8 flex flex-wrap gap-2">
                  {config.emailKey && (
                    <a
                      href={`mailto:${encodeURIComponent(String(selected[config.emailKey] ?? ""))}?subject=${encodeURIComponent(
                        "Re: " + String(selected["subject"] ?? ""),
                      )}`}
                      className="inline-flex items-center rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-ink transition-colors hover:bg-white"
                    >
                      الرد بالبريد
                    </a>
                  )}
                  <Btn
                    variant="ghost"
                    disabled={busy}
                    onClick={() =>
                      patch(selected.id, { [config.readKey!]: !selected[config.readKey!] })
                    }
                  >
                    {selected[config.readKey] ? "تحديد كغير مقروءة" : "تحديد كمقروءة"}
                  </Btn>
                </div>
              )}
            </Card>
          ) : null}
        </div>
      )}
    </>
  );
}
