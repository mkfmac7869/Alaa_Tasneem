/**
 * A fine double-line wedding arch, drawn as crisp SVG — the
 * architectural frame the hero typography lives inside.
 */
export default function ArchFrame({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 440 560"
      preserveAspectRatio="none"
      className={className}
      aria-hidden
      fill="none"
      stroke="currentColor"
    >
      <path d="M30 560 L30 226 A190 186 0 0 1 410 226 L410 560" strokeWidth="1.4" />
      <path
        d="M46 560 L46 232 A174 170 0 0 1 394 232 L394 560"
        strokeWidth="0.8"
        opacity="0.7"
      />
      {/* small base ticks */}
      <path d="M18 560 H58 M382 560 H422" strokeWidth="1.2" />
    </svg>
  );
}
