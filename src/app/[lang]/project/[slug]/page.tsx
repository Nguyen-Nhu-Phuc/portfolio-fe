import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProjectPageShell from "@/components/ProjectPageShell";
import { findProjectBySlug } from "@/lib/projectSlug";
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
  const project = data ? findProjectBySlug(data.projects, slug) : undefined;
  if (!project) return { title: "Not Found" };

  const title = `${project.title} — ${data?.profile.name ?? "Portfolio"}`;
  const description = project.description ?? project.category;
  const canonical = `${siteUrl()}/${lang}/project/${slug}`;

  return {
    title,
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      url: canonical,
      images: [{ url: absoluteImageUrl(project.image) }],
    },
  };
}

export default async function ProjectRoutePage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const { lang, slug } = await params;
  if (!isLocale(lang)) notFound();

  const data = await getPortfolio(lang as Locale);
  if (!data) notFound();

  const project = findProjectBySlug(data.projects, slug);
  if (!project) notFound();

  return (
    <ProjectPageShell data={data} project={project} locale={lang as Locale} />
  );
}
