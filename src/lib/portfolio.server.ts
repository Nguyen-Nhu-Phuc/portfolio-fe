import { cache } from "react";
import { cookies } from "next/headers";
import { Locale } from "@/types/localized";
import { PortfolioData } from "@/types/portfolio";
import { fetchPortfolioServer } from "./api";
import { absoluteImageUrl } from "./images";

export async function getRequestLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const value = cookieStore.get("portfolio-locale")?.value;
  return value === "vi" ? "vi" : "en";
}

export const getPortfolio = cache(
  async (locale: Locale): Promise<PortfolioData | null> => {
    return fetchPortfolioServer(locale);
  }
);

export function buildPersonJsonLd(data: PortfolioData, locale: Locale = "en") {
  const base = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: data.profile.name,
    jobTitle: data.profile.title,
    description: data.profile.tagline ?? data.about[0],
    email: data.profile.email,
    telephone: data.profile.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: data.profile.location,
    },
    image: absoluteImageUrl(data.profile.avatar),
    url: `${base}/${locale}/about`,
    sameAs: data.profile.socialLinks.map((link) => link.url),
  };
}
