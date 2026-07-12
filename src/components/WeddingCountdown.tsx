"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Reveal from "./Reveal";
import Logo from "./Logo";
import { formatCountdownNumber, weddingDate } from "@/lib/dates";

type Unit = "days" | "hours" | "minutes" | "seconds";

const UNITS: Unit[] = ["days", "hours", "minutes", "seconds"];

function remaining(target: number, now: number) {
  const diff = Math.max(0, target - now);
  return {
    days: Math.floor(diff / 86_400_000),
    hours: Math.floor(diff / 3_600_000) % 24,
    minutes: Math.floor(diff / 60_000) % 60,
    seconds: Math.floor(diff / 1_000) % 60,
  };
}

export default function WeddingCountdown() {
  const t = useTranslations("countdown");
  const locale = useLocale() as "ar" | "en";
  const target = useMemo(() => weddingDate().getTime(), []);

  // null until mounted — server and first client render must match
  const [now, setNow] = useState<number | null>(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  const arrived = now !== null && now >= target;
  const values = remaining(target, now ?? target - 1);
  const isArabic = locale === "ar";

  return (
    <section className="relative overflow-hidden bg-cream/60 px-6 py-14 sm:py-16">
      <Image
        src="/images/floral-bouquet.webp"
        alt=""
        width={720}
        height={760}
        aria-hidden
        className="pointer-events-none absolute -right-14 top-0 w-[42vw] max-w-[280px] -scale-x-100 opacity-60"
      />
      <Image
        src="/images/floral-bouquet.webp"
        alt=""
        width={720}
        height={760}
        aria-hidden
        className="pointer-events-none absolute -left-14 bottom-0 w-[42vw] max-w-[280px] -scale-y-100 opacity-60"
      />

      <Reveal className="relative mx-auto max-w-2xl text-center">
        <p className="kicker">{t("kicker")}</p>

        {arrived ? (
          <div className="mt-12 flex flex-col items-center gap-8">
            <Logo className="h-24 w-auto text-sage-deep" />
            <p className="text-balance font-display text-3xl leading-relaxed text-ink sm:text-4xl">
              {t("arrived")}
            </p>
          </div>
        ) : (
          <div className="relative mt-7 border border-ink/15 bg-ivory/80 px-2 py-8 sm:px-8">
            <div
              className="pointer-events-none absolute inset-1.5 border border-ink/10"
              aria-hidden
            />
            <div
              className="relative flex items-stretch justify-center"
              role="timer"
              aria-label={t("ariaLabel")}
            >
              {UNITS.map((unit, index) => (
                <div key={unit} className="flex items-stretch">
                  {index > 0 && <span className="hairline-v" aria-hidden />}
                  <div className="flex w-[4.4rem] flex-col items-center justify-center px-1 py-2 sm:w-28">
                    <span className="lining-nums font-display text-[clamp(2rem,7.5vw,3.4rem)] leading-none text-ink">
                      {now === null
                        ? "--"
                        : formatCountdownNumber(locale, values[unit])}
                    </span>
                    <span
                      className={`mt-3 text-[11px] text-ink-soft ${
                        isArabic ? "text-[13px]" : "uppercase tracking-[0.22em]"
                      }`}
                    >
                      {t(unit)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Reveal>
    </section>
  );
}
