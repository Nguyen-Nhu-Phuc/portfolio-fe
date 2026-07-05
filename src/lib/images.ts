import { SERVER_API_URL } from "./apiBase";

const CLOUDINARY_HOST = "res.cloudinary.com";

/** Backend origin for /uploads paths so Next.js Image can fetch via remotePatterns. */
function uploadSrcForNextImage(path: string): string {
  const base = SERVER_API_URL.replace(/\/$/, "");
  return `${base}${path.startsWith("/") ? path : `/${path}`}`;
}

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
 * Local uploads are resolved to the backend origin for Next.js Image remotePatterns.
 */
export function resolveImageSrc(url: string): string {
  if (!url?.trim()) return url;

  if (isCloudinaryUrl(url)) {
    return url;
  }

  if (url.startsWith("/uploads/")) {
    return uploadSrcForNextImage(url);
  }

  try {
    const parsed = new URL(url);
    if (parsed.hostname === CLOUDINARY_HOST) {
      return url;
    }
    if (parsed.pathname.startsWith("/uploads/")) {
      return uploadSrcForNextImage(parsed.pathname);
    }
  } catch {
    // Relative paths like /images/... fall through.
  }

  return url;
}

export function isUploadedImage(url: string): boolean {
  if (!url?.trim()) return false;
  if (isCloudinaryUrl(url)) return true;
  if (url.startsWith("/uploads/")) return true;

  try {
    return new URL(url).pathname.startsWith("/uploads/");
  } catch {
    return false;
  }
}

export function absoluteImageUrl(url: string): string {
  const resolved = resolveImageSrc(url);

  if (isCloudinaryUrl(resolved)) {
    return resolved;
  }

  try {
    const parsed = new URL(resolved);
    if (parsed.pathname.startsWith("/uploads/")) {
      return resolved;
    }
  } catch {
    if (resolved.startsWith("/uploads/")) {
      return uploadSrcForNextImage(resolved);
    }
  }

  if (resolved.startsWith("/")) {
    const site =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    return `${site.replace(/\/$/, "")}${resolved}`;
  }

  return resolved;
}
