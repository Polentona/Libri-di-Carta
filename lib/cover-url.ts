export function coverSrc(url: string | null | undefined, code?: string | null) {
  if (!url) return '';
  if (url.startsWith('/')) return url;
  const params = new URLSearchParams({ url });
  if (code) params.set('code', code.replace(/[\s-]/g, ''));
  return `/api/cover?${params}`;
}
