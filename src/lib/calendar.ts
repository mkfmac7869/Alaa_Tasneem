import {
  coupleNames,
  googleMapsHref,
  isPlaceholder,
  weddingConfig,
} from "@/config/wedding";
import { weddingDate } from "./dates";
import arMessages from "../../messages/ar.json";
import enMessages from "../../messages/en.json";

type Locale = "ar" | "en";

const messages = { ar: arMessages, en: enMessages };

function eventTitle(locale: Locale): string {
  return messages[locale].calendar.eventTitle.replace(
    "{couple}",
    coupleNames(locale)
  );
}

export function eventTimes(): { start: Date; end: Date } {
  const start = weddingDate();
  const { date, endTime, utcOffset } = weddingConfig;
  let end = new Date(`${date}T${endTime}:00${utcOffset}`);
  if (end.getTime() <= start.getTime()) {
    // The celebration runs past midnight
    end = new Date(end.getTime() + 24 * 60 * 60 * 1000);
  }
  return { start, end };
}

/** 20261023T150000Z — the compact UTC form calendars expect. */
function toUtcBasic(date: Date): string {
  return date
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}(?=Z$)/, "");
}

function eventLocation(locale: Locale): string {
  const v = weddingConfig.venue;
  const name = locale === "ar" ? v.nameAr : v.nameEn;
  const address = locale === "ar" ? v.addressAr : v.addressEn;
  const city = locale === "ar" ? v.cityAr : v.cityEn;
  const separator = locale === "ar" ? "، " : ", ";
  return [name, address, city]
    .filter((part) => part.trim() !== "")
    .join(separator);
}

function eventDescription(locale: Locale): string {
  const lines = [
    messages[locale].calendar.eventDescription.replace(
      "{couple}",
      coupleNames(locale)
    ),
    googleMapsHref(),
  ];
  if (!isPlaceholder(weddingConfig.websiteUrl)) {
    lines.push(weddingConfig.websiteUrl);
  }
  return lines.join("\n");
}

export function googleCalendarUrl(locale: Locale): string {
  const { start, end } = eventTimes();
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: eventTitle(locale),
    dates: `${toUtcBasic(start)}/${toUtcBasic(end)}`,
    details: eventDescription(locale),
    location: eventLocation(locale),
    ctz: weddingConfig.timezone,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function outlookCalendarUrl(locale: Locale): string {
  const { start, end } = eventTimes();
  const params = new URLSearchParams({
    path: "/calendar/action/compose",
    rru: "addevent",
    subject: eventTitle(locale),
    startdt: start.toISOString(),
    enddt: end.toISOString(),
    body: eventDescription(locale),
    location: eventLocation(locale),
  });
  return `https://outlook.live.com/calendar/0/deeplink/compose?${params.toString()}`;
}

/** RFC 5545 text escaping. */
function icsEscape(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

export function buildIcs(locale: Locale): string {
  const { start, end } = eventTimes();
  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Alaa and Tasneem//Wedding Invitation//AR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:alaa-tasneem-wedding-${toUtcBasic(start)}@invitation`,
    `DTSTAMP:${toUtcBasic(start)}`,
    `DTSTART:${toUtcBasic(start)}`,
    `DTEND:${toUtcBasic(end)}`,
    `SUMMARY:${icsEscape(eventTitle(locale))}`,
    `DESCRIPTION:${icsEscape(eventDescription(locale))}`,
    `LOCATION:${icsEscape(eventLocation(locale))}`,
    ...(isPlaceholder(weddingConfig.websiteUrl)
      ? []
      : [`URL:${weddingConfig.websiteUrl}`]),
    "END:VEVENT",
    "END:VCALENDAR",
  ];
  return lines.join("\r\n");
}
