import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Reveal from "./Reveal";
import MapButton from "./MapButton";
import SectionFlora from "./SectionFlora";
import {
  appleMapsHref,
  googleMapsHref,
  weddingConfig,
} from "@/config/wedding";

export default function VenueSection() {
  const t = useTranslations("venue");
  const locale = useLocale() as "ar" | "en";
  const venue = weddingConfig.venue;

  const name = locale === "ar" ? venue.nameAr : venue.nameEn;
  const city = locale === "ar" ? venue.cityAr : venue.cityEn;

  return (
    <section className="relative overflow-hidden bg-cream/60 px-6 py-14 sm:py-16">
      <SectionFlora variant="end" opacity="opacity-55" />
      <Reveal className="relative mx-auto max-w-2xl text-center">
        <p className="kicker">{t("kicker")}</p>
        <h2 className="mt-5 font-display text-3xl leading-snug text-ink sm:text-4xl">
          {name}
        </h2>
        <p className="mt-3 text-sm text-ink-soft">{city}</p>

        {/* the venue, painted */}
        <div className="mt-8 border border-ink/15 bg-ivory p-2 sm:p-3">
          <Image
            src="/images/venue-illustration.webp"
            alt={t("imageAlt")}
            width={1376}
            height={768}
            sizes="(min-width: 768px) 672px, 100vw"
            className="h-auto w-full"
          />
        </div>

        <p
          className={`mt-8 text-ink-soft ${
            locale === "ar" ? "text-lg leading-9" : "leading-8"
          }`}
        >
          {t("description")}
        </p>

        <div className="mt-8 flex flex-col items-center gap-4">
          <MapButton
            href={googleMapsHref()}
            label={t("directions")}
            tone="light"
          />
          <a
            href={appleMapsHref()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-ink-soft underline underline-offset-4 transition-colors hover:text-olive-deep"
          >
            {t("appleMaps")}
          </a>
        </div>
      </Reveal>
    </section>
  );
}
