import { MapPin } from "lucide-react";

/**
 * Primary directions button — opens the venue in the guest's maps
 * app of choice (Google Maps link; iOS offers to hand off).
 */
export default function MapButton({
  href,
  label,
  tone = "dark",
}: {
  href: string;
  label: string;
  tone?: "dark" | "light";
}) {
  const toneClass =
    tone === "dark"
      ? "border-ivory/40 text-ivory hover:bg-ivory hover:text-charcoal"
      : "border-ink/25 text-ink hover:border-olive hover:text-olive-deep";

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex min-h-12 items-center justify-center gap-2.5 rounded-full border px-9 text-sm transition-colors ${toneClass}`}
    >
      <MapPin className="h-4 w-4" strokeWidth={1.5} aria-hidden />
      {label}
    </a>
  );
}
