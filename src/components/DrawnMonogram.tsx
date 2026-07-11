"use client";

import { MONOGRAM_PATHS, MONOGRAM_VIEWBOX } from "./WeddingMonogram";
import { useInView } from "@/lib/motion";

/** The monogram redraws itself, stroke by stroke, as guests arrive. */
export default function DrawnMonogram({ title }: { title: string }) {
  const { ref, inView } = useInView<SVGSVGElement>("-60px 0px");

  const strokes = [
    { d: MONOGRAM_PATHS.aLegs, width: 2, delay: 0.35 },
    { d: MONOGRAM_PATHS.tBar, width: 1.8, delay: 0.65 },
    { d: MONOGRAM_PATHS.tStem, width: 2, delay: 0.9 },
    { d: MONOGRAM_PATHS.aBar, width: 1.8, delay: 1.15 },
    { d: MONOGRAM_PATHS.serifs, width: 1.2, delay: 1.35 },
    { d: MONOGRAM_PATHS.sprigStem, width: 0.9, delay: 1.65 },
  ];

  return (
    <svg
      ref={ref}
      viewBox={MONOGRAM_VIEWBOX}
      className={`mx-auto w-24 text-ivory ${inView ? "is-drawn" : ""}`}
      role="img"
      aria-label={title}
    >
      <circle
        cx="60"
        cy="60"
        r="54"
        fill="none"
        stroke="currentColor"
        strokeWidth="0.9"
        pathLength={1}
        className="draw-path"
      />
      {strokes.map(({ d, width, delay }) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke="currentColor"
          strokeWidth={width}
          strokeLinecap="round"
          pathLength={1}
          className="draw-path"
          style={{ transitionDelay: `${delay}s, ${delay}s` }}
        />
      ))}
      {MONOGRAM_PATHS.sprigLeaves.map((d, i) => (
        <path
          key={d}
          d={d}
          fill="currentColor"
          className="draw-leaf"
          style={{ transitionDelay: `${1.9 + i * 0.12}s` }}
        />
      ))}
    </svg>
  );
}
