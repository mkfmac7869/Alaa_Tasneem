"use client";

import { useEffect, useSyncExternalStore } from "react";
import { useTranslations } from "next-intl";
import {
  getAudioSnapshot,
  getServerAudioSnapshot,
  probeAudio,
  subscribeAudio,
  toggleMusic,
} from "@/lib/audio";

export default function MusicControl() {
  const t = useTranslations("music");
  const { playing, available } = useSyncExternalStore(
    subscribeAudio,
    getAudioSnapshot,
    getServerAudioSnapshot
  );

  // Discover a missing track up front so the button never ghosts
  useEffect(() => {
    probeAudio();
  }, []);

  // No licensed track in place yet (or it failed to load): stay invisible
  if (!available) return null;

  const label = playing ? t("pause") : t("play");

  return (
    <button
      type="button"
      onClick={toggleMusic}
      aria-label={label}
      title={label}
      className="fixed bottom-5 end-5 z-40 grid h-11 w-11 place-items-center rounded-full border border-ink/15 bg-ivory/85 text-ink shadow-sm backdrop-blur-sm transition-colors hover:border-olive"
    >
      <span className="flex h-4 items-end gap-[3px]" aria-hidden>
        {[0, 1, 2].map((i) => (
          <span
            key={i}
            className={`eq-bar w-[2px] rounded-full bg-current ${
              playing ? "" : "eq-bar-paused"
            }`}
            style={{ animationDelay: `${i * 0.18}s`, height: "100%" }}
          />
        ))}
      </span>
    </button>
  );
}
