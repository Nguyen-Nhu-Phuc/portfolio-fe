import { PageName } from "@/types/portfolio";
import { Locale } from "@/types/localized";

export const PORTFOLIO_PAGES: PageName[] = [
  "about",
  "resume",
  "portfolio",
  "blog",
  "contact",
];

export function isPortfolioPage(value: string): value is PageName {
  return PORTFOLIO_PAGES.includes(value as PageName);
}

function isLocaleSegment(value: string): value is Locale {
  return value === "en" || value === "vi";
}

export function pageFromPath(pathname: string): PageName {
  const segments = pathname.replace(/\/$/, "").split("/").filter(Boolean);
  const pageSegment =
    segments.length >= 2 && isLocaleSegment(segments[0])
      ? segments[1]
      : segments[0];

  if (pageSegment && isPortfolioPage(pageSegment)) return pageSegment;
  return "about";
}

export function pathForPage(page: PageName, locale: Locale = "en"): string {
  return `/${locale}/${page}`;
}
