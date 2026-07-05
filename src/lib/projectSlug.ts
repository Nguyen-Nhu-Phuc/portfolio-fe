import { Project } from "@/types/portfolio";
import { Locale } from "@/types/localized";

export function projectSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function pathForProject(project: Project, locale: Locale = "en"): string {
  return `/${locale}/project/${projectSlug(project.title)}`;
}

export function findProjectBySlug(
  projects: Project[],
  slug: string
): Project | undefined {
  return projects.find((project) => projectSlug(project.title) === slug);
}

export function getNextProject(
  projects: Project[],
  current: Project
): Project | null {
  const index = projects.findIndex((p) => p.title === current.title);
  if (index === -1 || projects.length === 0) return null;
  return projects[(index + 1) % projects.length];
}
