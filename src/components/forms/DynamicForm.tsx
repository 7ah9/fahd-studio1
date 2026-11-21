"use client";

import { useState, type FormEvent } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useI18n } from "@/lib/i18n/client";
import { SubmitButton } from "@/components/ui/Button";
import { IconCheck } from "@/components/ui/Icons";

export type FormField = {
  name: string;
  label: string;
  type: "text" | "email" | "number" | "textarea" | "select";
  options?: { value: string; label: string }[];
  hint?: string;
  optional?: boolean;
  ltr?: boolean;
  half?: boolean;
  min?: number;
  max?: number;
  maxLength?: number;
  autoComplete?: string;
};

type Props = {
  endpoint: string;
  fields: FormField[];
  submitLabel: string;
  success: { title: string; text: string };
  note?: string;
};

const control =
  "w-full rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-[15px] text-white placeholder:text-white/25 outline-none transition-all duration-300 focus:border-accent/60 focus:bg-white/[0.06] focus:shadow-[0_0_0_4px_rgb(156_192_228/0.12)] aria-[invalid=true]:border-rose-400/60";

export function DynamicForm({ endpoint, fields, submitLabel, success, note }: Props) {
  const { t } = useI18n();
  const [values, setValues] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [honeypot, setHoneypot] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "success" | "error" | "rate">("idle");

  const errorText = (code: string) =>
    (t.errors as Record<string, string>)[code] ?? t.errors.invalid;

  function set(name: string, v: string) {
    setValues((s) => ({ ...s, [name]: v }));
    if (errors[name]) setErrors((s) => ({ ...s, [name]: "" }));
  }

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (state === "loading") return;

    const clientErrors: Record<string, string> = {};
    for (const f of fields) {
      if (!f.optional && !(values[f.name] ?? "").trim()) clientErrors[f.name] = "required";
    }
    if (Object.keys(clientErrors).length) {
      setErrors(clientErrors);
      return;
    }

    setState("loading");
    const payload: Record<string, unknown> = { website: honeypot };
    for (const f of fields) {
      const v = (values[f.name] ?? "").trim();
      payload[f.name] = f.type === "number" ? (v === "" ? "" : Number(v)) : v;
    }

    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        setState("success");
        return;
      }
      if (res.status === 400) {
        const json = (await res.json().catch(() => null)) as {
          fields?: Record<string, string>;
        } | null;
        if (json?.fields) {
          setErrors(json.fields);
          setState("idle");
          return;
        }
      }
      setState(res.status === 429 ? "rate" : "error");
    } catch {
      setState("error");
    }
  }

  return (
    <AnimatePresence mode="wait">
      {state === "success" ? (
        <motion.div
          key="ok"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="glass rounded-3xl px-8 py-16 text-center"
          role="status"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.1 }}
            className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-full border border-accent/40 bg-accent/10 text-accent"
          >
            <IconCheck width={30} height={30} />
          </motion.div>
          <h3 className="text-2xl font-semibold text-white">{success.title}</h3>
          <p className="mx-auto mt-3 max-w-md text-white/55">{success.text}</p>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          noValidate
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="glass rounded-3xl p-6 sm:p-9"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            {fields.map((f) => {
              const id = `f-${f.name}`;
              const err = errors[f.name];
              const common = {
                id,
                name: f.name,
                value: values[f.name] ?? "",
                "aria-invalid": err ? true : undefined,
                "aria-describedby": err ? `${id}-err` : f.hint ? `${id}-hint` : undefined,
                autoComplete: f.autoComplete,
                dir: f.ltr ? ("ltr" as const) : undefined,
                className: `${control} ${f.ltr ? "text-start" : ""}`,
              };
              return (
                <div key={f.name} className={f.half ? "" : "sm:col-span-2"}>
                  <label htmlFor={id} className="mb-2 block text-sm font-medium text-white/75">
                    {f.label}
                    {f.optional && <span className="ms-2 text-white/30">·</span>}
                  </label>
                  {f.type === "textarea" ? (
                    <textarea
                      {...common}
                      rows={5}
                      maxLength={f.maxLength}
                      onChange={(e) => set(f.name, e.target.value)}
                      className={`${common.className} resize-y`}
                    />
                  ) : f.type === "select" ? (
                    <select
                      {...common}
                      onChange={(e) => set(f.name, e.target.value)}
                      className={`${common.className} appearance-none`}
                    >
                      <option value="" className="bg-coal">
                        {t.form.choose}
                      </option>
                      {f.options?.map((o) => (
                        <option key={o.value} value={o.value} className="bg-coal">
                          {o.label}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      {...common}
                      type={f.type}
                      min={f.min}
                      max={f.max}
                      maxLength={f.maxLength}
                      inputMode={f.type === "number" ? "numeric" : undefined}
                      onChange={(e) => set(f.name, e.target.value)}
                    />
                  )}
                  {err ? (
                    <p id={`${id}-err`} className="mt-2 text-[13px] text-rose-300">
                      {errorText(err)}
                    </p>
                  ) : f.hint ? (
                    <p id={`${id}-hint`} className="mt-2 text-[13px] text-white/35">
                      {f.hint}
                    </p>
                  ) : null}
                </div>
              );
            })}

            {/* Honeypot — hidden from people and assistive tech; bots fill it. */}
            <div aria-hidden="true" className="absolute -start-[9999px] h-0 w-0 overflow-hidden">
              <label htmlFor="f-website">Website</label>
              <input
                id="f-website"
                name="website"
                tabIndex={-1}
                autoComplete="off"
                value={honeypot}
                onChange={(e) => setHoneypot(e.target.value)}
              />
            </div>
          </div>

          {(state === "error" || state === "rate") && (
            <p role="alert" className="mt-6 rounded-2xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm text-rose-200">
              {state === "rate" ? t.form.rate : t.form.error}
            </p>
          )}

          <div className="mt-7 flex flex-wrap items-center justify-between gap-4">
            {note && <p className="max-w-md text-[13px] leading-6 text-white/35">{note}</p>}
            <SubmitButton type="submit" disabled={state === "loading"} className="ms-auto">
              {state === "loading" ? t.common.sending : submitLabel}
            </SubmitButton>
          </div>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
