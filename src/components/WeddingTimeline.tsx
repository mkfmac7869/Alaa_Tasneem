import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Reveal from "./Reveal";
import Logo from "./Logo";
import SectionFlora from "./SectionFlora";
import { weddingConfig } from "@/config/wedding";
import { formatWallClock } from "@/lib/dates";

/**
 * The programme of the evening — an ornamented centre spine with
 * the hours of the celebration alternating left and right.
 */
export default function WeddingTimeline() {
  const t = useTranslations("timeline");
  const locale = useLocale() as "ar" | "en";
  const isArabic = locale === "ar";

  return (
    <section className="texture-paper relative overflow-hidden bg-ivory px-6 py-14 sm:py-16">
      <SectionFlora variant="both" opacity="opacity-60" />

      <div className="relative mx-auto max-w-2xl">
        <Reveal className="text-center">
          <Logo className="mx-auto h-10 w-auto text-sage" />
          <p className="kicker mt-5">{t("kicker")}</p>
        </Reveal>

        {/* the programme card */}
        <div className="relative mt-8 border border-ink/15 bg-ivory/80 px-4 py-10 sm:px-10">
          <div
            className="pointer-events-none absolute inset-1.5 border border-ink/10"
            aria-hidden
          />

          <div className="relative">
            {/* centre spine with leafy finials */}
            <div
              className="absolute inset-y-2 left-1/2 w-px -translate-x-1/2 bg-sage/50"
              aria-hidden
            />
            <Image
              src="/images/sprig-eucalyptus.webp"
              alt=""
              width={80}
              height={120}
              aria-hidden
              className="pointer-events-none absolute -top-6 left-1/2 w-9 -translate-x-1/2 opacity-80"
            />

            <ol className="relative space-y-2">
              {weddingConfig.timeline.map(({ key, time }, index) => {
                const onLeft = index % 2 === 0;
                return (
                  <li key={key} className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 sm:gap-x-7">
                    {/* left cell */}
                    <div className={onLeft ? "py-4" : ""}>
                      {onLeft && (
                        <Reveal from="left" className="text-end">
                          <p className="lining-nums font-display text-2xl leading-none text-sage-deep sm:text-3xl">
                            {formatWallClock(locale, time)}
                          </p>
                          <p
                            className={`mt-2 text-ink ${
                              isArabic ? "text-lg" : "text-sm uppercase tracking-[0.14em]"
                            }`}
                          >
                            {t(key)}
                          </p>
                        </Reveal>
                      )}
                    </div>

                    {/* node */}
                    <span
                      className="relative z-10 mx-auto grid h-4 w-4 place-items-center"
                      aria-hidden
                    >
                      <span className="absolute h-4 w-4 rounded-full bg-sage/25" />
                      <span className="absolute h-2 w-2 rounded-full bg-sage-deep" />
                    </span>

                    {/* right cell */}
                    <div className={!onLeft ? "py-4" : ""}>
                      {!onLeft && (
                        <Reveal from="right" className="text-start">
                          <p className="lining-nums font-display text-2xl leading-none text-sage-deep sm:text-3xl">
                            {formatWallClock(locale, time)}
                          </p>
                          <p
                            className={`mt-2 text-ink ${
                              isArabic ? "text-lg" : "text-sm uppercase tracking-[0.14em]"
                            }`}
                          >
                            {t(key)}
                          </p>
                        </Reveal>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>

            <Image
              src="/images/sprig-blossom.webp"
              alt=""
              width={80}
              height={120}
              aria-hidden
              className="pointer-events-none absolute -bottom-7 left-1/2 w-9 -translate-x-1/2 opacity-80"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
