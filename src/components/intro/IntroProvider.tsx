"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import GardenGateIntro from "./GardenGateIntro";
import {
  safeSessionGet,
  safeSessionRemove,
  safeSessionSet,
} from "@/lib/storage";
import { musicPreference, startMusic } from "@/lib/audio";

/**
 * Survives soft navigations (language switch) so the envelope
 * only ever plays once per visit.
 */
const introMemory = { opened: false };

const IntroContext = createContext<{
  revealed: boolean;
  replayIntro: () => void;
}>({ revealed: false, replayIntro: () => {} });

export function useIntro() {
  return useContext(IntroContext);
}

export default function IntroProvider({ children }: { children: ReactNode }) {
  const [overlayMounted, setOverlayMounted] = useState(true);
  const [revealed, setRevealed] = useState(false);

  // Returning within the session (or after a language switch):
  // drop the overlay before first paint, no flash.
  useLayoutEffect(() => {
    if (introMemory.opened || safeSessionGet("at-intro") === "opened") {
      introMemory.opened = true;
      setOverlayMounted(false);
      setRevealed(true);
    }
  }, []);

  // If the envelope was skipped this session, the guest never made
  // the gesture that starts the music — start it (softly) on their
  // very first interaction instead.
  useEffect(() => {
    if (!introMemory.opened) return;
    if (musicPreference() === "off") return;

    const kick = () => {
      void startMusic(1200);
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("keydown", kick);
    };
    window.addEventListener("pointerdown", kick);
    window.addEventListener("keydown", kick);
    return () => {
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("keydown", kick);
    };
  }, []);

  useEffect(() => {
    if (!overlayMounted) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [overlayMounted]);

  const handleOpened = () => {
    introMemory.opened = true;
    safeSessionSet("at-intro", "opened");
    setRevealed(true);
  };

  const handleFinished = () => {
    setOverlayMounted(false);
    // Hand keyboard focus to the invitation the guest just opened
    requestAnimationFrame(() => {
      document.querySelector<HTMLElement>("main")?.focus();
    });
  };

  /** Replay the envelope opening from the very beginning. */
  const replayIntro = () => {
    introMemory.opened = false;
    safeSessionRemove("at-intro");
    window.scrollTo({ top: 0, behavior: "auto" });
    setRevealed(false);
    setOverlayMounted(true);
  };

  return (
    <IntroContext.Provider value={{ revealed, replayIntro }}>
      {children}
      {overlayMounted && (
        <GardenGateIntro onOpened={handleOpened} onFinished={handleFinished} />
      )}
    </IntroContext.Provider>
  );
}
