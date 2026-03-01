/**
 * Resolves product image URLs for reliable display.
 * Handles: relative paths, absolute URLs, base64 data URLs, and fallback placeholder.
 */
// Inline data URL placeholder - always works, no network request needed
const PLACEHOLDER_SVG =
  "data:image/svg+xml," +
  encodeURIComponent(
    '<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800"><rect width="800" height="800" fill="#f97316"/><rect x="60" y="60" width="680" height="680" rx="24" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.5)" stroke-width="4"/><text x="400" y="380" text-anchor="middle" font-family="Arial,sans-serif" font-size="48" font-weight="700" fill="#fff">NEPKART</text><text x="400" y="450" text-anchor="middle" font-family="Arial,sans-serif" font-size="24" fill="rgba(255,255,255,0.9)">Product image coming soon</text></svg>'
  );

export function getProductImageUrl(url: string | null | undefined): string {
  if (!url || url.trim() === "") return PLACEHOLDER_SVG;
  const trimmed = url.trim();
  // Data URLs and absolute URLs work as-is
  if (trimmed.startsWith("data:") || trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed;
  }
  // Relative path: resolve against current origin so it works in dev and production
  const path = trimmed.startsWith("/") ? trimmed : `/${trimmed}`;
  try {
    return new URL(path, window.location.origin).href;
  } catch {
    return PLACEHOLDER_SVG;
  }
}
