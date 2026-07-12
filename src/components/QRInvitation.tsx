"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import QRCode from "qrcode";
import Logo from "./Logo";
import { coupleNames, isPlaceholder, weddingConfig } from "@/config/wedding";
import { formatGregorianDate } from "@/lib/dates";
import arMessages from "../../messages/ar.json";
import enMessages from "../../messages/en.json";

type Variant = "light" | "dark";

const INK = "#2b2922";

export default function QRInvitation() {
  const t = useTranslations("qr");
  const [variant, setVariant] = useState<Variant>("light");
  const [svgMarkup, setSvgMarkup] = useState("");
  const [origin, setOrigin] = useState("");

  useEffect(() => {
    setOrigin(window.location.origin);
  }, []);

  // Until the final URL is configured, the QR points at wherever
  // the site is actually being served from — always scannable.
  const url = useMemo(
    () =>
      isPlaceholder(weddingConfig.websiteUrl)
        ? origin
        : weddingConfig.websiteUrl,
    [origin]
  );

  useEffect(() => {
    if (!url) return;
    // Error correction H tolerates the small monogram at the center
    QRCode.toString(url, {
      type: "svg",
      errorCorrectionLevel: "H",
      margin: 2,
      color: { dark: INK, light: "#ffffff00" },
    }).then(setSvgMarkup);
  }, [url]);

  const downloadPng = async () => {
    if (!url) return;
    const dataUrl = await QRCode.toDataURL(url, {
      errorCorrectionLevel: "H",
      margin: 4,
      width: 2048,
      color: { dark: INK, light: "#ffffff" },
    });
    triggerDownload(dataUrl, "alaa-tasneem-qr.png");
  };

  const downloadSvg = async () => {
    if (!url) return;
    const svg = await QRCode.toString(url, {
      type: "svg",
      errorCorrectionLevel: "H",
      margin: 4,
      color: { dark: INK, light: "#ffffff" },
    });
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const blobUrl = URL.createObjectURL(blob);
    triggerDownload(blobUrl, "alaa-tasneem-qr.svg");
    URL.revokeObjectURL(blobUrl);
  };

  const dark = variant === "dark";

  return (
    <div className="flex flex-col items-center gap-10">
      {/* ── printable card ─────────────────────────────── */}
      <div
        className={`print-card w-full max-w-[420px] p-4 shadow-[0_18px_50px_rgba(43,41,34,0.14)] ${
          dark ? "bg-charcoal text-ivory" : "texture-paper bg-ivory text-ink"
        }`}
      >
        <div
          className={`relative overflow-hidden border px-8 pb-10 pt-12 text-center ${
            dark ? "border-ivory/25" : "border-ink/20"
          }`}
        >
          <Image
            src="/images/floral-bouquet.webp"
            alt=""
            width={240}
            height={240}
            aria-hidden
            className={`pointer-events-none absolute -left-4 -top-4 w-24 ${
              dark ? "opacity-60" : ""
            }`}
          />
          <Image
            src="/images/floral-bouquet.webp"
            alt=""
            width={240}
            height={240}
            aria-hidden
            className={`pointer-events-none absolute -bottom-4 -right-4 w-24 rotate-180 ${
              dark ? "opacity-60" : ""
            }`}
          />
          <Logo
            className={`mx-auto h-20 w-auto ${
              dark ? "text-ivory" : "text-sage-deep"
            }`}
            title={coupleNames("en")}
          />

          <p
            className="mt-8 text-3xl"
            style={{ fontFamily: "var(--font-el-messiri)" }}
            lang="ar"
            dir="rtl"
          >
            {coupleNames("ar")}
          </p>
          <p
            className="mt-3 text-sm uppercase tracking-[0.32em]"
            style={{ fontFamily: "var(--font-cormorant)" }}
            lang="en"
          >
            {coupleNames("en")}
          </p>

          <div
            className={`mx-auto my-7 h-px w-16 ${
              dark ? "bg-ivory/25" : "bg-ink/15"
            }`}
            aria-hidden
          />

          <p className="text-sm" lang="ar" dir="rtl">
            {formatGregorianDate("ar")}
          </p>
          <p
            className={`mt-1.5 text-[11px] tracking-[0.14em] ${
              dark ? "text-ivory/65" : "text-ink-soft"
            }`}
            lang="en"
          >
            {formatGregorianDate("en")}
          </p>

          {/* QR on a white plate — dark modules on light always scan */}
          <div className="relative mx-auto mt-9 w-48 rounded-[3px] bg-white p-3.5">
            {svgMarkup ? (
              <div
                className="[&_svg]:block [&_svg]:h-auto [&_svg]:w-full"
                dangerouslySetInnerHTML={{ __html: svgMarkup }}
              />
            ) : (
              <div className="aspect-square w-full" />
            )}
            {svgMarkup && (
              <span className="absolute left-1/2 top-1/2 grid h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white">
                <Logo className="h-8 w-auto text-charcoal" />
              </span>
            )}
          </div>

          {/* The card is always bilingual, whatever locale renders it */}
          <p className="mt-7 text-sm" lang="ar" dir="rtl">
            {arMessages.qr.scan}
          </p>
          <p
            className={`mt-1.5 text-[11px] tracking-[0.1em] ${
              dark ? "text-ivory/65" : "text-ink-soft"
            }`}
            lang="en"
          >
            {enMessages.qr.scan}
          </p>
        </div>
      </div>

      {/* ── controls (never printed) ────────────────────── */}
      <div className="no-print flex flex-wrap items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => setVariant(dark ? "light" : "dark")}
          className="min-h-11 rounded-full border border-ink/20 px-6 text-sm text-ink transition-colors hover:border-olive hover:text-olive-deep"
        >
          {dark ? t("light") : t("dark")}
        </button>
        <button
          type="button"
          onClick={() => window.print()}
          className="min-h-11 rounded-full border border-ink/20 px-6 text-sm text-ink transition-colors hover:border-olive hover:text-olive-deep"
        >
          {t("print")}
        </button>
        <button
          type="button"
          onClick={downloadPng}
          className="min-h-11 rounded-full border border-ink/20 px-6 text-sm text-ink transition-colors hover:border-olive hover:text-olive-deep"
        >
          {t("downloadPng")}
        </button>
        <button
          type="button"
          onClick={downloadSvg}
          className="min-h-11 rounded-full border border-ink/20 px-6 text-sm text-ink transition-colors hover:border-olive hover:text-olive-deep"
        >
          {t("downloadSvg")}
        </button>
      </div>
    </div>
  );
}

function triggerDownload(href: string, filename: string) {
  const link = document.createElement("a");
  link.href = href;
  link.download = filename;
  link.click();
}
