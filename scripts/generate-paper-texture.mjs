#!/usr/bin/env node
/**
 * Generates the subtle handmade-paper grain used at low opacity
 * behind light sections (public/images/texture-paper.webp).
 * Deterministic alternative to a photographed texture.
 */
import sharp from "sharp";

const SIZE = 1024;

const noise = await sharp({
  create: {
    width: SIZE,
    height: SIZE,
    channels: 3,
    noise: { type: "gaussian", mean: 235, sigma: 7 },
  },
})
  .blur(0.6)
  .tint({ r: 247, g: 242, b: 233 })
  .webp({ quality: 70 })
  .toFile("public/images/texture-paper.webp");

console.log(`texture-paper.webp — ${noise.width ?? SIZE}px`);
