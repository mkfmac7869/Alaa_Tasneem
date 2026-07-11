import type { MetadataRoute } from "next";
import { weddingConfig } from "@/config/wedding";

export default function robots(): MetadataRoute.Robots {
  if (weddingConfig.privacy.noindex) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return { rules: { userAgent: "*", allow: "/" } };
}
