"use client";

import { getImageProps } from "next/image";
import { useLocale, useTranslations } from "next-intl";
import WeddingMonogram from "./WeddingMonogram";
import { weddingConfig } from "@/config/wedding";
import { useIntro } from "./intro/IntroProvider";
import { useReducedMotionPref } from "@/lib/motion";

export default function HeroSection({ dateLine }: { dateLine: string }) {
  const t = useTranslations("hero");
  const locale = useLocale() as "ar" | "en";
  const { revealed } = useIntro();
  const reduced = useReducedMotionPref();
  const isArabic = locale === "ar";

  // Staggered entrance: each element settles a beat after the last
  const stagger = (step: number) =>
    reduced ? undefined : { transitionDelay: `${0.15 + step * 0.16}s` };

  const nameClass = isArabic
    ? "font-display text-[clamp(3rem,12vw,5.5rem)] leading-[1.15]"
    : "font-display text-[clamp(2.6rem,10vw,5rem)] font-light uppercase tracking-[0.14em] leading-[1.08]";

  // Art-directed hero: a vertical dusk frame for phones, the wide
  // courtyard for larger screens — only the needed one is fetched.
  // priority: this IS the LCP element — never lazy-load it
  const common = {
    alt: t("imageAlt"),
    sizes: "100vw",
    quality: 72,
    priority: true,
  };
  const {
    props: { srcSet: desktopSrcSet },
  } = getImageProps({
    ...common,
    width: 2752,
    height: 1536,
    src: "/images/venue-hero-dusk-wide.webp",
  });
  const { props: mobileImgProps } = getImageProps({
    ...common,
    width: 1536,
    height: 2752,
    src: "/images/venue-hero-dusk-tall.webp",
  });

  return (
    <section
      className={`relative flex min-h-[100svh] items-center justify-center overflow-hidden bg-charcoal text-ivory ${
        revealed ? "is-revealed" : ""
      }`}
    >
      <div className="hero-bg absolute inset-0">
        <picture>
          <source
            media="(min-width: 768px)"
            srcSet={desktopSrcSet}
            sizes="100vw"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            {...mobileImgProps}
            alt={t("imageAlt")}
            fetchPriority="high"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
      </div>

      {/* legibility veil — light at eye level, deeper at the base */}
      <div
        className="absolute inset-0 bg-gradient-to-b from-night/60 via-night/20 to-charcoal/80"
        aria-hidden
      />

      <div className="relative z-10 flex flex-col items-center px-6 py-24 text-center">
        <div className="hero-item mb-8 w-16 text-ivory/90" style={stagger(0)}>
          <WeddingMonogram title={t("kicker")} />
        </div>

        <p className="hero-item kicker !text-ivory/70" style={stagger(1)}>
          {t("kicker")}
        </p>

        <h1 className="flex flex-col items-center">
          <span
            className={`hero-item mt-6 block ${nameClass}`}
            style={stagger(2)}
          >
            {weddingConfig.groom[locale]}
          </span>
          <span
            className="hero-item my-4 flex items-center gap-5 text-ivory/80"
            style={stagger(3)}
          >
            <span className="hairline-h-light w-12" aria-hidden />
            <span
              className={
                isArabic
                  ? "font-display text-3xl"
                  : "font-display text-4xl font-light italic"
              }
            >
              {t("connector")}
            </span>
            <span className="hairline-h-light w-12" aria-hidden />
          </span>
          <span className={`hero-item block ${nameClass}`} style={stagger(4)}>
            {weddingConfig.bride[locale]}
          </span>
        </h1>

        <p
          className={`hero-item mt-10 max-w-md text-balance text-ivory/85 ${
            isArabic ? "text-lg leading-9" : "text-base leading-7"
          }`}
          style={stagger(5)}
        >
          {t("invite")}
        </p>

        <p
          className={`hero-item mt-8 text-sm text-ivory/75 ${
            isArabic ? "" : "uppercase tracking-[0.28em]"
          }`}
          style={stagger(6)}
        >
          {dateLine}
        </p>

        <div
          className="hero-item mt-16 flex flex-col items-center gap-3 text-ivory/60"
          style={stagger(8)}
        >
          <span
            className={
              isArabic
                ? "text-[11px]"
                : "text-[10px] uppercase tracking-[0.3em]"
            }
          >
            {t("scroll")}
          </span>
          <span className="relative block h-12 w-px overflow-hidden bg-ivory/25">
            <span className="animate-cue absolute left-0 top-0 h-3 w-px bg-ivory/90" />
          </span>
        </div>
      </div>
    </section>
  );
}
