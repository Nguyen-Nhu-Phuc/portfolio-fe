import { MetadataRoute } from "next";
import { allLocalizedPaths, siteUrl } from "@/lib/locale";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const now = new Date();

  return allLocalizedPaths().map(({ lang, page }) => ({
    url: `${base}/${lang}/${page}`,
    lastModified: now,
    changeFrequency: page === "blog" ? "weekly" : "monthly",
    priority: page === "about" ? 1 : page === "contact" ? 0.9 : 0.7,
  }));
}
