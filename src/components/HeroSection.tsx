"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Logo from "./Logo";
import ArchFrame from "./ArchFrame";
import FloatingSprig from "./FloatingSprig";
import { weddingConfig } from "@/config/wedding";
import { useIntro } from "./intro/IntroProvider";
import { useReducedMotionPref } from "@/lib/motion";

/**
 * Full-bleed hero: the names stand inside a fine floral arch,
 * with painted bouquets anchoring the whole viewport.
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
    ? "font-display font-semibold text-[clamp(3rem,11vw,4.6rem)] leading-[1.22] text-ink"
    : "font-display font-light uppercase tracking-[0.1em] text-[clamp(2.2rem,8vw,3.6rem)] leading-[1.12] text-ink";

  return (
    <section
      className={`texture-paper relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden bg-ivory px-4 py-10 ${
        revealed ? "is-revealed" : ""
      }`}
    >
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(177,173,157,0.2),transparent_62%)]"
        aria-hidden
      />

      {/* bouquets anchoring the viewport */}
      <Image
        src="/images/floral-bouquet.webp"
        alt=""
        width={720}
        height={760}
        priority
        aria-hidden
        className="pointer-events-none absolute -start-10 -top-10 w-[38vw] max-w-[340px]"
      />
      <Image
        src="/images/floral-bouquet.webp"
        alt=""
        width={720}
        height={760}
        priority
        aria-hidden
        className="pointer-events-none absolute -end-12 -top-12 w-[32vw] max-w-[280px] -scale-x-100 opacity-90"
      />
      <Image
        src="/images/floral-bouquet.webp"
        alt=""
        width={720}
        height={760}
        aria-hidden
        className="pointer-events-none absolute -bottom-12 -start-12 w-[32vw] max-w-[280px] -scale-y-100 opacity-90"
      />
      <Image
        src="/images/floral-bouquet.webp"
        alt=""
        width={720}
        height={760}
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -end-10 w-[38vw] max-w-[340px] rotate-180"
      />

      <FloatingSprig
        src="/images/sprig-eucalyptus.webp"
        className="start-[4%] top-[42%] w-12 opacity-55 lg:start-[14%]"
        duration={11}
        rotate={-8}
      />
      <FloatingSprig
        src="/images/sprig-blossom.webp"
        className="end-[5%] top-[36%] w-11 opacity-55 lg:end-[15%]"
        duration={13}
        delay={1.3}
        rotate={7}
      />
      <FloatingSprig
        src="/images/sprig-blossom.webp"
        className="bottom-[14%] start-[16%] hidden w-10 -scale-x-100 opacity-50 lg:block"
        duration={12}
        delay={0.6}
        rotate={-5}
      />
      <FloatingSprig
        src="/images/sprig-eucalyptus.webp"
        className="bottom-[12%] end-[17%] hidden w-12 -scale-x-100 opacity-55 lg:block"
        duration={10}
        delay={1.9}
        rotate={6}
      />

      {/* ── the arch ────────────────────────────────────── */}
      <div className="relative mx-auto w-full max-w-[420px] sm:max-w-[470px]">
        <ArchFrame className="absolute inset-0 h-full w-full text-ink/30" />

        {/* florals growing on the arch shoulders */}
        <Image
          src="/images/floral-bouquet.webp"
          alt=""
          width={340}
          height={360}
          priority
          aria-hidden
          className="hero-item pointer-events-none absolute -start-9 -top-9 w-32 rotate-[8deg] sm:-start-12 sm:-top-11 sm:w-40"
          style={stagger(1)}
        />
        <Image
          src="/images/floral-bouquet.webp"
          alt=""
          width={340}
          height={360}
          priority
          aria-hidden
          className="hero-item pointer-events-none absolute -end-9 -top-9 w-32 -scale-x-100 rotate-[-8deg] sm:-end-12 sm:-top-11 sm:w-40"
          style={stagger(1)}
        />

        <div className="relative flex flex-col items-center px-8 pb-12 pt-20 text-center sm:pb-14 sm:pt-24">
          <div
            className="hero-item flex h-16 justify-center text-sage-deep sm:h-20"
            style={stagger(0)}
          >
            <Logo className="h-full w-auto" title={t("kicker")} />
          </div>

          <p className="hero-item kicker mt-4" style={stagger(2)}>
            {t("kicker")}
          </p>

          <h1 className="mt-5 flex flex-col items-center">
            <span className={`hero-item block ${nameClass}`} style={stagger(3)}>
              {weddingConfig.groom[locale]}
            </span>
            <span
              className="hero-item -my-1 flex items-center gap-4 text-sage-deep"
              style={stagger(4)}
            >
              <span className="hairline-h w-9" aria-hidden />
              <span
                className={
                  isArabic
                    ? "font-display text-2xl sm:text-3xl"
                    : "font-display text-3xl font-light italic sm:text-4xl"
                }
              >
                {t("connector")}
              </span>
              <span className="hairline-h w-9" aria-hidden />
            </span>
            <span className={`hero-item block ${nameClass}`} style={stagger(5)}>
              {weddingConfig.bride[locale]}
            </span>
          </h1>

          <p
            className={`hero-item mt-6 max-w-sm text-balance text-ink-soft ${
              isArabic ? "leading-8" : "text-sm leading-7"
            }`}
            style={stagger(6)}
          >
            {t("invite")}
          </p>

          <p
            className={`hero-item lining-nums mt-5 text-sage-deep ${
              isArabic ? "text-lg" : "text-sm uppercase tracking-[0.28em]"
            }`}
            style={stagger(7)}
          >
            {dateLine}
          </p>
        </div>
      </div>

      <div
        className="hero-item relative mt-6 flex flex-col items-center gap-2.5 text-ink-soft"
        style={stagger(9)}
      >
        <span
          className={
            isArabic ? "text-[11px]" : "text-[10px] uppercase tracking-[0.3em]"
          }
        >
          {t("scroll")}
        </span>
        <span className="relative block h-9 w-px overflow-hidden bg-ink/20">
          <span className="animate-cue absolute left-0 top-0 h-3 w-px bg-ink/60" />
        </span>
      </div>
    </section>
  );
}
