import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Reveal from "./Reveal";
import Logo from "./Logo";
import FloatingSprig from "./FloatingSprig";
import { weddingConfig } from "@/config/wedding";
import { formatWallClock } from "@/lib/dates";

/**
 * The programme of the evening — set on deep olive, the one dark
 * moment in the story, like the garden after sunset.
 */
export default function WeddingTimeline() {
  const t = useTranslations("timeline");
  const locale = useLocale() as "ar" | "en";
  const isArabic = locale === "ar";

  return (
    <section className="relative overflow-hidden bg-olive-deep px-6 py-14 text-ivory sm:py-16">
      {/* white blossoms glow against the dark green */}
      <Image
        src="/images/floral-bouquet.webp"
        alt=""
        width={720}
        height={760}
        aria-hidden
        className="pointer-events-none absolute -left-14 top-0 w-[44vw] max-w-[300px] opacity-80"
      />
      <Image
        src="/images/floral-bouquet.webp"
        alt=""
        width={720}
        height={760}
        aria-hidden
        className="pointer-events-none absolute -right-14 bottom-0 w-[44vw] max-w-[300px] rotate-180 opacity-80"
      />
      <FloatingSprig
        src="/images/sprig-blossom.webp"
        className="right-[7%] top-[16%] w-11 opacity-60"
        duration={13}
        delay={1.1}
        rotate={8}
      />
      <FloatingSprig
        src="/images/sprig-eucalyptus.webp"
        className="bottom-[14%] left-[6%] w-12 opacity-50"
        duration={11}
        rotate={-6}
      />

      <div className="relative mx-auto max-w-2xl">
        <Reveal className="text-center">
          <Logo className="mx-auto h-10 w-auto text-sage" />
          <p className="kicker mt-5 !text-ivory/70">{t("kicker")}</p>
        </Reveal>

        {/* the programme card */}
        <div className="relative mt-8 border border-ivory/25 bg-ivory/[0.045] px-4 py-10 sm:px-10">
          <div
            className="pointer-events-none absolute inset-1.5 border border-ivory/15"
            aria-hidden
          />

          <div className="relative">
            {/* centre spine with leafy finials */}
            <div
              className="absolute inset-y-2 left-1/2 w-px -translate-x-1/2 bg-ivory/30"
              aria-hidden
            />
            <Image
              src="/images/sprig-eucalyptus.webp"
              alt=""
              width={80}
              height={120}
              aria-hidden
              className="pointer-events-none absolute -top-6 left-1/2 w-9 -translate-x-1/2"
            />

            <ol className="relative space-y-2">
              {weddingConfig.timeline.map(({ key, time }, index) => {
                const onLeft = index % 2 === 0;
                return (
                  <li
                    key={key}
                    className="grid grid-cols-[1fr_auto_1fr] items-center gap-x-4 sm:gap-x-7"
                  >
                    <div className={onLeft ? "py-4" : ""}>
                      {onLeft && (
                        <Reveal from="left" className="text-end">
                          <p className="lining-nums font-display text-2xl leading-none text-sage sm:text-3xl">
                            {formatWallClock(locale, time)}
                          </p>
                          <p
                            className={`mt-2 text-ivory ${
                              isArabic
                                ? "text-lg"
                                : "text-sm uppercase tracking-[0.14em]"
                            }`}
                          >
                            {t(key)}
                          </p>
                        </Reveal>
                      )}
                    </div>

                    <span
                      className="relative z-10 mx-auto grid h-4 w-4 place-items-center"
                      aria-hidden
                    >
                      <span className="absolute h-4 w-4 rounded-full bg-sage/30" />
                      <span className="absolute h-2 w-2 rounded-full bg-sage" />
                    </span>

                    <div className={!onLeft ? "py-4" : ""}>
                      {!onLeft && (
                        <Reveal from="right" className="text-start">
                          <p className="lining-nums font-display text-2xl leading-none text-sage sm:text-3xl">
                            {formatWallClock(locale, time)}
                          </p>
                          <p
                            className={`mt-2 text-ivory ${
                              isArabic
                                ? "text-lg"
                                : "text-sm uppercase tracking-[0.14em]"
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
              className="pointer-events-none absolute -bottom-7 left-1/2 w-9 -translate-x-1/2"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
