import { buildIcs } from "@/lib/calendar";

// Exported as static files; firebase.json attaches the calendar
// Content-Type and download headers.
export const dynamic = "force-static";

export function generateStaticParams() {
  return [{ locale: "ar" }, { locale: "en" }];
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  const { locale } = await params;
  const lang = locale === "en" ? "en" : "ar";

  return new Response(buildIcs(lang), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="alaa-tasneem-wedding.ics"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
