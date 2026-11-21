import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "لوحة الإدارة",
  robots: { index: false, follow: false },
};

/** The admin panel is Arabic-only and always RTL, regardless of the site language cookie. */
export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div dir="rtl" lang="ar" className="min-h-screen bg-ink">
      {children}
    </div>
  );
}
