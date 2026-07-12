import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Reveal from "./Reveal";
import Logo from "./Logo";
import { coupleNames } from "@/config/wedding";
import { formatShortDate } from "@/lib/dates";

export default function ClosingSection() {
  const t = useTranslations("closing");
  const locale = useLocale() as "ar" | "en";
  const couple = coupleNames(locale);

  return (
    <section className="texture-paper relative overflow-hidden bg-ivory px-6 py-32 text-center sm:py-40">
      <Image
        src="/images/floral-bouquet.webp"
        alt=""
        width={720}
        height={720}
        aria-hidden
        className="pointer-events-none absolute -start-12 -bottom-14 w-[52vw] max-w-[380px] -scale-y-100"
      />
      <Image
        src="/images/floral-bouquet.webp"
        alt=""
        width={720}
        height={720}
        aria-hidden
        className="pointer-events-none absolute -end-14 -top-12 w-[44vw] max-w-[320px] -scale-x-100 opacity-85"
      />

      <div className="relative z-10 mx-auto max-w-xl">
        <Reveal>
          <Logo
            className="mx-auto h-28 w-auto text-sage-deep sm:h-32"
            title={t("monogramAlt", { couple })}
          />
          <p className="mt-12 text-balance font-display text-3xl leading-[1.7] text-ink sm:text-4xl">
            {t("message")}
          </p>
          <div className="hairline-h mx-auto mt-12 w-16" />
          <p className="mt-10 font-display text-xl text-sage-deep">{couple}</p>
          <p className="lining-nums mt-3 text-xs tracking-[0.25em] text-ink-soft">
            {formatShortDate(locale)}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
