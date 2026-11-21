"use client";

import type {
  ButtonHTMLAttributes,
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";

export const fieldCls =
  "w-full rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5 text-sm text-white placeholder:text-white/25 outline-none transition focus:border-accent/60 focus:shadow-[0_0_0_3px_rgb(156_192_228/0.12)] aria-[invalid=true]:border-rose-400/60";

export const ERR_AR: Record<string, string> = {
  required: "هذا الحقل مطلوب",
  tooShort: "النص قصير جداً",
  tooLong: "النص طويل جداً",
  invalid: "القيمة غير صالحة",
  email: "بريد إلكتروني غير صالح",
};

export function Field({
  label,
  error,
  hint,
  children,
  className = "",
}: {
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-1.5 block text-[13px] font-medium text-white/65">{label}</span>
      {children}
      {error ? (
        <span className="mt-1.5 block text-xs text-rose-300">{ERR_AR[error] ?? ERR_AR.invalid}</span>
      ) : hint ? (
        <span className="mt-1.5 block text-xs text-white/30">{hint}</span>
      ) : null}
    </label>
  );
}

export function TextInput({ className = "", ...p }: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...p} className={`${fieldCls} ${className}`} />;
}
export function TextArea({ className = "", ...p }: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...p} className={`${fieldCls} resize-y ${className}`} />;
}
export function Select({ className = "", children, ...p }: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...p} className={`${fieldCls} appearance-none ${className}`}>
      {children}
    </select>
  );
}

type BtnVariant = "primary" | "ghost" | "danger";
const btnCls: Record<BtnVariant, string> = {
  primary: "bg-accent text-ink hover:bg-white",
  ghost: "border border-white/10 bg-white/[0.04] text-white/80 hover:border-accent/40 hover:text-white",
  danger: "border border-rose-400/30 bg-rose-400/10 text-rose-200 hover:bg-rose-400/20",
};
export function Btn({
  variant = "primary",
  className = "",
  ...p
}: ButtonHTMLAttributes<HTMLButtonElement> & { variant?: BtnVariant }) {
  return (
    <button
      type="button"
      {...p}
      className={`inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-all duration-300 disabled:pointer-events-none disabled:opacity-50 ${btnCls[variant]} ${className}`}
    />
  );
}

export function Badge({
  tone = "neutral",
  children,
}: {
  tone?: "neutral" | "accent" | "good" | "bad";
  children: ReactNode;
}) {
  const tones = {
    neutral: "border-white/10 bg-white/[0.04] text-white/60",
    accent: "border-accent/30 bg-accent/10 text-accent",
    good: "border-emerald-400/30 bg-emerald-400/10 text-emerald-200",
    bad: "border-rose-400/30 bg-rose-400/10 text-rose-200",
  } as const;
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs ${tones[tone]}`}>
      {children}
    </span>
  );
}

export function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <div className={`rounded-2xl border border-white/[0.08] bg-coal/70 p-5 sm:p-6 ${className}`}>
      {children}
    </div>
  );
}

export function PageTitle({ title, subtitle, action }: { title: string; subtitle?: string; action?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-white sm:text-3xl">{title}</h1>
        {subtitle && <p className="mt-2 text-sm text-white/45">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export type ApiResult<T = unknown> = {
  ok: boolean;
  status: number;
  data?: T;
  fields?: Record<string, string>;
  error?: string;
};

export async function api<T = unknown>(
  method: "POST" | "PATCH" | "PUT" | "DELETE",
  url: string,
  body?: unknown,
): Promise<ApiResult<T>> {
  try {
    const res = await fetch(url, {
      method,
      headers: body === undefined ? undefined : { "Content-Type": "application/json" },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
    const json = (await res.json().catch(() => ({}))) as {
      data?: T;
      fields?: Record<string, string>;
      error?: string;
    };
    return { ok: res.ok, status: res.status, data: json.data, fields: json.fields, error: json.error };
  } catch {
    return { ok: false, status: 0, error: "network" };
  }
}

export function Message({ kind, children }: { kind: "ok" | "error"; children: ReactNode }) {
  return (
    <p
      role={kind === "error" ? "alert" : "status"}
      className={`rounded-xl border px-4 py-2.5 text-sm ${
        kind === "ok"
          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
          : "border-rose-400/30 bg-rose-400/10 text-rose-200"
      }`}
    >
      {children}
    </p>
  );
}

export const formatDate = (iso: string) =>
  new Intl.DateTimeFormat("ar-SA-u-ca-gregory-nu-latn", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(iso));
