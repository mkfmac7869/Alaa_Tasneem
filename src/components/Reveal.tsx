"use client";

import type { ReactNode } from "react";
import { useInView } from "@/lib/motion";

/** Gentle rise-and-settle as content enters the viewport. */
export default function Reveal({
  children,
  className = "",
  delay = 0,
  from,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  /** Slide in from a side instead of from below */
  from?: "left" | "right";
}) {
  const { ref, inView } = useInView<HTMLDivElement>();
  const direction = from ? `from-${from}` : "";

  return (
    <div
      ref={ref}
      className={`reveal ${direction} ${inView ? "is-shown" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}s` } : undefined}
    >
      {children}
    </div>
  );
}
