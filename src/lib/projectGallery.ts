import { Project } from "@/types/portfolio";

const MAX_GALLERY_IMAGES = 12;

export { MAX_GALLERY_IMAGES };

export function normalizeProjectGallery(gallery: unknown): string[] {
  if (!Array.isArray(gallery)) return [];
  return gallery.filter(
    (item): item is string => typeof item === "string" && item.trim().length > 0
  );
}

export function getProjectGallery(project: Project): string[] {
  const gallery = normalizeProjectGallery(project.gallery);
  if (gallery.length > 0) return gallery;
  if (project.image) return [project.image];
  return [];
}
