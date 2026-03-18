const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

export const IMAGE_FALLBACKS = {
  avatar: "/images/avatar-placeholder.jpeg",
  hero: "/images/hero-fallback.svg",
  banner: "/images/profile-banner.png",
} as const;

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

export function resolveImageUrlOrFallback(
  url: string | null | undefined,
  fallback: string
): string {
  return resolveImageUrl(url) || fallback;
}

export function resolveAvatarUrl(url: string | null | undefined): string {
  return resolveImageUrlOrFallback(url, IMAGE_FALLBACKS.avatar);
}

export function resolveHeroUrl(url: string | null | undefined): string {
  return resolveImageUrlOrFallback(url, IMAGE_FALLBACKS.hero);
}

export function resolveBannerUrl(url: string | null | undefined): string {
  return resolveImageUrlOrFallback(url, IMAGE_FALLBACKS.banner);
}
