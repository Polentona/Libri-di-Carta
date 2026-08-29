export function coverSrc(url: string | null | undefined) {
  if (!url) return '';
  if (url.startsWith('/')) return url;
  return `/api/cover?url=${encodeURIComponent(url)}`;
}
