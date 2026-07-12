import type { Metadata, Viewport } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import {
  Almarai,
  Cormorant_Garamond,
  El_Messiri,
  Manrope,
} from "next/font/google";
import localFont from "next/font/local";
import { routing } from "@/i18n/routing";
import { coupleNames, isPlaceholder, weddingConfig } from "@/config/wedding";
import "../globals.css";

/**
 * Only the weights that actually render are loaded. The Arabic set
 * is preloaded because Arabic is the default (and primary) locale;
 * the Latin pair loads on demand via CSS when needed.
 */

/** The couple's chosen Thuluth calligraphy — Arabic display only. */
const thuluth = localFont({
  src: "../../fonts/AThuluth-Regular.ttf",
  variable: "--font-thuluth",
  display: "swap",
});

const elMessiri = El_Messiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-el-messiri",
  display: "swap",
});

const almarai = Almarai({
  subsets: ["arabic"],
  weight: ["300", "400", "700"],
  variable: "--font-almarai",
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
  preload: false,
});

const manrope = Manrope({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-manrope",
  display: "swap",
  preload: false,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const couple = coupleNames(locale === "en" ? "en" : "ar");
  const title = t("title", { couple });
  const base = !isPlaceholder(weddingConfig.websiteUrl)
    ? new URL(weddingConfig.websiteUrl)
    : undefined;

  return {
    metadataBase: base,
    title,
    description: t("description"),
    openGraph: {
      title,
      description: t("description"),
      type: "website",
      locale: locale === "ar" ? "ar_AE" : "en_US",
      images: [
        {
          url: "/og/social-card.jpg",
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description: t("description"),
      images: ["/og/social-card.jpg"],
    },
    robots: weddingConfig.privacy.noindex
      ? { index: false, follow: false }
      : undefined,
    alternates: base ? { languages: { ar: "/ar", en: "/en" } } : undefined,
  };
}

export const viewport: Viewport = {
  themeColor: "#f7f2e9",
  width: "device-width",
  initialScale: 1,
};

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const dir = locale === "ar" ? "rtl" : "ltr";

  return (
    <html
      lang={locale}
      dir={dir}
      className={`${thuluth.variable} ${elMessiri.variable} ${almarai.variable} ${cormorant.variable} ${manrope.variable}`}
    >
      <body>
        <noscript>
          {/* Without JS: no envelope, and all content fully visible */}
          <style>{`[data-intro-overlay]{display:none !important}
.reveal,.hero-item{opacity:1 !important;transform:none !important;filter:none !important}`}</style>
        </noscript>
        <NextIntlClientProvider>{children}</NextIntlClientProvider>
      </body>
    </html>
  );
}
