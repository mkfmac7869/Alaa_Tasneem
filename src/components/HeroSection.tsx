"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Logo from "./Logo";
import FloatingSprig from "./FloatingSprig";
import { weddingConfig } from "@/config/wedding";
import { useIntro } from "./intro/IntroProvider";
import { useReducedMotionPref } from "@/lib/motion";

/**
 * The hero is the invitation card itself — the one that slid out
 * of the envelope — resting on dressed stationery.
 */
export default function HeroSection({ dateLine }: { dateLine: string }) {
  const t = useTranslations("hero");
  const locale = useLocale() as "ar" | "en";
  const { revealed } = useIntro();
  const reduced = useReducedMotionPref();
  const isArabic = locale === "ar";

  const stagger = (step: number) =>
    reduced ? undefined : { transitionDelay: `${0.15 + step * 0.15}s` };

  const nameClass = isArabic
    ? "font-display font-semibold text-[clamp(2.9rem,10vw,5rem)] leading-[1.25] text-ink"
    : "font-display font-light uppercase tracking-[0.12em] text-[clamp(2.3rem,8vw,4.2rem)] leading-[1.1] text-ink";

  return (
    <section
      className={`texture-paper relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-cream/80 px-4 py-10 sm:px-8 ${
        revealed ? "is-revealed" : ""
      }`}
    >
      {/* ambience around the card */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(177,173,157,0.22),transparent_62%)]"
        aria-hidden
      />
      <FloatingSprig
        src="/images/sprig-eucalyptus.webp"
        className="start-[3%] top-[14%] w-14 opacity-60 lg:start-[8%]"
        duration={11}
        rotate={-8}
      />
      <FloatingSprig
        src="/images/sprig-blossom.webp"
        className="end-[4%] top-[20%] w-12 opacity-60 lg:end-[9%]"
        duration={13}
        delay={1.2}
        rotate={7}
      />
      <FloatingSprig
        src="/images/sprig-blossom.webp"
        className="bottom-[16%] start-[6%] w-11 -scale-x-100 opacity-55 lg:start-[12%]"
        duration={12}
        delay={0.6}
        rotate={-5}
      />
      <FloatingSprig
        src="/images/sprig-eucalyptus.webp"
        className="bottom-[10%] end-[5%] w-14 -scale-x-100 opacity-60 lg:end-[10%]"
        duration={10}
        delay={1.8}
        rotate={6}
      />

      {/* ── the invitation card ─────────────────────────── */}
      <div className="hero-item relative w-full max-w-4xl overflow-hidden border border-ink/20 bg-ivory px-5 pb-28 pt-14 text-center shadow-[0_36px_90px_rgba(58,54,44,0.18)] sm:px-14 sm:py-20">
        <div
          className="pointer-events-none absolute inset-2.5 border border-ink/10"
          aria-hidden
        />

        {/* painted corners, all four */}
        <Image
          src="/images/floral-bouquet.webp"
          alt=""
          width={720}
          height={760}
          priority
          aria-hidden
          className="pointer-events-none absolute -start-8 -top-8 w-36 sm:w-56"
        />
        <Image
          src="/images/floral-bouquet.webp"
          alt=""
          width={720}
          height={760}
          priority
          aria-hidden
          className="pointer-events-none absolute -end-8 -top-8 w-32 -scale-x-100 opacity-90 sm:w-48"
        />
        <Image
          src="/images/floral-bouquet.webp"
          alt=""
          width={720}
          height={760}
          aria-hidden
          className="pointer-events-none absolute -bottom-9 -start-9 w-28 -scale-y-100 opacity-90 sm:w-48"
        />
        <Image
          src="/images/floral-bouquet.webp"
          alt=""
          width={720}
          height={760}
          aria-hidden
          className="pointer-events-none absolute -bottom-9 -end-9 w-28 rotate-180 sm:w-56"
        />

        <div className="relative">
          <div
            className="hero-item flex h-20 justify-center text-sage-deep sm:h-24"
            style={stagger(0)}
          >
            <Logo className="h-full w-auto" title={t("kicker")} />
          </div>

          <p className="hero-item kicker mt-5" style={stagger(1)}>
            {t("kicker")}
          </p>

          <h1 className="mt-7 flex flex-col items-center justify-center gap-1 lg:flex-row lg:gap-10">
            <span className={`hero-item block ${nameClass}`} style={stagger(2)}>
              {weddingConfig.groom[locale]}
            </span>
            <span
              className="hero-item flex items-center gap-4 text-sage-deep lg:flex-col lg:gap-1"
              style={stagger(3)}
            >
              <span className="hairline-h w-10 lg:hidden" aria-hidden />
              <span
                className={
                  isArabic
                    ? "font-display text-3xl sm:text-4xl"
                    : "font-display text-3xl font-light italic sm:text-5xl"
                }
              >
                {t("connector")}
              </span>
              <span className="hairline-h w-10 lg:hidden" aria-hidden />
            </span>
            <span className={`hero-item block ${nameClass}`} style={stagger(4)}>
              {weddingConfig.bride[locale]}
            </span>
          </h1>

          <div
            className="hero-item mx-auto mt-9 flex max-w-md items-center justify-center gap-5"
            aria-hidden
            style={stagger(5)}
          >
            <span className="hairline-h flex-1" />
            <Logo className="h-5 w-auto text-sage" />
            <span className="hairline-h flex-1" />
          </div>

          <p
            className={`hero-item mx-auto mt-8 max-w-lg text-balance text-ink-soft ${
              isArabic ? "text-lg leading-9" : "text-base leading-7"
            }`}
            style={stagger(6)}
          >
            {t("invite")}
          </p>

          <p
            className={`hero-item lining-nums mt-7 text-sage-deep ${
              isArabic ? "text-lg" : "text-sm uppercase tracking-[0.3em]"
            }`}
            style={stagger(7)}
          >
            {dateLine}
          </p>
        </div>
      </div>

      <div
        className="hero-item relative mt-8 flex flex-col items-center gap-3 text-ink-soft"
        style={stagger(9)}
      >
        <span
          className={
            isArabic ? "text-[11px]" : "text-[10px] uppercase tracking-[0.3em]"
          }
        >
          {t("scroll")}
        </span>
        <span className="relative block h-10 w-px overflow-hidden bg-ink/20">
          <span className="animate-cue absolute left-0 top-0 h-3 w-px bg-ink/60" />
        </span>
      </div>
    </section>
  );
}
