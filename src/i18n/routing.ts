import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["ar", "en"],
  defaultLocale: "ar",
  // Static hosting: every page lives under its locale prefix and
  // "/" is redirected to /ar by firebase.json. Arabic loads first
  // for every guest regardless of browser language.
  localePrefix: "always",
  localeDetection: false,
});

export type AppLocale = (typeof routing.locales)[number];
