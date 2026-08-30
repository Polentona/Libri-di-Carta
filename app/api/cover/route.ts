const allowedHosts = [
  /(^|\.)goodreads\.com$/i,
  /(^|\.)media-amazon\.com$/i,
  /(^|\.)ssl-images-amazon\.com$/i,
  /(^|\.)ibs\.it$/i,
  /(^|\.)lafeltrinelli\.it$/i,
  /(^|\.)libreriauniversitaria\.it$/i,
  /(^|\.)unilibro\.it$/i,
  /(^|\.)abebooks\.(?:com|it|co\.uk)$/i,
  /(^|\.)openlibrary\.org$/i,
];
export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const value = requestUrl.searchParams.get('url');
  const code = (requestUrl.searchParams.get('code') || '').replace(
    /[^0-9X]/gi,
    '',
  );
  if (!value) return new Response('URL mancante', { status: 400 });
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return new Response('URL non valido', { status: 400 });
  }
  if (
    url.protocol !== 'https:' ||
    !allowedHosts.some((pattern) => pattern.test(url.hostname))
  )
    return new Response('Origine non consentita', { status: 403 });
  const fetchCover = async (target: URL) => {
    const response = await fetch(target, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36',
        accept: 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        referer: `${target.protocol}//${target.hostname}/`,
      },
      signal: AbortSignal.timeout(10000),
    });
    const type = response.headers.get('content-type') || '';
    if (!response.ok || !type.startsWith('image/')) return null;
    return new Response(response.body, {
      headers: {
        'content-type': type,
        'cache-control': 'public, max-age=86400, s-maxage=604800',
      },
    });
  };
  try {
    const primary = await fetchCover(url);
    if (primary) return primary;
    if (/^(?:\d{10}|\d{13})$/.test(code)) {
      for (const fallbackUrl of [
        `https://cdn.unilibro.it/cover/libro/${code}B.jpg`,
        `https://covers.openlibrary.org/b/isbn/${code}-L.jpg`,
      ]) {
        const fallback = await fetchCover(new URL(fallbackUrl));
        if (fallback) return fallback;
      }
    }
    return new Response('Copertina non disponibile', { status: 404 });
  } catch {
    return new Response('Copertina non disponibile', { status: 404 });
  }
}
