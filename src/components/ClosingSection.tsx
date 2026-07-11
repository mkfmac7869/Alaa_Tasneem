import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Reveal from "./Reveal";
import DrawnMonogram from "./DrawnMonogram";
import { coupleNames } from "@/config/wedding";
import { formatShortDate } from "@/lib/dates";

export default function ClosingSection() {
  const t = useTranslations("closing");
  const locale = useLocale() as "ar" | "en";
  const couple = coupleNames(locale);

  return (
    <section className="relative overflow-hidden bg-charcoal px-6 py-32 text-center text-ivory sm:py-40">
      <Image
        src="/images/overlay-evening-bokeh.webp"
        alt=""
        fill
        sizes="100vw"
        className="object-cover opacity-25 mix-blend-screen"
        aria-hidden
      />
      <div className="relative z-10 mx-auto max-w-xl">
        <DrawnMonogram title={t("monogramAlt", { couple })} />
        <Reveal>
          <p className="mt-12 text-balance font-display text-3xl leading-[1.7] sm:text-4xl">
            {t("message")}
          </p>
          <div className="hairline-h-light mx-auto mt-12 w-16" />
          <p className="mt-10 font-display text-xl text-ivory/85">{couple}</p>
          <p className="lining-nums mt-3 text-xs tracking-[0.25em] text-ivory/70">
            {formatShortDate(locale)}
          </p>
        </Reveal>
      </div>
    </section>
  );
}
