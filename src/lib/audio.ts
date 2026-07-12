/**
 * A single shared <audio> element that survives React remounts —
 * switching language must never restart the track.
 */
import { weddingConfig } from "@/config/wedding";
import { safeSessionGet, safeSessionSet } from "./storage";

export type AudioSnapshot = { playing: boolean; available: boolean };

const PREF_KEY = "at-music";
const TARGET_VOLUME = 0.25;

let el: HTMLAudioElement | null = null;
let snapshot: AudioSnapshot = { playing: false, available: true };
const listeners = new Set<() => void>();
let fadeRaf: number | null = null;
let wasPlayingBeforeHidden = false;

const SERVER_SNAPSHOT: AudioSnapshot = { playing: false, available: true };

function emit(next: Partial<AudioSnapshot>) {
  snapshot = { ...snapshot, ...next };
  listeners.forEach((listener) => listener());
}

export function subscribeAudio(listener: () => void): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function getAudioSnapshot(): AudioSnapshot {
  return snapshot;
}

export function getServerAudioSnapshot(): AudioSnapshot {
  return SERVER_SNAPSHOT;
}

function cancelFade() {
  if (fadeRaf !== null) {
    cancelAnimationFrame(fadeRaf);
    fadeRaf = null;
  }
}

function ensureElement(): HTMLAudioElement | null {
  if (typeof window === "undefined") return null;
  if (el) return el;

  el = new Audio(weddingConfig.musicUrl);
  el.loop = true;
  // Metadata only until the guest actually starts the music — enough
  // to discover a missing file without downloading the whole track.
  el.preload = "metadata";
  el.volume = 0;
  el.addEventListener("error", () => {
    emit({ playing: false, available: false });
  });

  // Keep the store honest when the OS pauses/resumes us directly
  // (headphones unplugged, call interruptions, media keys).
  el.addEventListener("pause", () => {
    if (snapshot.playing && !document.hidden) emit({ playing: false });
  });
  el.addEventListener("play", () => {
    if (!snapshot.playing && snapshot.available) emit({ playing: true });
  });

  // Be a considerate guest: silence when the page is hidden
  document.addEventListener("visibilitychange", () => {
    if (!el) return;
    if (document.hidden) {
      wasPlayingBeforeHidden = snapshot.playing;
      // A stop-fade may still be mid-flight; rAF freezes in hidden
      // tabs, so settle the element state deterministically here.
      cancelFade();
      if (!snapshot.playing) el.volume = 0;
      if (!el.paused) el.pause();
    } else if (wasPlayingBeforeHidden && snapshot.playing) {
      void el.play().catch(() => {});
      if (el.volume < TARGET_VOLUME) fadeTo(TARGET_VOLUME, 600, false);
    }
  });

  return el;
}

/** Create the element early so a missing file hides the control. */
export function probeAudio(): void {
  ensureElement();
}

function fadeTo(target: number, ms: number, pauseAtZero: boolean) {
  if (!el) return;
  cancelFade();
  const from = el.volume;
  const startedAt = performance.now();

  const step = (now: number) => {
    if (!el) return;
    const progress = Math.min(1, (now - startedAt) / ms);
    // Clamp: floating-point drift must never leave [0, 1]
    el.volume = Math.min(1, Math.max(0, from + (target - from) * progress));
    if (progress < 1) {
      fadeRaf = requestAnimationFrame(step);
    } else {
      fadeRaf = null;
      if (pauseAtZero && target === 0) el.pause();
    }
  };

  fadeRaf = requestAnimationFrame(step);
}

export function musicPreference(): "on" | "off" | null {
  if (typeof window === "undefined") return null;
  return (safeSessionGet(PREF_KEY) as "on" | "off" | null) ?? null;
}

export async function startMusic(fadeMs = 2400): Promise<void> {
  const audio = ensureElement();
  if (!audio || !snapshot.available) return;
  try {
    audio.preload = "auto";
    await audio.play();
    safeSessionSet(PREF_KEY, "on");
    emit({ playing: true });
    fadeTo(TARGET_VOLUME, fadeMs, false);
  } catch {
    // Autoplay policy or a missing file — the site stays elegant in silence
  }
}

export function stopMusic(fadeMs = 500): void {
  if (!el) return;
  safeSessionSet(PREF_KEY, "off");
  emit({ playing: false });
  fadeTo(0, fadeMs, true);
}

export function toggleMusic(): void {
  if (snapshot.playing) {
    stopMusic();
  } else {
    void startMusic(900);
  }
}
