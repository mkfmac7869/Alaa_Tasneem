import Image from "next/image";
import type { CSSProperties } from "react";

/** A weightless botanical sprig drifting in place. */
export default function FloatingSprig({
  src,
  className,
  duration = 10,
  delay = 0,
  rotate = 0,
}: {
  src: string;
  className: string;
  duration?: number;
  delay?: number;
  rotate?: number;
}) {
  return (
    <Image
      src={src}
      alt=""
      width={220}
      height={220}
      aria-hidden
      className={`floating-sprig pointer-events-none absolute ${className}`}
      style={
        {
          "--float-duration": `${duration}s`,
          "--float-delay": `${delay}s`,
          "--float-rotate": `${rotate}deg`,
        } as CSSProperties
      }
    />
  );
}
