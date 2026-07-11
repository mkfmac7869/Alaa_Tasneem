import { useLocale, useTranslations } from "next-intl";
import Reveal from "./Reveal";
import { weddingConfig } from "@/config/wedding";
import {
  formatCeremonyTime,
  formatGregorianDate,
  formatHijriDate,
} from "@/lib/dates";

export default function EventDetails() {
  const t = useTranslations("details");
  const locale = useLocale() as "ar" | "en";

  const minutes = new Intl.NumberFormat(
    locale === "ar" ? "ar-EG" : "en"
  ).format(weddingConfig.arrivalNoteMinutes);

  return (
    <section className="bg-ivory px-6 py-28 text-center sm:py-32">
      <Reveal className="mx-auto max-w-2xl">
        <p className="kicker">{t("kicker")}</p>
        <p className="mt-8 font-display text-3xl leading-snug text-ink sm:text-4xl">
          {formatGregorianDate(locale)}
        </p>
        {weddingConfig.showHijriDate && (
          <p className="mt-4 text-sm text-ink-soft">
            {t("hijriPrefix")} {formatHijriDate(locale)}
          </p>
        )}
        <div className="hairline-h mx-auto my-10 w-24" />
        <p className={locale === "ar" ? "text-lg" : "text-base"}>
          {t("ceremonyAt", { time: formatCeremonyTime(locale) })}
        </p>
        <p className="mt-3 text-sm text-ink-soft">
          {t("arrivalNote", { minutes })}
        </p>
      </Reveal>
    </section>
  );
}
