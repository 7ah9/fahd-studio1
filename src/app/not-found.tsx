import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { getDict } from "@/lib/i18n/server";

export default async function NotFound() {
  const { t } = await getDict();
  return (
    <main className="grid min-h-screen place-items-center px-6 text-center">
      <div>
        <Image
          src="/brand/fahd-mark.png"
          alt="FAHAD STUDIO"
          width={1283}
          height={1187}
          className="mx-auto h-32 w-auto opacity-90"
        />
        <h1 className="mt-8 font-display text-4xl font-semibold text-gradient">{t.notFound.title}</h1>
        <p className="mt-4 text-white/55">{t.notFound.text}</p>
        <div className="mt-8">
          <Button href="/" arrow>
            {t.notFound.back}
          </Button>
        </div>
      </div>
    </main>
  );
}
