import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogPageShell from "@/components/BlogPageShell";
import { findBlogBySlug } from "@/lib/blogSlug";
import { getPortfolio } from "@/lib/portfolio.server";
import { isLocale, siteUrl } from "@/lib/locale";
import { absoluteImageUrl } from "@/lib/images";
import { Locale } from "@/types/localized";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!isLocale(lang)) return { title: "Not Found" };

  const data = await getPortfolio(lang);
  const post = data ? findBlogBySlug(data.blogs, slug) : undefined;
  if (!post) return { title: "Not Found" };

  const title = `${post.title} — ${data?.profile.name ?? "Portfolio"}`;
  const description = post.excerpt;
  const canonical = `${siteUrl()}/${lang}/blog/${slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "article",
      images: post.image ? [{ url: absoluteImageUrl(post.image) }] : undefined,
    },
  };
}

export default async function BlogRoutePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const data = await getPortfolio(lang as Locale);
  if (!data) notFound();

  const post = findBlogBySlug(data.blogs, slug);
  if (!post) notFound();

  return <BlogPageShell data={data} post={post} locale={lang as Locale} />;
}
