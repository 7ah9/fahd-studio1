import Image from "next/image";
import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { getAdminUser } from "@/lib/auth";
import { isDbConfigured } from "@/lib/supabase/admin";

export default async function AdminLoginPage() {
  const configured = isDbConfigured();
  if (configured && (await getAdminUser())) redirect("/admin");

  return (
    <main className="relative grid min-h-screen place-items-center overflow-hidden px-5">
      <div
        aria-hidden
        className="pointer-events-none absolute -top-40 start-1/2 h-[520px] w-[760px] -translate-x-1/2 rounded-full bg-[radial-gradient(closest-side,rgb(111_156_203/0.2),transparent)] blur-3xl"
      />
      <div className="glass relative w-full max-w-md rounded-3xl p-8 sm:p-10">
        <Image
          src="/brand/fahd-mark.png"
          alt="FAHAD STUDIO"
          width={1283}
          height={1187}
          priority
          className="mx-auto h-20 w-auto"
        />
        <h1 className="mt-6 text-center text-2xl font-semibold text-white">تسجيل دخول الإدارة</h1>
        <p className="mt-2 text-center text-sm text-white/45">خاص بإدارة FAHAD STUDIO فقط</p>
        {configured ? (
          <LoginForm />
        ) : (
          <p className="mt-8 rounded-xl border border-rose-400/30 bg-rose-400/10 px-4 py-3 text-sm leading-7 text-rose-200">
            قاعدة البيانات غير مهيأة. أضف متغيرات Supabase في ملف .env.local ثم أعد تشغيل الخادم.
          </p>
        )}
      </div>
    </main>
  );
}
