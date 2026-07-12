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

/** BCP-47 tag per locale; Arabic text with Latin (Western) digits. */
function dateLocaleTag(locale: Locale): string {
  return locale === "ar" ? "ar-EG-u-nu-latn" : "en-GB";
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
      ? "ar-SA-u-ca-islamic-umalqura-nu-latn"
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

/** Formats a wall-clock time like "17:30" for the timeline. */
export function formatWallClock(locale: Locale, time: string): string {
  const { date, utcOffset } = weddingConfig;
  return new Intl.DateTimeFormat(dateLocaleTag(locale), {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: weddingConfig.timezone,
  }).format(new Date(`${date}T${time}:00${utcOffset}`));
}

/** Formats a countdown number — Western digits in both languages. */
export function formatCountdownNumber(_locale: Locale, value: number): string {
  return new Intl.NumberFormat("en", {
    minimumIntegerDigits: 2,
    useGrouping: false,
  }).format(value);
}
