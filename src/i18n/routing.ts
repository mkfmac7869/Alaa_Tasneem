import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  // Arabic is served at "/", English at "/en"
  localePrefix: "as-needed",
  // Arabic must load first for every guest, regardless of
  // browser language — switching to English is always one tap.
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
