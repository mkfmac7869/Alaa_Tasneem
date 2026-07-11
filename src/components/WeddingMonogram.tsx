/**
 * The A&T monogram, drawn by hand as SVG paths.
 *
 * A large open "A" carries a smaller "T" woven through its upper
 * triangle: the T's bar passes over both legs of the A, while the
 * A's crossbar passes over the T's stem — a true over-under weave,
 * framed by a fine double ring with an olive sprig beneath.
 *
 * Path data is exported so other components (closing animation,
 * favicon, print assets) can reuse the exact same drawing.
 */

export const MONOGRAM_VIEWBOX = "0 0 120 120";

export const MONOGRAM_PATHS = {
  /* A — apex + legs, with gaps where the T bar weaves over them */
  aLegs:
    "M 32 92 L 51.4 46.2 M 53.3 41.8 L 60 26 L 66.7 41.8 M 68.6 46.2 L 88 92",
  /* A crossbar — continuous: it passes over the T stem */
  aBar: "M 44.5 68 L 75.5 68",
  /* T bar — continuous: it passes over both A legs */
  tBar: "M 44 44 L 76 44",
  /* T stem — gap where the A crossbar weaves over it */
  tStem: "M 60 44 L 60 65.8 M 60 70.2 L 60 92",
  /* End serifs for the T bar and a small foot for the stem */
  serifs: "M 44 41.6 L 44 46.4 M 76 41.6 L 76 46.4 M 56 92 L 64 92",
  /* Olive sprig below the letters */
  sprigStem: "M 45 103.5 C 53 100.5 67 100.5 75 103.5",
  sprigLeaves: [
    "M 49 101.6 C 48.4 98.2 50 95.6 52.6 94.6 C 53.2 97.8 51.8 100.4 49 101.6 Z",
    "M 56 100.4 C 55.6 97.2 57.4 94.6 60 93.8 C 60.4 97 58.8 99.6 56 100.4 Z",
    "M 64 100.4 C 66.8 99.6 68.4 97 68 93.8 C 65.4 94.6 63.6 97.2 64 100.4 Z",
    "M 71 101.6 C 73.8 100.4 75.2 97.8 74.6 94.6 C 72 95.6 70.4 98.2 71 101.6 Z",
  ],
} as const;

type MonogramVariant = "full" | "mark" | "seal";

export default function WeddingMonogram({
  variant = "full",
  className,
  title,
  strokeWidth = 2,
}: {
  variant?: MonogramVariant;
  className?: string;
  /** Accessible name; omit to mark the SVG as decorative */
  title?: string;
  strokeWidth?: number;
}) {
  const letters = (
    <g
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
    >
      <path d={MONOGRAM_PATHS.aLegs} />
      <path d={MONOGRAM_PATHS.aBar} strokeWidth={strokeWidth * 0.9} />
      <path d={MONOGRAM_PATHS.tBar} strokeWidth={strokeWidth * 0.9} />
      <path d={MONOGRAM_PATHS.tStem} />
      <path d={MONOGRAM_PATHS.serifs} strokeWidth={strokeWidth * 0.6} />
    </g>
  );

  return (
    <svg
      viewBox={MONOGRAM_VIEWBOX}
      className={className}
      role={title ? "img" : undefined}
      aria-label={title}
      aria-hidden={title ? undefined : true}
    >
      {variant !== "mark" && (
        <>
          <circle
            cx="60"
            cy="60"
            r="54"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.9"
          />
          <circle
            cx="60"
            cy="60"
            r="50"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.45"
            opacity="0.55"
          />
        </>
      )}
      {letters}
      {variant === "full" && (
        <g>
          <path
            d={MONOGRAM_PATHS.sprigStem}
            fill="none"
            stroke="currentColor"
            strokeWidth="0.9"
            strokeLinecap="round"
          />
          {MONOGRAM_PATHS.sprigLeaves.map((d) => (
            <path key={d} d={d} fill="currentColor" opacity="0.85" />
          ))}
        </g>
      )}
    </svg>
  );
}
