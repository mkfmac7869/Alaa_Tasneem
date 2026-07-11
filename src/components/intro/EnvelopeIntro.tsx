"use client";

import { useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import WeddingMonogram from "../WeddingMonogram";
import { coupleNames } from "@/config/wedding";
import { formatShortDate } from "@/lib/dates";
import { musicPreference, startMusic } from "@/lib/audio";
import { useReducedMotionPref } from "@/lib/motion";

type Phase = "loading" | "sealed" | "opening" | "exit";

export default function EnvelopeIntro({
  onOpened,
  onFinished,
}: {
  onOpened: () => void;
  onFinished: () => void;
}) {
  const t = useTranslations("intro");
  const locale = useLocale() as "ar" | "en";
  const reduced = useReducedMotionPref();

  const [phase, setPhase] = useState<Phase>("loading");
  const [flapBehind, setFlapBehind] = useState(false);
  const timeouts = useRef<number[]>([]);
  const openedFired = useRef(false);
  const finishedFired = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);

  const couple = coupleNames(locale);

  // The overlay is a modal dialog: give it real focus behaviour
  useEffect(() => {
    if (phase === "sealed") openButtonRef.current?.focus();
  }, [phase]);

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Escape") {
      skip();
      return;
    }
    if (event.key !== "Tab") return;
    const buttons = overlayRef.current?.querySelectorAll<HTMLElement>("button");
    if (!buttons || buttons.length === 0) return;
    const first = buttons[0];
    const last = buttons[buttons.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  useEffect(() => {
    const pending = timeouts.current;
    return () => pending.forEach((id) => clearTimeout(id));
  }, []);

  // Loading → sealed once fonts have settled (1.6 s at most)
  useEffect(() => {
    let advanced = false;
    const advance = () => {
      if (advanced) return;
      advanced = true;
      setPhase((p) => (p === "loading" ? "sealed" : p));
    };
    timeouts.current.push(window.setTimeout(advance, 1600));
    document.fonts?.ready.then(() => {
      timeouts.current.push(window.setTimeout(advance, 350));
    });
  }, []);

  const fireOpened = () => {
    if (openedFired.current) return;
    openedFired.current = true;
    onOpened();
  };

  const fireFinished = () => {
    if (finishedFired.current) return;
    finishedFired.current = true;
    onFinished();
  };

  const beginExit = () => {
    setPhase("exit");
    fireOpened();
    // Safety net in case the transitionend event is swallowed
    timeouts.current.push(window.setTimeout(fireFinished, 1200));
  };

  const open = () => {
    if (phase !== "sealed") return;
    // Music may only begin from a user gesture — this is that gesture
    if (musicPreference() !== "off") void startMusic();

    if (reduced) {
      beginExit();
      return;
    }

    setPhase("opening");
    timeouts.current.push(
      window.setTimeout(() => setFlapBehind(true), 850),
      window.setTimeout(beginExit, 2150)
    );
  };

  const skip = () => {
    if (phase === "sealed" && musicPreference() !== "off") void startMusic();
    if (phase === "sealed" || phase === "opening") beginExit();
  };

  const opening = phase === "opening" || phase === "exit";

  return (
    <div
      ref={overlayRef}
      data-intro-overlay
      className={`texture-paper fixed inset-0 z-[70] flex items-center justify-center bg-ivory ${
        phase === "exit" ? "intro-exit" : ""
      }`}
      onKeyDown={handleKeyDown}
      onTransitionEnd={(event) => {
        if (
          phase === "exit" &&
          event.target === event.currentTarget &&
          event.propertyName === "opacity"
        ) {
          fireFinished();
        }
      }}
      role="dialog"
      aria-modal="true"
      aria-label={t("loadingLabel", { couple })}
    >
      {phase === "loading" ? (
        <div className="flex flex-col items-center gap-7">
          <div className="animate-breathe w-24 text-olive-deep">
            <WeddingMonogram title={t("loadingLabel", { couple })} />
          </div>
          <div className="hairline-h w-16" />
        </div>
      ) : (
        <div
          className={`env-scene flex flex-col items-center gap-10 px-6 ${
            opening ? "env-open" : ""
          }`}
        >
          <div
            className="relative w-[min(86vw,420px)] cursor-pointer"
            style={{ aspectRatio: "10 / 7" }}
            onClick={open}
            aria-hidden
          >
            {/* soft ground shadow */}
            <div className="absolute -bottom-7 left-1/2 h-8 w-3/4 -translate-x-1/2 rounded-[100%] bg-charcoal/15 blur-xl" />

            {/* envelope back */}
            <div className="absolute inset-0 rounded-[5px] bg-parchment shadow-[inset_0_0_28px_rgba(58,54,44,0.10)]" />

            {/* the invitation card */}
            <div className="env-card absolute inset-x-[7%] top-[6%] bottom-[8%] z-10 flex flex-col items-center justify-center gap-3 rounded-[3px] bg-ivory px-6 text-center shadow-[0_10px_28px_rgba(58,54,44,0.16)]">
              <WeddingMonogram className="w-14 text-olive-deep" />
              <p className="font-display text-xl text-ink">{couple}</p>
              <p className="lining-nums text-[11px] tracking-[0.18em] text-ink-soft">
                {formatShortDate(locale)}
              </p>
            </div>

            {/* pocket — side and bottom folds over the card */}
            <div className="pointer-events-none absolute inset-0 z-20">
              <div
                className="absolute inset-0 bg-cream"
                style={{ clipPath: "polygon(0% 0%, 50% 52%, 0% 100%)" }}
              />
              <div
                className="absolute inset-0 bg-cream"
                style={{ clipPath: "polygon(100% 0%, 50% 52%, 100% 100%)" }}
              />
              <div
                className="absolute inset-0 rounded-b-[5px] bg-cream"
                style={{ clipPath: "polygon(0% 100%, 50% 44%, 100% 100%)" }}
              />
            </div>

            {/* top flap */}
            <div
              className={`env-flap absolute inset-x-0 top-0 h-[54%] bg-stone ${
                flapBehind ? "z-[5]" : "z-30"
              }`}
              style={{ clipPath: "polygon(0 0, 100% 0, 50% 100%)" }}
            />

            {/* wax seal with the monogram */}
            <div
              className="env-seal absolute z-40 grid h-16 w-16 place-items-center rounded-full"
              style={{
                left: "calc(50% - 32px)",
                top: "calc(54% - 32px)",
                background:
                  "radial-gradient(circle at 35% 30%, #57604a, #494e3b 62%, #3d4232)",
                boxShadow:
                  "0 2px 10px rgba(32,30,25,0.35), inset 0 1px 2px rgba(247,242,233,0.25), inset 0 -2px 6px rgba(32,30,25,0.4)",
              }}
            >
              <WeddingMonogram
                variant="seal"
                className="h-9 w-9 text-ivory/90"
                strokeWidth={3.2}
              />
            </div>
          </div>

          <button
            ref={openButtonRef}
            type="button"
            onClick={open}
            className="env-btn min-h-12 rounded-full border border-ink/25 px-10 py-3 text-sm text-ink hover:border-olive hover:text-olive-deep"
            aria-label={t("openAria", { couple })}
          >
            {t("open")}
          </button>
        </div>
      )}

      {phase !== "loading" && phase !== "exit" && (
        <button
          type="button"
          onClick={skip}
          className="absolute top-5 end-5 p-2 text-xs text-ink-soft underline-offset-4 hover:underline"
        >
          {t("skip")}
        </button>
      )}
    </div>
  );
}
