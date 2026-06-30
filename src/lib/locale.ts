import { Locale } from "@/types/localized";
import { PageName } from "@/types/portfolio";
import { PORTFOLIO_PAGES } from "@/lib/portfolioPages";

export const LOCALES: Locale[] = ["en", "vi"];

export function isLocale(value: string): value is Locale {
  return LOCALES.includes(value as Locale);
}

export function localeFromPath(pathname: string): Locale {
  const segment = pathname.replace(/\/$/, "").split("/").filter(Boolean)[0];
  return segment === "vi" ? "vi" : "en";
}

export function pathForPage(page: PageName, locale: Locale = "en"): string {
  return `/${locale}/${page}`;
}

export function allLocalizedPaths(): { lang: Locale; page: PageName }[] {
  return LOCALES.flatMap((lang) =>
    PORTFOLIO_PAGES.map((page) => ({ lang, page }))
  );
}

export function siteUrl(): string {
  return process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
}

export function alternateLanguages(
  page: PageName
): Record<Locale, string> {
  const base = siteUrl();
  return {
    en: `${base}/en/${page}`,
    vi: `${base}/vi/${page}`,
  };
}
