import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  /**
   * Fully static export — deployable on Firebase Hosting's free
   * tier (no server). Assets are pre-optimized WebP files, so the
   * runtime image optimizer is not needed.
   */
  output: "export",
  images: {
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
