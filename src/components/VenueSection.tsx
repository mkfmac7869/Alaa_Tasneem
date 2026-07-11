import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Reveal from "./Reveal";
import MapButton from "./MapButton";
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
    <section className="relative bg-charcoal text-ivory">
      <div className="relative h-[52vh] min-h-[340px] sm:h-[64vh]">
        <Image
          src="/images/venue-photo-fairy-garden.webp"
          alt={t("imageAlt")}
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div
          className="absolute inset-0 bg-gradient-to-b from-charcoal/30 via-transparent to-charcoal"
          aria-hidden
        />
      </div>

      <div className="relative -mt-16 px-6 pb-24 sm:pb-32">
        <Reveal className="mx-auto max-w-xl text-center">
          <p className="kicker !text-ivory/60">{t("kicker")}</p>
          <h2 className="mt-6 font-display text-3xl leading-snug sm:text-4xl">
            {name}
          </h2>
          <p className="mt-3 text-sm text-ivory/70">{city}</p>
          <p
            className={`mt-7 text-ivory/85 ${
              locale === "ar" ? "text-lg leading-9" : "leading-8"
            }`}
          >
            {t("description")}
          </p>

          <div className="mt-11 flex flex-col items-center gap-5">
            <MapButton href={googleMapsHref()} label={t("directions")} />
            <a
              href={appleMapsHref()}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-ivory/65 underline underline-offset-4 transition-colors hover:text-ivory"
            >
              {t("appleMaps")}
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
