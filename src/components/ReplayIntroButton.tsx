"use client";

import { MailOpen } from "lucide-react";
import { useTranslations } from "next-intl";
import { useIntro } from "./intro/IntroProvider";

/** Lets guests relive the envelope opening whenever they like. */
export default function ReplayIntroButton() {
  const t = useTranslations("intro");
  const { revealed, replayIntro } = useIntro();

  // Hidden while the envelope itself is on screen
  if (!revealed) return null;

  return (
    <button
      type="button"
      onClick={replayIntro}
      aria-label={t("replay")}
      title={t("replay")}
      className="fixed bottom-5 start-5 z-40 grid h-11 w-11 place-items-center rounded-full border border-ink/15 bg-ivory/85 text-ink shadow-sm backdrop-blur-sm transition-colors hover:border-olive hover:text-olive-deep"
    >
      <MailOpen className="h-[18px] w-[18px]" strokeWidth={1.6} aria-hidden />
    </button>
  );
}
