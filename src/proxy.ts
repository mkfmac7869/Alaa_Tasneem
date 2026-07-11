import createIntlMiddleware from "next-intl/middleware";
import { NextRequest, NextResponse } from "next/server";
import { routing } from "./i18n/routing";
import { weddingConfig } from "./config/wedding";

const intlMiddleware = createIntlMiddleware(routing);

const INVITE_COOKIE = "at-invite";

export default function proxy(request: NextRequest) {
  const { inviteCode } = weddingConfig.privacy;
  const { pathname } = request.nextUrl;
  const hasAccess =
    !inviteCode || request.cookies.get(INVITE_COOKIE)?.value === inviteCode;

  // API routes skip i18n, but the calendar file is still private
  if (pathname.startsWith("/api")) {
    if (!hasAccess && pathname.startsWith("/api/calendar")) {
      return new NextResponse(null, { status: 401 });
    }
    return NextResponse.next();
  }

  if (!hasAccess) {
    const isEnterPage = /^\/(?:ar\/|en\/)?enter\/?$/.test(pathname);
    if (!isEnterPage) {
      const url = request.nextUrl.clone();
      // Keep the guest's language on the way to the gate
      url.pathname =
        pathname === "/en" || pathname.startsWith("/en/")
          ? "/en/enter"
          : "/enter";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return intlMiddleware(request);
}

export const config = {
  // Skip Next internals and static files; API is handled above
  matcher: ["/((?!_next|.*\\..*).*)"],
};
