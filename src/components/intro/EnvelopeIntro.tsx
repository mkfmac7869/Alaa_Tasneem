"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import Logo from "../Logo";
import FloatingSprig from "../FloatingSprig";
import { coupleNames } from "@/config/wedding";
import { formatShortDate } from "@/lib/dates";
import { musicPreference, startMusic } from "@/lib/audio";
import { useReducedMotionPref } from "@/lib/motion";

type Phase = "loading" | "sealed" | "opening" | "exit";

const PETALS = [
  { src: "/images/sprig-blossom.webp", left: "18%", delay: 1.1, size: "w-8" },
  { src: "/images/sprig-eucalyptus.webp", left: "38%", delay: 1.5, size: "w-7" },
  { src: "/images/sprig-blossom.webp", left: "60%", delay: 1.3, size: "w-9" },
  { src: "/images/sprig-eucalyptus.webp", left: "78%", delay: 1.7, size: "w-7" },
];

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

  // The overlay is a modal dialog: give it real focus behaviour
  useEffect(() => {
    if (phase === "sealed") openButtonRef.current?.focus();
  }, [phase]);

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
    timeouts.current.push(window.setTimeout(fireFinished, 1250));
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
      window.setTimeout(() => setFlapBehind(true), 1000),
      window.setTimeout(beginExit, 2450)
    );
  };

  const skip = () => {
    if (phase === "sealed" && musicPreference() !== "off") void startMusic();
    if (phase === "sealed" || phase === "opening") beginExit();
  };

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

  const opening = phase === "opening" || phase === "exit";

  return (
    <div
      ref={overlayRef}
      data-intro-overlay
      className={`texture-paper fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-ivory ${
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
      {/* dressed stationery backdrop — never an empty page */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(177,173,157,0.2),transparent_62%)]"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-3 border border-ink/15 sm:inset-5"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-[17px] border border-ink/10 sm:inset-[27px]"
        aria-hidden
      />
      <Image
        src="/images/floral-bouquet.webp"
        alt=""
        width={720}
        height={760}
        priority
        aria-hidden
        className="pointer-events-none absolute -left-10 -top-10 w-[46vw] max-w-[380px]"
      />
      <Image
        src="/images/floral-bouquet.webp"
        alt=""
        width={720}
        height={760}
        priority
        aria-hidden
        className="pointer-events-none absolute -right-12 -top-12 w-[38vw] max-w-[300px] -scale-x-100 opacity-85"
      />
      <Image
        src="/images/floral-bouquet.webp"
        alt=""
        width={720}
        height={760}
        aria-hidden
        className="pointer-events-none absolute -bottom-12 -left-12 w-[40vw] max-w-[320px] -scale-y-100 opacity-85"
      />
      <Image
        src="/images/floral-bouquet.webp"
        alt=""
        width={720}
        height={760}
        aria-hidden
        className="pointer-events-none absolute -bottom-10 -right-10 w-[46vw] max-w-[380px] rotate-180"
      />
      <FloatingSprig
        src="/images/sprig-eucalyptus.webp"
        className="left-[12%] top-[38%] w-12 opacity-60 sm:left-[18%]"
        duration={11}
        rotate={-7}
      />
      <FloatingSprig
        src="/images/sprig-blossom.webp"
        className="right-[12%] top-[58%] w-11 opacity-60 sm:right-[19%]"
        duration={13}
        delay={1.2}
        rotate={8}
      />

      {phase === "loading" ? (
        <div className="relative flex flex-col items-center gap-7">
          <div className="animate-breathe h-28 text-sage-deep">
            <Logo
              className="h-full w-auto"
              title={t("loadingLabel", { couple })}
            />
          </div>
          <div className="hairline-h w-16" />
        </div>
      ) : (
        <div
          className={`env-scene relative flex flex-col items-center gap-10 px-6 ${
            opening ? "env-open" : ""
          }`}
        >
          <div
            className="relative w-[min(86vw,540px)] cursor-pointer"
            style={{ aspectRatio: "10 / 7" }}
            onClick={open}
            aria-hidden
          >
            {/* rising petals */}
            {PETALS.map(({ src, left, delay, size }, i) => (
              <Image
                key={i}
                src={src}
                alt=""
                width={80}
                height={80}
                aria-hidden
                className={`env-petal pointer-events-none absolute top-[30%] z-[45] ${size}`}
                style={
                  { left, "--petal-delay": `${delay}s` } as React.CSSProperties
                }
              />
            ))}

            {/* soft ground shadow */}
            <div className="absolute -bottom-8 left-1/2 h-9 w-3/4 -translate-x-1/2 rounded-[100%] bg-charcoal/15 blur-xl" />

            {/* envelope back */}
            <div className="absolute inset-0 rounded-[6px] bg-parchment shadow-[inset_0_0_34px_rgba(58,54,44,0.12)]" />

            {/* the invitation card */}
            <div className="env-card absolute inset-x-[6%] top-[5%] bottom-[7%] z-10 flex flex-col items-center justify-center gap-3 overflow-hidden rounded-[3px] bg-ivory px-6 text-center shadow-[0_12px_34px_rgba(58,54,44,0.18)]">
              <div
                className="pointer-events-none absolute inset-1.5 border border-ink/10"
                aria-hidden
              />
              <Image
                src="/images/floral-bouquet.webp"
                alt=""
                width={240}
                height={253}
                aria-hidden
                className="pointer-events-none absolute -left-4 -top-4 w-24 sm:w-28"
              />
              <Image
                src="/images/floral-bouquet.webp"
                alt=""
                width={240}
                height={253}
                aria-hidden
                className="pointer-events-none absolute -bottom-4 -right-4 w-24 rotate-180 sm:w-28"
              />
              <Logo className="h-16 w-auto text-sage-deep sm:h-20" />
              <p className="font-display text-2xl text-ink sm:text-3xl">
                {couple}
              </p>
              <p className="lining-nums text-xs tracking-[0.22em] text-sage-deep">
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
                className="absolute inset-0 rounded-b-[6px] bg-[#ece4d4]"
                style={{ clipPath: "polygon(0% 100%, 50% 44%, 100% 100%)" }}
              />
            </div>

            {/* top flap */}
            <div
              className={`env-flap absolute inset-x-0 top-0 h-[54%] ${
                flapBehind ? "z-[5]" : "z-30"
              }`}
              style={{
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                background:
                  "linear-gradient(165deg, #ddd3c1 0%, #d8cdba 55%, #cfc3ad 100%)",
              }}
            />

            {/* wax seal with the couple's logo */}
            <div
              className="env-seal absolute z-40 grid h-[4.5rem] w-[4.5rem] place-items-center rounded-full"
              style={{
                left: "calc(50% - 36px)",
                top: "calc(54% - 36px)",
                background:
                  "radial-gradient(circle at 35% 30%, #57604a, #494e3b 62%, #3d4232)",
                boxShadow:
                  "0 3px 12px rgba(32,30,25,0.35), inset 0 1px 2px rgba(247,242,233,0.28), inset 0 -2px 7px rgba(32,30,25,0.42)",
              }}
            >
              <span
                className="pointer-events-none absolute inset-[5px] rounded-full border border-ivory/30"
                aria-hidden
              />
              <Logo className="h-10 w-auto text-ivory/95" />
            </div>
          </div>

          <button
            ref={openButtonRef}
            type="button"
            onClick={open}
            className="env-btn min-h-12 rounded-full border border-ink/25 bg-ivory/70 px-11 py-3 text-sm text-ink hover:border-olive hover:text-olive-deep"
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
