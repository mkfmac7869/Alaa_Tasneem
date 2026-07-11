import { useLocale, useTranslations } from "next-intl";
import Reveal from "./Reveal";
import SectionDivider from "./SectionDivider";
import { coupleNames } from "@/config/wedding";

export default function InvitationMessage() {
  const t = useTranslations("message");
  const locale = useLocale() as "ar" | "en";

  return (
    <section className="texture-paper bg-ivory px-6 py-28 sm:py-36">
      <div className="relative mx-auto max-w-2xl text-center">
        <Reveal>
          <p className="kicker">{t("kicker")}</p>
          <p className="mt-8 text-balance font-display text-2xl leading-[1.9] text-ink sm:text-[1.75rem]">
            {t("body", { couple: coupleNames(locale) })}
          </p>
        </Reveal>
        <SectionDivider className="mt-16" />
      </div>
    </section>
  );
}
