/** Backend URL for server-side fetches (SSR, build, metadata). */
export const SERVER_API_URL =
  process.env.API_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  "http://127.0.0.1:5000";

/**
 * Base URL for API requests.
 * - Browser: same-origin `/api/*` (proxied by Next.js rewrites → no CORS).
 * - Server: direct backend URL.
 */
export function apiBase(): string {
  if (typeof window !== "undefined") {
    return "";
  }
  return SERVER_API_URL.replace(/\/$/, "");
}
