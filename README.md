# علاء وتسنيم — Alaa & Tasneem Wedding Invitation

A bilingual (Arabic-first / English), production-ready wedding
invitation website: animated envelope opening, cinematic hero,
live countdown, Hijri + Gregorian dates, maps, calendar actions,
background music and a printable QR invitation — all driven by a
single configuration file.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS v4 ·
next-intl · bespoke CSS motion system · qrcode · sharp.

---

## Quick start

```bash
npm install
npm run dev        # http://localhost:3000  (Arabic)  /en (English)
npm run build      # production build
```

Everything a guest sees comes from **`src/config/wedding.ts`**.
Translations live in **`messages/ar.json`** and **`messages/en.json`**.

---

## How to change the date

1. Open `src/config/wedding.ts`.
2. Set `date` (`YYYY-MM-DD`) and `startTime` / `endTime` — the
   venue's wall-clock times in 24h format.
3. If the venue is not in the UAE, set `utcOffset` (e.g. `"+03:00"`)
   and `timezone` (IANA name, e.g. `Asia/Riyadh`).

That single value drives the hero date line, the countdown, the
date section (including the automatic **Hijri date** — hide it with
`showHijriDate: false`), every calendar link, the ICS file and the
printable QR card. Weekday names, month names and Arabic-Indic
numerals are all derived automatically per language.

## How to change the venue

1. In `src/config/wedding.ts → venue`, fill `nameAr/nameEn`,
   `cityAr/cityEn`, `addressAr/addressEn`.
2. Paste the Google Maps **share link** into `googleMapsUrl`
   (and optionally set `latitude`/`longitude` — they power the
   Apple Maps link and are a fallback for Google Maps).
3. Replace the venue photography with the real photos:

```bash
# converts any JPG/PNG to an optimized WebP at the right size
node scripts/optimize-images.mjs photo.jpg public/images/venue-photo-courtyard.webp 2200
node scripts/optimize-images.mjs photo.jpg public/images/venue-hero-dusk-wide.webp 2752   # desktop hero
node scripts/optimize-images.mjs photo.jpg public/images/venue-hero-dusk-tall.webp 1536   # mobile hero (vertical crop)
```

The hero is art-directed: phones load the tall crop, larger screens
the wide one — keep the mobile crop vertical (≈9:16) with calm sky
in the upper third so the names stay readable.

## How to replace the music

Drop the licensed track at **`public/audio/wedding-theme.mp3`**
(or change `musicUrl` in the config). Nothing else to do:

- Music only starts after the guest opens the envelope (never autoplays).
- It fades in softly, loops, pauses while the tab is hidden and
  remembers the guest's on/off choice for the session.
- While no file exists, the music button simply stays hidden —
  the site works perfectly in silence.

Use only music you have the rights to.

## How to update the map

The "الاتجاهات إلى الموقع / Get Directions" button uses
`googleMapsUrl` from the config. Until you replace the placeholder
it falls back to a search for the venue name or the coordinates.
The secondary link opens Apple Maps using `latitude`/`longitude`.

## How to generate the QR code

Open **`/qr`** (Arabic) or **`/en/qr`** (English):

- A print-faithful invitation card (light and dark versions) with
  the monogram, both names, the date and a scannable QR code.
- **Print** uses the browser's print dialog (the controls are
  excluded from print automatically).
- **Download PNG** exports a 2048 px QR for print production;
  **Download SVG** exports a vector version.

The QR encodes `websiteUrl` from the config. While that is still a
placeholder it encodes the address the site is served from, so it
always scans — set the real URL before printing.

## How to deploy the website

**Vercel (recommended)**

```bash
npm i -g vercel && vercel
```

or push the repo to GitHub and import it at vercel.com — zero
configuration needed. Then:

1. Set `websiteUrl` in `src/config/wedding.ts` to the final URL.
2. When you are ready to share publicly, set `privacy.noindex: false`.
3. Optional: require an invitation code by setting
   `privacy.inviteCode: "2026"` — guests enter it once, elegantly.

**Firebase Hosting** — `firebase init hosting`, choose the
"dynamic web app" (frameworks) flow for Next.js, then
`firebase deploy`.

---

## Project map

```
src/config/wedding.ts        ← every editable wedding fact
messages/ar.json, en.json    ← all copy, Arabic first
src/app/[locale]/            ← page, layout, /qr, /enter (code gate)
src/app/api/calendar/[locale]← ICS download (Apple/Outlook/any)
src/components/              ← EnvelopeIntro, HeroSection, WeddingCountdown,
                               VenueSection, CalendarActions, MusicControl,
                               LanguageSwitcher, QRInvitation, ClosingSection…
src/components/WeddingMonogram.tsx ← the hand-drawn A&T mark (SVG paths)
scripts/optimize-images.mjs  ← WebP conversion for any new photo
assets/monogram-concepts/    ← generated monogram explorations (print use)
public/images/               ← optimized WebP art direction assets
```

### Notes

- Arabic is the default language at `/`; English lives at `/en`.
  The switcher swaps locale without reloading, without restarting
  music and without replaying the envelope.
- All motion is CSS-driven, respects `prefers-reduced-motion`, and
  the full content is visible even with JavaScript disabled.
- `privacy.noindex` keeps search engines away until launch day.
