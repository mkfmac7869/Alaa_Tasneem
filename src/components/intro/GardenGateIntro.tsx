"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { CSSProperties } from "react";
import { useLocale, useTranslations } from "next-intl";
import Logo from "../Logo";
import { coupleNames } from "@/config/wedding";
import { formatGregorianDate } from "@/lib/dates";
import { musicPreference, startMusic } from "@/lib/audio";
import { useReducedMotionPref } from "@/lib/motion";

type Phase = "loading" | "sealed" | "opening" | "exit";

/**
 * The cinematic opening. A carved oak garden door wrapped in ivory
 * roses swings open onto a sunlit courtyard and white doves fly out
 * carrying the good news — played as a generated film whose first
 * frame is the closed photograph and whose last frame is the open
 * one, so the moment blends seamlessly into the invitation.
 *
 * If the film cannot play (data saver, save-data, slow network,
 * reduced motion), a 3D leaf-swing fallback runs instead.
 */

/** Arch opening inside the master plates, as fractions of the stage. */
const DOOR = { left: 18.5, top: 18.5, width: 63, height: 68 };

/** No lingering hold — the scene flows straight into the invitation
 *  the moment the film ends; the names are already up by then. */
const HOLD_MS = 0;

const DOVES: Array<{
  src: string;
  className: string;
  delay: number;
  duration: number;
}> = [
  {
    src: "/images/doves-far.webp",
    className: "inset-x-[14%] top-[20%] h-[56%]",
    delay: 1.05,
    duration: 2.6,
  },
  {
    src: "/images/doves-near.webp",
    className: "inset-x-[6%] top-[24%] h-[60%]",
    delay: 1.35,
    duration: 2.4,
  },
  {
    src: "/images/dove-solo.webp",
    className: "left-[10%] top-[42%] h-[34%] w-[45%]",
    delay: 1.65,
    duration: 2.1,
  },
];

