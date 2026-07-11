"use client";

import { useLocale, useTranslations } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";

export default function LanguageSwitcher() {
  const t = useTranslations("lang");
  const locale = useLocale() as "ar" | "en";
  const router = useRouter();
  const pathname = usePathname();

  const other = locale === "ar" ? "en" : "ar";

  return (
    <button
      type="button"
      onClick={() => router.replace(pathname, { locale: other, scroll: false })}
      aria-label={t("ariaLabel")}
      lang={other}
      className="fixed top-5 end-5 z-40 min-h-10 rounded-full border border-ink/15 bg-ivory/85 px-5 text-[13px] text-ink shadow-sm backdrop-blur-sm transition-colors hover:border-olive hover:text-olive-deep"
      style={{
        fontFamily:
          other === "ar" ? "var(--font-plex-arabic)" : "var(--font-manrope)",
      }}
    >
      {t("switchTo")}
    </button>
  );
}
