import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isPortfolioPage } from "@/lib/portfolioPages";
import { absoluteImageUrl } from "@/lib/images";
import {
  alternateLanguages,
  isLocale,
  allLocalizedPaths,
  siteUrl,
} from "@/lib/locale";
import {
  buildPersonJsonLd,
  getPortfolio,
} from "@/lib/portfolio.server";
import { Locale } from "@/types/localized";

export const dynamic = "force-dynamic";

export const dynamicParams = false;

export function generateStaticParams() {
  return allLocalizedPaths().map(({ lang, page }) => ({ lang, page }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; page: string }>;
}): Promise<Metadata> {
  const { lang, page } = await params;
  if (!isLocale(lang) || !isPortfolioPage(page)) {
    return { title: "Not Found" };
  }

  const data = await getPortfolio(lang);

  if (!data) {
    return {
      title: "Portfolio",
      description: "Personal portfolio website",
    };
  }

  const description =
    data.profile.tagline ??
    data.about[0]?.slice(0, 160) ??
    `${data.profile.name} — ${data.profile.title}`;

  const baseTitle = `${data.profile.name} — ${data.profile.title}`;
  const pageLabel = page.charAt(0).toUpperCase() + page.slice(1);
  const title = page === "about" ? baseTitle : `${pageLabel} — ${data.profile.name}`;
  const canonical = `${siteUrl()}/${lang}/${page}`;
  const languages = alternateLanguages(page);

  return {
    title,
    description,
    keywords: [
      data.profile.title,
      "portfolio",
      "developer",
      "freelance",
      data.profile.location,
    ],
    alternates: {
      canonical,
      languages: {
        en: languages.en,
        vi: languages.vi,
        "x-default": languages.en,
      },
    },
    openGraph: {
      title: baseTitle,
      description,
      type: "profile",
      url: canonical,
      locale: lang === "vi" ? "vi_VN" : "en_US",
      alternateLocale: lang === "vi" ? ["en_US"] : ["vi_VN"],
      images: [{ url: absoluteImageUrl(data.profile.avatar) }],
    },
    twitter: {
      card: "summary_large_image",
      title: baseTitle,
      description,
      images: [absoluteImageUrl(data.profile.avatar)],
    },
  };
}

export default async function PortfolioRoutePage({
  params,
}: {
  params: Promise<{ lang: string; page: string }>;
}) {
  const { lang, page } = await params;
  if (!isLocale(lang) || !isPortfolioPage(page)) notFound();

  if (page !== "about") return null;

  const data = await getPortfolio(lang as Locale);
  if (!data) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(buildPersonJsonLd(data, lang as Locale)),
      }}
    />
  );
}
