"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { Btn, Field, Message, TextInput, api } from "./ui";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    const res = await api("POST", "/api/admin/login", { email, password });
    if (res.ok) {
      router.replace("/admin");
      router.refresh();
      return;
    }
    setBusy(false);
    const base =
      res.status === 429
        ? "محاولات كثيرة. انتظر بضع دقائق ثم أعد المحاولة."
        : res.status === 503
          ? "الخدمة غير مهيأة بعد."
          : res.error === "admin_lookup_failed"
            ? "تم التحقق من حسابك، لكن تعذر فحص صلاحية الإدارة (راجع المفتاح السري في إعدادات الاستضافة)."
            : res.error === "not_admin"
              ? "هذا الحساب غير مضاف كمدير."
              : "بيانات الدخول غير صحيحة.";
    setError(res.detail ? `${base} [${res.detail}]` : base);
  }

  return (
    <form onSubmit={onSubmit} className="mt-8 space-y-4">
      <Field label="البريد الإلكتروني">
        <TextInput
          type="email"
          dir="ltr"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </Field>
      <Field label="كلمة المرور">
        <TextInput
          type="password"
          dir="ltr"
          required
          minLength={8}
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </Field>
      {error && <Message kind="error">{error}</Message>}
      <Btn type="submit" disabled={busy} className="w-full py-3">
        {busy ? "جارٍ الدخول…" : "دخول"}
      </Btn>
    </form>
  );
}
