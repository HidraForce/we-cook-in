const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

/**
 * Converts any image URL to a working URL.
 * - Supabase UserImages public URLs → proxy through /api/images
 * - Already-proxied URLs → returned as-is
 * - Other URLs (external) → returned as-is
 */
export function resolveImageUrl(url: string | null | undefined): string {
  if (!url) return "";

  if (url.startsWith("/api/images")) return url;

  if (url.includes("/UserImages/")) {
    const match = url.match(/\/UserImages\/(.+)$/);
    if (match) {
      return `/api/images?path=${encodeURIComponent(match[1])}`;
    }
  }

  return url;
}
