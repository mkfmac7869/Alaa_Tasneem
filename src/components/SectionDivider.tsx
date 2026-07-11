import WeddingMonogram from "./WeddingMonogram";

export default function SectionDivider({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-6 ${className ?? ""}`}
      aria-hidden
    >
      <span className="hairline-h w-16" />
      <WeddingMonogram
        variant="mark"
        className="w-6 text-taupe"
        strokeWidth={2.6}
      />
      <span className="hairline-h w-16" />
    </div>
  );
}