export default function GardenGateIntro({
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
  const [videoReady, setVideoReady] = useState(false);
  const [videoFailed, setVideoFailed] = useState(false);
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [contentOn, setContentOn] = useState(false);

  const timeouts = useRef<number[]>([]);
  const openedFired = useRef(false);
  const finishedFired = useRef(false);
  const overlayRef = useRef<HTMLDivElement>(null);
  const openButtonRef = useRef<HTMLButtonElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const exitStarted = useRef(false);

  const beginExit = () => {
    setPhase("exit");
    setContentOn(true);
    fireOpened();
    // Safety net in case the transitionend event is swallowed
    timeouts.current.push(window.setTimeout(fireFinished, 1900));
  };

  /** Hold on the final frame — names + date over the garden — so the
   *  guest can read, then dissolve gently into the invitation. */
  const holdThenExit = () => {
    if (exitStarted.current) return;
    exitStarted.current = true;
    setContentOn(true);
    timeouts.current.push(window.setTimeout(beginExit, HOLD_MS));
  };

  /** 3D leaf swing + layered doves — used when the film can't play. */
  const openWithCss = () => {
    setPhase("opening");
    // names appear amid the doves, then flow straight into the page
    timeouts.current.push(
      window.setTimeout(() => setContentOn(true), 2200),
      window.setTimeout(holdThenExit, 3800)
    );
  };

  const open = () => {
    if (phase !== "sealed") return;
    // Music may only begin from a user gesture — this is that gesture
    if (musicPreference() !== "off") void startMusic();

    if (reduced) {
      setPhase("opening");
      setContentOn(true);
      timeouts.current.push(window.setTimeout(beginExit, 3200));
      return;
    }

    const video = videoRef.current;
    if (videoReady && !videoFailed && video) {
      // Start playback inside the gesture; only reveal the film once
      // it truly begins (its first frame is the closed door, so the
      // hand-off from the still photograph is seamless).
      video
        .play()
        .then(() => {
          setPhase("opening");
          setVideoPlaying(true);
          const total = Number.isFinite(video.duration)
            ? video.duration * 1000
            : 7000;
          // Safety: hold-then-exit even if `ended` never fires
          timeouts.current.push(
            window.setTimeout(holdThenExit, total + 1200)
          );
        })
        .catch(() => {
          setVideoFailed(true);
          openWithCss();
        });
      return;
    }

    openWithCss();
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
  const cinematic = videoReady && !videoFailed && !reduced;

  return (
    <div
      ref={overlayRef}
      data-intro-overlay
      className={`fixed inset-0 z-[70] flex items-center justify-center overflow-hidden bg-ivory ${
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
        <div className="texture-paper absolute inset-0 flex flex-col items-center justify-center gap-7 bg-ivory">
          <div className="animate-breathe h-28 text-sage-deep">
            <Logo
              className="h-full w-auto"
              title={t("loadingLabel", { couple })}
            />
          </div>
          <div className="hairline-h w-16" />
        </div>
      ) : (
        <>
          {/* soft-focus fill for wide screens beyond the stage */}
          <Image
            src="/images/door-stage-open.webp"
            alt=""
            fill
            priority
            aria-hidden
            sizes="100vw"
            className="pointer-events-none scale-110 object-cover opacity-80 blur-2xl"
          />
          <div
            className="pointer-events-none absolute inset-0 bg-ivory/20"
            aria-hidden
          />

          {/* ── the stage: fixed aspect, geometry-stable ─── */}
          <div
            className={`relative h-full shrink-0 ${
              opening ? "stage-open" : ""
            }`}
            style={{ aspectRatio: "768 / 1376" }}
            onClick={open}
            aria-hidden
          >
            {/* the courtyard, waiting behind the doors */}
            <Image
              src="/images/door-stage-open.webp"
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 56vh, 125vw"
              className="object-fill"
            />

            {/* sealed: the closed photograph covers the courtyard until
                the doors open — in BOTH the film and fallback paths */}
            <Image
              src="/images/door-stage-closed.webp"
              alt=""
              fill
              priority
              sizes="(min-width: 768px) 56vh, 125vw"
              className="stage-closed z-10 object-fill"
            />

            {/* fallback choreography — only when the film can't play */}
            {!cinematic && (
              <>
                <div
                  className="stage-leaf stage-leaf-left z-20"
                  style={{
                    left: `${DOOR.left}%`,
                    top: `${DOOR.top}%`,
                    width: `${DOOR.width / 2 + 0.2}%`,
                    height: `${DOOR.height}%`,
                  }}
                >
                  <Image
                    src="/images/door-leaf-left.webp"
                    alt=""
                    fill
                    priority
                    sizes="30vh"
                    className="object-fill"
                  />
                </div>
                <div
                  className="stage-leaf stage-leaf-right z-20"
                  style={{
                    left: `${DOOR.left + DOOR.width / 2 - 0.2}%`,
                    top: `${DOOR.top}%`,
                    width: `${DOOR.width / 2 + 0.2}%`,
                    height: `${DOOR.height}%`,
                  }}
                >
                  <Image
                    src="/images/door-leaf-right.webp"
                    alt=""
                    fill
                    priority
                    sizes="30vh"
                    className="object-fill"
                  />
                </div>
                {DOVES.map(({ src, className, delay, duration }, i) => (
                  <div
                    key={i}
                    className={`dove-layer absolute z-40 ${className}`}
                    style={
                      {
                        "--dove-delay": `${delay}s`,
                        "--dove-duration": `${duration}s`,
                      } as CSSProperties
                    }
                  >
                    <Image
                      src={src}
                      alt=""
                      fill
                      sizes="60vh"
                      className="object-contain"
                    />
                  </div>
                ))}
              </>
            )}

            {/* the film: closed photograph → doors open → doves fly */}
            {!reduced && (
              // eslint-disable-next-line jsx-a11y/media-has-caption
              <video
                ref={videoRef}
                className={`stage-video absolute inset-0 z-[25] h-full w-full object-cover ${
                  videoPlaying ? "is-playing" : ""
                }`}
                src="/videos/door-opening.mp4"
                poster="/images/door-stage-closed.webp"
                muted
                playsInline
                preload="auto"
                onCanPlayThrough={() => setVideoReady(true)}
                onError={() => setVideoFailed(true)}
                onEnded={holdThenExit}
                onTimeUpdate={(event) => {
                  const v = event.currentTarget;
                  if (
                    Number.isFinite(v.duration) &&
                    v.duration - v.currentTime < 3.6
                  ) {
                    setContentOn(true);
                  }
                }}
              />
            )}

            {/* the couple's mark on the seam, released on opening */}
            <div
              className="stage-latch absolute z-30 grid h-16 w-16 place-items-center rounded-full"
              style={{
                left: "calc(50% - 32px)",
                top: "calc(50% - 32px)",
                background:
                  "radial-gradient(circle at 35% 30%, #57604a, #494e3b 62%, #3d4232)",
                boxShadow:
                  "0 3px 12px rgba(32,30,25,0.45), inset 0 1px 2px rgba(247,242,233,0.28), inset 0 -2px 7px rgba(32,30,25,0.42)",
              }}
            >
              <span
                className="pointer-events-none absolute inset-[5px] rounded-full border border-ivory/30"
                aria-hidden
              />
              <Logo className="h-10 w-auto text-ivory/95" />
            </div>

            {/* the invitation, standing in the doorway */}
            <div
              className={`stage-content absolute inset-x-[8%] top-[30%] z-50 text-center text-ivory ${
                contentOn ? "is-on" : ""
              }`}
            >
              <div
                className="pointer-events-none absolute -inset-x-10 -inset-y-12 bg-[radial-gradient(ellipse_at_center,rgba(32,30,25,0.5),transparent_72%)]"
                aria-hidden
              />
              <div className="relative">
                <Logo className="mx-auto h-14 w-auto text-ivory" />
                <p className="kicker mt-4 !text-ivory/85">{t("stageKicker")}</p>
                <p
                  className={`mt-3 font-display text-ivory ${
                    locale === "ar" ? "text-5xl leading-[1.4]" : "text-4xl"
                  }`}
                  style={{ textShadow: "0 2px 18px rgba(32,30,25,0.55)" }}
                >
                  {couple}
                </p>
                <div
                  className="mx-auto mt-5 h-px w-14 bg-ivory/50"
                  aria-hidden
                />
                <p className="lining-nums mt-4 text-sm tracking-[0.2em] text-ivory/95">
                  {formatGregorianDate(locale)}
                </p>
              </div>
            </div>
          </div>

          {/* controls over the scene */}
          <button
            ref={openButtonRef}
            type="button"
            onClick={open}
            className="stage-btn absolute bottom-9 left-1/2 min-h-12 -translate-x-1/2 rounded-full border border-ink/20 bg-ivory/90 px-11 py-3 text-sm text-ink shadow-lg backdrop-blur-sm hover:border-olive hover:text-olive-deep"
            aria-label={t("openAria", { couple })}
          >
            {t("open")}
          </button>
        </>
      )}

      {/* ivory light-wash that blends the exit into the invitation */}
      <div
        className="stage-veil pointer-events-none absolute inset-0 z-[60] bg-ivory"
        aria-hidden
      />

      {phase !== "loading" && phase !== "exit" && (
        <button
          type="button"
          onClick={skip}
          className="absolute top-5 end-5 z-[65] rounded-full bg-ivory/70 px-3 py-2 text-xs text-ink-soft backdrop-blur-sm underline-offset-4 hover:underline"
        >
          {t("skip")}
        </button>
      )}
    </div>
  );
}
