import { useLocale, useTranslations } from "next-intl";
import Reveal from "./Reveal";
import Logo from "./Logo";
import SectionFlora from "./SectionFlora";
import { weddingConfig } from "@/config/wedding";
import {
  formatCeremonyTime,
  formatGregorianDate,
  formatHijriDate,
} from "@/lib/dates";

export default function EventDetails() {
  const t = useTranslations("details");
  const locale = useLocale() as "ar" | "en";

  const minutes = new Intl.NumberFormat("en").format(
    weddingConfig.arrivalNoteMinutes
  );

  return (
    <section className="texture-paper relative overflow-hidden bg-ivory px-6 py-24 text-center sm:py-32">
      <SectionFlora variant="start" opacity="opacity-65" />
      <Reveal className="relative mx-auto max-w-2xl">
        <p className="kicker">{t("kicker")}</p>
        <p className="lining-nums mt-8 font-display text-3xl leading-snug text-ink sm:text-4xl">
          {formatGregorianDate(locale)}
        </p>
        {weddingConfig.showHijriDate && (
          <p className="lining-nums mt-4 text-sm text-ink-soft">
            {t("hijriPrefix")} {formatHijriDate(locale)}
          </p>
        )}
        <div className="my-9 flex items-center justify-center gap-5" aria-hidden>
          <span className="hairline-h w-14" />
          <Logo className="h-6 w-auto text-sage" />
          <span className="hairline-h w-14" />
        </div>
        <p className={`lining-nums ${locale === "ar" ? "text-lg" : "text-base"}`}>
          {t("ceremonyAt", { time: formatCeremonyTime(locale) })}
        </p>
        <p className="lining-nums mt-3 text-sm text-ink-soft">
          {t("arrivalNote", { minutes })}
        </p>
      </Reveal>
    </section>
  );
}
