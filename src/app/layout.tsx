import type { Metadata, Viewport } from "next";
import { IBM_Plex_Sans_Arabic, Space_Grotesk } from "next/font/google";
import { dictionaries } from "@/lib/i18n";
import { getLang } from "@/lib/i18n/server";
import { I18nProvider } from "@/lib/i18n/client";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const arabic = IBM_Plex_Sans_Arabic({
  subsets: ["arabic", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--f-ar",
  display: "swap",
});
const latin = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--f-lat",
  display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
  const lang = await getLang();
  const t = dictionaries[lang];
  return {
    metadataBase: new URL(SITE_URL),
    title: { default: t.meta.title, template: "%s | FAHD STUDIO" },
    description: t.meta.description,
    applicationName: "FAHD STUDIO",
    keywords: [
      "FAHD STUDIO",
      "Roblox",
      "Roblox Studio",
      "Luau",
      "تطوير ألعاب",
      "روبلوكس",
      "فهد استديو",
    ],
    openGraph: {
      type: "website",
      siteName: "FAHD STUDIO",
      title: t.meta.title,
      description: t.meta.description,
      locale: lang === "ar" ? "ar_SA" : "en_US",
      alternateLocale: lang === "ar" ? ["en_US"] : ["ar_SA"],
      images: [{ url: "/og.png", width: 1200, height: 630, alt: "FAHD STUDIO" }],
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.title,
      description: t.meta.description,
      images: ["/og.png"],
    },
    robots: { index: true, follow: true },
  };
}

export const viewport: Viewport = {
  themeColor: "#06070a",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  return (
    <html
      lang={lang}
      dir={lang === "ar" ? "rtl" : "ltr"}
      className={`${arabic.variable} ${latin.variable}`}
    >
      <body>
        <I18nProvider lang={lang}>{children}</I18nProvider>
      </body>
    </html>
  );
}
