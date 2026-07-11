import { weddingConfig } from "@/config/wedding";

export type Locale = "ar" | "en";

/** Ceremony start as a full ISO string, e.g. 2026-10-23T19:00:00+04:00 */
export function weddingStartISO(): string {
  const { date, startTime, utcOffset } = weddingConfig;
  return `${date}T${startTime}:00${utcOffset}`;
}

export function weddingDate(): Date {
  return new Date(weddingStartISO());
}

/** BCP-47 tag per locale; Arabic uses Arabic-Indic numerals. */
function dateLocaleTag(locale: Locale): string {
  return locale === "ar" ? "ar-EG-u-nu-arab" : "en-GB";
}

export function formatGregorianDate(locale: Locale): string {
  return new Intl.DateTimeFormat(dateLocaleTag(locale), {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: weddingConfig.timezone,
  }).format(weddingDate());
}

export function formatHijriDate(locale: Locale): string {
  const tag =
    locale === "ar"
      ? "ar-SA-u-ca-islamic-umalqura-nu-arab"
      : "en-u-ca-islamic-umalqura";
  return new Intl.DateTimeFormat(tag, {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: weddingConfig.timezone,
  }).format(weddingDate());
}

export function formatCeremonyTime(locale: Locale): string {
  return new Intl.DateTimeFormat(dateLocaleTag(locale), {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: weddingConfig.timezone,
  }).format(weddingDate());
}

/** Compact numeric date for the footer, e.g. "23 · 10 · 2026". */
export function formatShortDate(locale: Locale): string {
  const parts = new Intl.DateTimeFormat(dateLocaleTag(locale), {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    timeZone: weddingConfig.timezone,
  }).formatToParts(weddingDate());
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("day")} · ${get("month")} · ${get("year")}`;
}

/** Formats a countdown number in the locale's numeral system. */
export function formatCountdownNumber(locale: Locale, value: number): string {
  return new Intl.NumberFormat(locale === "ar" ? "ar-EG" : "en", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  }).format(value);
}
