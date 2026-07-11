import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import QRInvitation from "@/components/QRInvitation";
import { coupleNames } from "@/config/wedding";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const couple = coupleNames(locale === "en" ? "en" : "ar");
  return { title: `QR — ${t("title", { couple })}` };
}

export default async function QRPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations({ locale, namespace: "qr" });

  return (
    <main className="min-h-svh bg-cream/60 px-6 py-16">
      <div className="mx-auto flex max-w-xl flex-col items-center gap-8">
        <p className="kicker no-print">{t("kicker")}</p>
        <QRInvitation />
        <Link
          href="/"
          className="no-print text-sm text-ink-soft underline underline-offset-4 transition-colors hover:text-olive-deep"
        >
          {t("backToInvitation")}
        </Link>
      </div>
    </main>
  );
}
