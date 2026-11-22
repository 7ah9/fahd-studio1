import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Preloader } from "@/components/layout/Preloader";
import { PageViewBeacon } from "@/components/layout/PageViewBeacon";
import { getLang } from "@/lib/i18n/server";
import { SITE_URL } from "@/lib/site";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const lang = await getLang();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "FAHAD STUDIO",
    url: SITE_URL,
    logo: `${SITE_URL}/brand/fahd-mark.png`,
    description:
      lang === "ar"
        ? "استديو متخصص في تطوير وبرمجة الألعاب والمشاريع داخل Roblox Studio"
        : "A studio building games and projects inside Roblox Studio",
  };

  return (
    <>
      <Preloader />
      <PageViewBeacon />
      <Header />
      <main id="main">{children}</main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
    </>
  );
}
