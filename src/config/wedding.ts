/**
 * ─────────────────────────────────────────────────────────────
 *  WEDDING CONFIGURATION — the single source of truth.
 *
 *  Every visible date, name, venue detail, map link, calendar
 *  entry, QR code and meta tag on the website reads from this
 *  file. Edit here; nothing else needs to change.
 * ─────────────────────────────────────────────────────────────
 */

export const weddingConfig = {
  groom: {
    en: "ALAA",
    ar: "علاء",
  },
  bride: {
    en: "TASNEEM",
    ar: "تسنيم",
  },
  initials: {
    en: "A&T",
    ar: "ع ت",
  },

  /**
   * The wedding day and times, as the venue's wall clock. Countdown,
   * displayed dates, Hijri conversion, calendar links and the ICS
   * file all derive from these four values.
   */
  date: "2026-08-25",
  /** Ceremony start — [INSERT TIME], 24h format */
  startTime: "19:00",
  endTime: "23:30",
  /** Egypt observes DST: +03:00 in August (winter is +02:00) */
  utcOffset: "+03:00",
  timezone: "Africa/Cairo",

  /** Show the Hijri date alongside the Gregorian one */
  showHijriDate: true,

  /** Guests are asked to arrive this many minutes early */
  arrivalNoteMinutes: 30,

  venue: {
    nameEn: "Fairy Garden",
    nameAr: "فيري جاردن",
    cityEn: "Giza, Egypt",
    cityAr: "الجيزة، مصر",
    /** Optional street address — empty strings are simply omitted */
    addressEn: "",
    addressAr: "",
    googleMapsUrl: "https://maps.app.goo.gl/bBYj7db8CEVRLbkv7",
    latitude: 29.9636844 as number,
    longitude: 31.0415557 as number,
  },

  /**
   * The final deployed URL — used for the QR code, canonical URL
   * and social sharing. While it is a placeholder, the QR code
   * falls back to the address the site is actually served from.
   */
  websiteUrl: "[INSERT FINAL WEBSITE URL]",

  /** Drop the licensed track at public/audio/wedding-theme.mp3 */
  musicUrl: "/audio/wedding-theme.mp3",

  privacy: {
    /** Keep true until launch to ask search engines not to index */
    noindex: true,
    /**
     * Set a code (e.g. "2026") to require guests to enter it once
     * before seeing the invitation. null disables the gate.
     */
    inviteCode: null as string | null,
  },
} as const;

export type WeddingConfig = typeof weddingConfig;

function titleCase(name: string): string {
  return name
    .split(/\s+/)
    .map((word) => word.charAt(0) + word.slice(1).toLowerCase())
    .join(" ");
}

/** "علاء وتسنيم" / "Alaa & Tasneem" — the couple as one line. */
export function coupleNames(locale: "ar" | "en"): string {
  if (locale === "ar") {
    return `${weddingConfig.groom.ar} و${weddingConfig.bride.ar}`;
  }
  return `${titleCase(weddingConfig.groom.en)} & ${titleCase(
    weddingConfig.bride.en
  )}`;
}

/** True while a config value is still an unedited [placeholder]. */
export function isPlaceholder(value: string): boolean {
  return value.trim().startsWith("[") || value.trim().startsWith("[أدخل");
}

/** Best available Google Maps link given the current config. */
export function googleMapsHref(): string {
  const { googleMapsUrl, latitude, longitude, nameEn } = weddingConfig.venue;
  if (!isPlaceholder(googleMapsUrl)) return googleMapsUrl;
  if (latitude !== 0 || longitude !== 0) {
    return `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
  }
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    isPlaceholder(nameEn) ? "wedding venue" : nameEn
  )}`;
}

/** Apple Maps link for iOS guests. */
export function appleMapsHref(): string {
  const { latitude, longitude, nameEn } = weddingConfig.venue;
  if (latitude !== 0 || longitude !== 0) {
    return `https://maps.apple.com/?ll=${latitude},${longitude}&q=${encodeURIComponent(
      isPlaceholder(nameEn) ? "Wedding" : nameEn
    )}`;
  }
  return `https://maps.apple.com/?q=${encodeURIComponent(
    isPlaceholder(nameEn) ? "wedding venue" : nameEn
  )}`;
}
