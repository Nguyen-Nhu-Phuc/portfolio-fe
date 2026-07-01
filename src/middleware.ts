import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { PORTFOLIO_PAGES } from "@/lib/portfolioPages";

const LOCALES = ["en", "vi"] as const;

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.startsWith("/uploads") ||
    pathname.includes(".")
  ) {
    return NextResponse.next();
  }

  const cookieLocale =
    request.cookies.get("portfolio-locale")?.value === "vi" ? "vi" : "en";
  const segments = pathname.split("/").filter(Boolean);

  if (pathname === "/") {
    return NextResponse.redirect(
      new URL(`/${cookieLocale}/about`, request.url)
    );
  }

  if (segments.length === 1 && PORTFOLIO_PAGES.includes(segments[0] as never)) {
    return NextResponse.redirect(
      new URL(`/${cookieLocale}/${segments[0]}`, request.url)
    );
  }

  if (segments.length >= 1 && LOCALES.includes(segments[0] as "en" | "vi")) {
    const response = NextResponse.next();
    response.cookies.set("portfolio-locale", segments[0], {
      path: "/",
      maxAge: 31536000,
      sameSite: "lax",
    });
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
