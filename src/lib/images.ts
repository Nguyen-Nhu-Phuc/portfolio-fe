const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:5000";

/**
 * Normalize uploaded image URLs to same-origin paths proxied by Next.js.
 */
export function resolveImageSrc(url: string): string {
  if (!url?.trim()) return url;

  if (url.startsWith("/uploads/")) {
    return url;
  }

  try {
    const parsed = new URL(url);
    if (parsed.pathname.startsWith("/uploads/")) {
      return parsed.pathname;
    }
  } catch {
    // Relative paths like /images/... fall through.
  }

  return url;
}

export function isUploadedImage(url: string): boolean {
  return resolveImageSrc(url).startsWith("/uploads/");
}

export function absoluteImageUrl(url: string): string {
  const resolved = resolveImageSrc(url);

  if (resolved.startsWith("/uploads/")) {
    return `${API_URL.replace(/\/$/, "")}${resolved}`;
  }

  if (resolved.startsWith("/")) {
    const site =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
    return `${site.replace(/\/$/, "")}${resolved}`;
  }

  return resolved;
}
