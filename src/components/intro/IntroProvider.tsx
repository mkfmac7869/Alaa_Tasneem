"use client";

import {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";
import EnvelopeIntro from "./EnvelopeIntro";
import { safeSessionGet, safeSessionSet } from "@/lib/storage";

/**
 * Survives soft navigations (language switch) so the envelope
 * only ever plays once per visit.
 */
const introMemory = { opened: false };

const IntroContext = createContext<{ revealed: boolean }>({ revealed: false });

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

  return (
    <IntroContext.Provider value={{ revealed }}>
      {children}
      {overlayMounted && (
        <EnvelopeIntro onOpened={handleOpened} onFinished={handleFinished} />
      )}
    </IntroContext.Provider>
  );
}
