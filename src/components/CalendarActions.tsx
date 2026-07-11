import { useLocale, useTranslations } from "next-intl";
import Reveal from "./Reveal";
import { googleCalendarUrl, outlookCalendarUrl } from "@/lib/calendar";

function CalendarChip({
  href,
  children,
  external = false,
  download = false,
}: {
  href: string;
  children: React.ReactNode;
  external?: boolean;
  download?: boolean;
}) {
  return (
    <a
      href={href}
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
      {...(download ? { download: "alaa-tasneem-wedding.ics" } : {})}
      className="inline-flex min-h-11 items-center rounded-full border border-ink/20 px-6 text-sm text-ink transition-colors hover:border-olive hover:text-olive-deep"
    >
      {children}
    </a>
  );
}

export default function CalendarActions() {
  const t = useTranslations("calendar");
  const locale = useLocale() as "ar" | "en";
  const icsHref = `/api/calendar/${locale}`;

  return (
    <section className="texture-paper bg-cream/70 px-6 py-24 text-center sm:py-28">
      <Reveal className="mx-auto max-w-xl">
        <p className="kicker">{t("kicker")}</p>
        <h2 className="mt-6 font-display text-2xl text-ink sm:text-3xl">
          {t("title")}
        </h2>
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <CalendarChip href={googleCalendarUrl(locale)} external>
            {t("google")}
          </CalendarChip>
          <CalendarChip href={icsHref}>{t("apple")}</CalendarChip>
          <CalendarChip href={outlookCalendarUrl(locale)} external>
            {t("outlook")}
          </CalendarChip>
          <CalendarChip href={icsHref} download>
            {t("ics")}
          </CalendarChip>
        </div>
      </Reveal>
    </section>
  );
}
