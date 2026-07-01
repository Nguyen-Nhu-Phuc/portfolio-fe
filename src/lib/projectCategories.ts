import { LocalizedString } from "@/types/localized";
import { ProjectCategory } from "@/types/portfolio";

export const DEFAULT_PROJECT_CATEGORIES: {
  slug: string;
  label: LocalizedString;
}[] = [
  { slug: "web design", label: { en: "Web design", vi: "Thiết kế web" } },
  { slug: "applications", label: { en: "Applications", vi: "Ứng dụng" } },
  {
    slug: "web development",
    label: { en: "Web development", vi: "Phát triển web" },
  },
];

export function slugifyCategory(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, " ");
}

export function buildProjectFilters(
  categories: ProjectCategory[],
  allLabel: string
): { slug: string; label: string }[] {
  return [
    { slug: "all", label: allLabel },
    ...categories.map((category) => ({
      slug: category.slug,
      label: category.label,
    })),
  ];
}

export function resolveProjectCategories(
  categories: ProjectCategory[] | undefined
): ProjectCategory[] {
  if (categories && categories.length > 0) return categories;

  return DEFAULT_PROJECT_CATEGORIES.map((category) => ({
    slug: category.slug,
    label: category.label.en,
  }));
}
