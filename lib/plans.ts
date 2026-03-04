export const PLAN_STYLES: Record<string, string> = {
  free: "bg-emerald-100 text-emerald-800 border-emerald-200",
  "weekend-cook": "bg-amber-100 text-amber-800 border-amber-200",
  "pro-chef": "bg-purple-100 text-purple-800 border-purple-200",
};

export function getPlanStyle(slug: string) {
  return PLAN_STYLES[slug] ?? "bg-gray-100 text-gray-800 border-gray-200";
}
