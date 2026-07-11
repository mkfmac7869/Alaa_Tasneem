#!/usr/bin/env node
/**
 * Convert a source image (PNG/JPG) into an optimized WebP.
 *
 *   node scripts/optimize-images.mjs <input> <output.webp> [maxWidth] [quality]
 *
 * Used for every visual asset on the site — including swapping in
 * the real venue photograph (see README → "Changing the venue").
 */
import sharp from "sharp";

const [input, output, maxWidth, quality] = process.argv.slice(2);

if (!input || !output) {
  console.error(
    "Usage: node scripts/optimize-images.mjs <input> <output.webp> [maxWidth] [quality]"
  );
  process.exit(1);
}

const pipeline = sharp(input).rotate();
if (maxWidth) {
  pipeline.resize({ width: Number(maxWidth), withoutEnlargement: true });
}
await pipeline.webp({ quality: quality ? Number(quality) : 82 }).toFile(output);

const meta = await sharp(output).metadata();
console.log(`${output} — ${meta.width}x${meta.height}`);
