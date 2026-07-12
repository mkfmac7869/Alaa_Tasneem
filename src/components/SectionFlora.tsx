import Image from "next/image";
import FloatingSprig from "./FloatingSprig";

type Variant = "start" | "end" | "both" | "sprigs";

/**
 * Painted botanicals for a section's edges — used to keep every
 * screen of the invitation dressed, never empty. The parent
 * section must be `relative overflow-hidden`.
 */
export default function SectionFlora({
  variant = "both",
  opacity = "opacity-70",
}: {
  variant?: Variant;
  opacity?: string;
}) {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0">
      {(variant === "start" || variant === "both") && (
        <Image
          src="/images/floral-bouquet.webp"
          alt=""
          width={720}
          height={760}
          className={`absolute -start-14 -top-12 w-[44vw] max-w-[300px] ${opacity}`}
        />
      )}
      {(variant === "end" || variant === "both") && (
        <Image
          src="/images/floral-bouquet.webp"
          alt=""
          width={720}
          height={760}
          className={`absolute -bottom-12 -end-14 w-[44vw] max-w-[300px] rotate-180 ${opacity}`}
        />
      )}
      <FloatingSprig
        src="/images/sprig-eucalyptus.webp"
        className="bottom-[18%] start-[6%] w-12 opacity-50"
        duration={11}
        rotate={-6}
      />
      <FloatingSprig
        src="/images/sprig-blossom.webp"
        className="end-[7%] top-[22%] w-11 opacity-50"
        duration={13}
        delay={1.2}
        rotate={8}
      />
    </div>
  );
}
