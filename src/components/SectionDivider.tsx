import Logo from "./Logo";

export default function SectionDivider({ className }: { className?: string }) {
  return (
    <div
      className={`flex items-center justify-center gap-6 ${className ?? ""}`}
      aria-hidden
    >
      <span className="hairline-h w-16" />
      <Logo className="h-7 w-auto text-sage" />
      <span className="hairline-h w-16" />
    </div>
  );
}
