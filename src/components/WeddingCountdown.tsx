"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import Reveal from "./Reveal";
import WeddingMonogram from "./WeddingMonogram";
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
    <section className="bg-cream/60 px-6 py-24 sm:py-32">
      <Reveal className="mx-auto max-w-3xl text-center">
        <p className="kicker">{t("kicker")}</p>

        {arrived ? (
          <div className="mt-12 flex flex-col items-center gap-8">
            <WeddingMonogram className="w-20 text-olive-deep" />
            <p className="text-balance font-display text-3xl leading-relaxed text-ink sm:text-4xl">
              {t("arrived")}
            </p>
          </div>
        ) : (
          <div
            className="mt-12 flex items-stretch justify-center"
            role="timer"
            aria-label={t("ariaLabel")}
          >
            {UNITS.map((unit, index) => (
              <div key={unit} className="flex items-stretch">
                {index > 0 && <span className="hairline-v" aria-hidden />}
                <div className="flex w-[4.6rem] flex-col items-center justify-center px-1 py-2 sm:w-28">
                  <span className="font-display text-[clamp(2rem,7.5vw,3.5rem)] leading-none text-ink">
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
        )}
      </Reveal>
    </section>
  );
}
