import { SERVER_API_URL } from "./apiBase";

const CLOUDINARY_HOST = "res.cloudinary.com";

export function isCloudinaryUrl(url: string): boolean {
  if (!url?.trim()) return false;

  try {
    return new URL(url).hostname === CLOUDINARY_HOST;
  } catch {
    return false;
  }
}

/**
 * Normalize image URLs for Next.js Image.
 * Local uploads use same-origin paths proxied by Next.js; Cloudinary URLs pass through.
 */
export function resolveImageSrc(url: string): string {
  if (!url?.trim()) return url;

  if (isCloudinaryUrl(url)) {
    return url;
  }

  if (url.startsWith("/uploads/")) {
    return url;
  }

  try {
    const parsed = new URL(url);
    if (parsed.hostname === CLOUDINARY_HOST) {
      return url;
    }
    if (parsed.pathname.startsWith("/uploads/")) {
      return parsed.pathname;
    }
  } catch {
    // Relative paths like /images/... fall through.
  }

  return url;
}

export function isUploadedImage(url: string): boolean {
  const resolved = resolveImageSrc(url);
  return resolved.startsWith("/uploads/") || isCloudinaryUrl(resolved);
}

export function absoluteImageUrl(url: string): string {
  const resolved = resolveImageSrc(url);

  if (isCloudinaryUrl(resolved)) {
    return resolved;
  }

  if (resolved.startsWith("/uploads/")) {
    const site = process.env.NEXT_PUBLIC_SITE_URL;
    if (site) {
      return `${site.replace(/\/$/, "")}${resolved}`;
    }
    return `${SERVER_API_URL.replace(/\/$/, "")}${resolved}`;
  }

  if (resolved.startsWith("/")) {
    const site =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    return `${site.replace(/\/$/, "")}${resolved}`;
  }

  return resolved;
}
