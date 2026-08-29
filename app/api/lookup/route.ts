type Candidate = {
  title: string;
  author: string;
  authorFirstName: string;
  authorLastName: string;
  code: string;
  codeType: string;
  genres: string[];
  publisher: string;
  publicationYear: number | null;
  saga: string;
  sagaOrder: number | null;
  prequel: string;
  sequel: string;
  coverUrl: string | null;
  plot: string;
  notes: string;
  rating: number;
  isRead: boolean;
  inLibrary: boolean;
  lentTo: string;
  lentDate: string;
  source: string;
};
const literaryGenres: Record<string, string> = {
  fiction: 'Narrativa',
  narrativa: 'Narrativa',
  fantasy: 'Fantasy',
  romance: 'Romanzo rosa',
  rosa: 'Romanzo rosa',
  erotica: 'Romanzo rosa',
  mystery: 'Giallo',
  gialli: 'Giallo',
  thriller: 'Thriller',
  horror: 'Horror',
  historical: 'Romanzo storico',
  storica: 'Romanzo storico',
  crime: 'Crime',
  classics: 'Classici',
  classici: 'Classici',
  poetry: 'Poesia',
  poesia: 'Poesia',
  biography: 'Biografia',
  biografia: 'Biografia',
  autobiography: 'Autobiografia',
  autobiografia: 'Autobiografia',
  memoir: 'Memorie',
  adventure: 'Avventura',
  avventura: 'Avventura',
  sciencefiction: 'Fantascienza',
  fantascienza: 'Fantascienza',
  dystopia: 'Distopia',
  distopia: 'Distopia',
  paranormal: 'Paranormale',
  vampires: 'Paranormale',
  supernatural: 'Paranormale',
  suspense: 'Suspense',
  comics: 'Fumetti',
  fumetti: 'Fumetti',
  manga: 'Manga',
  humor: 'Umorismo',
  youngadult: 'Young adult',
};
const catalogCorrections: Record<string, Partial<Candidate>> = {
  '9788804769828': {
    saga: 'Twisted',
    sagaOrder: 1,
    prequel: '',
    sequel: 'Twisted Games',
  },
  '9788804769835': {
    saga: 'Twisted',
    sagaOrder: 2,
    prequel: 'Twisted Love',
    sequel: 'Twisted Hate',
  },
  '9788804769842': {
    saga: 'Twisted',
    sagaOrder: 3,
    prequel: 'Twisted Games',
    sequel: 'Twisted Lies',
  },
  '9788809865662': {
    title: 'Ally nella tempesta',
    author: 'Lucinda Riley',
    authorFirstName: 'Lucinda',
    authorLastName: 'Riley',
    genres: ['Romanzo rosa', 'Romanzo storico'],
    publisher: 'Giunti Editore',
    publicationYear: 2018,
    saga: 'Le sette sorelle',
    sagaOrder: 2,
    prequel: 'Le sette sorelle',
    sequel: 'La ragazza nell’ombra',
    coverUrl: 'https://cdn.unilibro.it/cover/libro/9788809865662B.jpg',
    plot: 'La giovane Ally, velista esperta, sta vivendo uno dei momenti più emozionanti della sua vita quando la notizia della morte di Pa’ Salt interrompe bruscamente la sua felicità. Il padre adottivo ha lasciato a lei e alle sue sorelle una serie di indizi per ricostruire il loro passato. Il percorso di Ally la conduce alla storia di Anna Landvik, cantante d’opera norvegese dell’Ottocento e musa del compositore Edvard Grieg, e nella romantica Norvegia dovrà scoprire che cosa la lega a questa donna misteriosa.',
  },
  '9788850230884': {
    title: 'Blue',
    genres: ['Fantasy', 'Romanzo rosa', 'Young adult'],
    saga: 'La trilogia delle gemme',
    sagaOrder: 2,
    prequel: 'Red',
    sequel: 'Green',
  },
  '9788854160422': {
    title: 'La salvezza',
    author: 'Lisa Jane Smith',
    authorFirstName: 'Lisa Jane',
    authorLastName: 'Smith',
    genres: ['Fantasy', 'Young adult', 'Romanzo rosa', 'Paranormale'],
    publisher: 'Newton Compton Editori',
    publicationYear: 2013,
    saga: 'Il diario del vampiro',
    sagaOrder: 15,
    prequel: 'Destino',
    sequel: 'La vendetta',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9788854160422-L.jpg',
    plot: 'Forse per la prima volta in vita sua Elena Gilbert è davvero felice. Lei e Stefan si sono trasferiti in una casetta tutta loro a Dalcrest e Damon è in viaggio in Europa con Katherine. Tuttavia Elena è una Guardiana e non può ignorare le sue inquietanti premonizioni: il pericolo incombe e nessuno è al sicuro. Le sue peggiori paure si trasformano presto in realtà: a Dalcrest è arrivata una creatura orribile e maligna, un Antico, che lei e Stefan sono costretti ad affrontare. Quando poi un oscuro nemico minaccia anche Damon e Katherine dall’altro capo del mondo, i presentimenti di Elena trovano conferma. I due attacchi sono collegati: lei, Stefan e Damon devono lottare per sopravvivere e devono farlo insieme. Altrimenti non avranno scampo.',
  },
};
const italianSeriesCatalog = [
  {
    name: 'Se solo fosse vero',
    titles: ['Se solo fosse vero', 'Se potessi rivederti'],
  },
  {
    name: 'Baciata da un angelo',
    titles: [
      "L'amore che non muore",
      "Il potere dell'amore",
      'Anime gemelle',
      'In fondo al cuore',
      "L'amore e l'odio",
      'Sarà per sempre',
    ],
  },
  {
    name: 'David Hunter',
    titles: [
      'La chimica della morte',
      'Scritto nelle ossa',
      'I sussurri della morte',
      'La voce dei morti',
      'Acque morte',
      'Il profumo della morte',
    ],
  },
  { name: 'The Shining', titles: ['Shining', 'Doctor Sleep'] },
];
const seriesGenres: Record<string, string[]> = {
  'Baciata da un angelo': ['Romanzo rosa', 'Fantasy', 'Young adult'],
};
function catalogSeriesFor(title: string) {
  const normalized = title.toLocaleLowerCase('it');
  for (const series of italianSeriesCatalog) {
    const index = series.titles.findIndex((item) => {
      const candidate = item.toLocaleLowerCase('it');
      return (
        normalized === candidate || normalized.startsWith(`${candidate}. `)
      );
    });
    if (index >= 0)
      return {
        title: series.titles[index],
        saga: series.name,
        sagaOrder: index + 1,
      };
  }
  return null;
}
const decodeHtml = (value: string) =>
  value
    .replace(/&nbsp;|&#160;/gi, ' ')
    .replace(/&quot;|&#34;/gi, '"')
    .replace(/&apos;|&#39;|&#x27;/gi, "'")
    .replace(/&amp;|&#38;/gi, '&')
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&#(\d+);/g, (_, code) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-f]+);/gi, (_, code) =>
      String.fromCodePoint(parseInt(code, 16)),
    );
const textValue = (value: unknown) =>
  typeof value === 'string' || typeof value === 'number' ? String(value) : '';
export const clean = (value: unknown) =>
  decodeHtml(textValue(value))
    .replace(/<[^>]*>/g, ' ')
    .replace(/https?:\/\/\S+/g, '')
    .replace(/\s+/g, ' ')
    .trim();
const rawText = (value: unknown) =>
  decodeHtml(textValue(value))
    .replace(/\\u0026/gi, '&')
    .trim();
const plot = (value: unknown) =>
  clean(value)
    .split(
      /(?:In questo libro sono presenti|Content warning|Recension[ei]|Film|Serie TV|Prezzo|Acquista|Spedizione|Disponibil)/i,
    )[0]
    .replace(/\?\s+e\s+(?=[a-zà-ÿ])/g, '… e ')
    .trim();
function decodedJsonText(value: string) {
  try {
    return JSON.parse(`"${value}"`);
  } catch {
    return value
      .replace(/\\u([0-9a-f]{4})/gi, (_, code) =>
        String.fromCharCode(parseInt(code, 16)),
      )
      .replace(/\\[nrt]/g, ' ')
      .replace(/\\["\\/]/g, (match) => match.slice(1));
  }
}
function usefulPlot(value: string) {
  const result = plot(decodeHtml(value));
  return result.length >= 120 &&
    !/^(?:acquista|scopri|trova|vendita|spedizione|tutti i libri|benvenut)/i.test(
      result,
    )
    ? result
    : '';
}
function plotFromHtml(html: string, requestedCode: string) {
  const exact =
    html.match(
      new RegExp(
        `.{0,1800}${requestedCode.replace(/[^0-9X]/gi, '')}.{0,9000}`,
        'is',
      ),
    )?.[0] || html;
  const jsonKeys = [
    ...exact.matchAll(
      /"(?:description|shortDescription|longDescription|synopsis|plot|abstract)"\s*:\s*"((?:\\.|[^"\\]){120,})"/gi,
    ),
  ];
  for (const match of jsonKeys) {
    const result = usefulPlot(decodedJsonText(match[1]));
    if (result) return result;
  }
  const metas = [
    ...html.matchAll(
      /<meta[^>]+(?:property|name)=["'](?:og:description|description)["'][^>]+content=["']([\s\S]*?)["'][^>]*>/gi,
    ),
  ];
  for (const match of metas) {
    const result = usefulPlot(match[1]);
    if (result) return result;
  }
  const sections = [
    ...html.matchAll(
      /(?:Trama|Sinossi|Descrizione(?: del libro)?)[\s\S]{0,500}?<(?:div|p)[^>]*>([\s\S]{120,5000}?)<\/(?:div|p)>/gi,
    ),
  ];
  for (const match of sections) {
    const result = usefulPlot(match[1]);
    if (result) return result;
  }
  return '';
}
const detect = (value: string) => {
  const code = value.replace(/[\s-]/g, '').toUpperCase();
  if (/^\d{4}-?\d{3}[\dX]$/.test(value) || /^\d{7}[\dX]$/.test(code))
    return 'ISSN';
  if (/^(\d{9}[\dX]|\d{13})$/.test(code)) return 'ISBN';
  return 'CODICE A BARRE';
};
const names = (author: string) => {
  const parts = author.split(/\s+/).filter(Boolean);
  return {
    authorFirstName: parts.slice(0, -1).join(' '),
    authorLastName: parts.at(-1) || author,
  };
};
const genres = (values: unknown) => {
  const input = Array.isArray(values) ? values : [values];
  const found = new Set<string>();
  for (const raw of input) {
    const key = clean(raw)
      .toLowerCase()
      .replace(/[^a-z]/g, '');
    for (const [source, target] of Object.entries(literaryGenres))
      if (key.includes(source) && target !== 'Narrativa') found.add(target);
  }
  return [...found];
};
const scalar = (value: unknown) => (Array.isArray(value) ? value[0] : value);
const person = (value: unknown) => {
  const item = scalar(value);
  return typeof item === 'object' && item
    ? clean((item as Record<string, unknown>).name)
    : clean(item);
};
const titleCase = (value: string) =>
  value
    .split(/\s+/)
    .map((word, index) => {
      const lower = word.toLocaleLowerCase('it');
      return index > 0 &&
        /^(a|al|alla|con|da|dal|dalla|de|dei|degli|del|delle|della|di|e|il|in|la|le|lo|per|un|una)$/.test(
          lower,
        )
        ? lower
        : lower.charAt(0).toLocaleUpperCase('it') + lower.slice(1);
    })
    .join(' ');
export const naturalTitle = (value: string) => {
  const trimmed = value.trim();
  const normalized = /^[^a-zà-ÿ]*$/.test(trimmed)
    ? titleCase(trimmed)
    : trimmed;
  return normalized.replace(/\.\s+(?:un|una)\s+[^.?!]{8,180}\?$/i, '').trim();
};
function titleInfo(value: unknown) {
  const raw = clean(value);
  const match = raw.match(/\(([^()#]+?)(?:,\s*|\s+)#\s*(\d+)\)/i);
  const saga = match?.[1]?.trim() || '';
  const sagaOrder = match ? Number(match[2]) : null;
  const withoutSeries = raw
    .replace(/\s*\([^()]*#\s*\d+\)\s*/gi, ' ')
    .replace(/\.?\s*Ediz\.?\s*(?:italiana|italiano).*$/i, '')
    .replace(/\s+/g, ' ')
    .trim();
  return { title: naturalTitle(withoutSeries), saga, sagaOrder };
}
function labelValue(html: string, label: string) {
  const match = html.match(
    new RegExp(`${label}[\\s\\S]{0,450}?<a[^>]*>([\\s\\S]*?)<\\/a>`, 'i'),
  );
  return clean(match?.[1]);
}
function italianDetails(html: string, requestedCode: string) {
  const exact =
    html.match(
      new RegExp(
        `\\{[^{}]*"ean":"${requestedCode.replace(/[^0-9X]/gi, '')}"[^{}]*\\}`,
        'i',
      ),
    )?.[0] || '';
  let product: Record<string, unknown> = {};
  try {
    product = JSON.parse(exact);
  } catch {}
  const publisher = titleCase(
    clean(product.brand) || labelValue(html, 'Editore'),
  );
  const classification =
    labelValue(html, 'Classificazione') ||
    labelValue(html, 'Genere') ||
    clean(product.division);
  const analytics =
    html.match(
      new RegExp(
        `"item_id":"${requestedCode.replace(/[^0-9X]/gi, '')}"[\\s\\S]{0,1800}?}\\]`,
        'i',
      ),
    )?.[0] || '';
  const analyticsCategories = [
    ...analytics.matchAll(/"item_category\d*":"([^"]+)"/gi),
  ].map((match) => match[1]);
  const yearMatch = html.match(
    /Anno (?:edizione|pubblicazione):?[\s\S]{0,250}?\b((?:19|20)\d{2})\b/i,
  );
  return {
    publisher,
    genres: genres([...classification.split('>'), ...analyticsCategories]),
    publicationYear: Number(yearMatch?.[1]) || null,
  };
}
function nodes(value: unknown): Record<string, unknown>[] {
  if (Array.isArray(value)) return value.flatMap(nodes);
  if (!value || typeof value !== 'object') return [];
  const obj = value as Record<string, unknown>;
  return [obj, ...Object.values(obj).flatMap(nodes)];
}
function jsonLd(html: string) {
  const blocks = [
    ...html.matchAll(
      /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi,
    ),
  ];
  return blocks.flatMap((match) => {
    try {
      return nodes(JSON.parse(match[1]));
    } catch {
      return [];
    }
  });
}
function genresFromHtml(html: string) {
  const found = new Set<string>();
  for (const match of html.matchAll(
    /(?:genres?|shelves|categories|tags)[^[<]{0,80}(?:\[|>)([\s\S]{0,1600}?)(?:\]|<\/)/gi,
  ))
    for (const genre of genres(match[1])) found.add(genre);
  for (const match of html.matchAll(/\/(?:genres|shelf)\/([a-z-]+)/gi))
    for (const genre of genres(match[1])) found.add(genre);
  if (
    /(?:romanzo|libro|storia|uno tra i migliori)[^.!?]{0,60}\bthriller\b/i.test(
      html,
    )
  )
    found.add('Thriller');
  return [...found];
}
function candidatesFrom(
  html: string,
  source: string,
  requestedCode: string,
  codeType: string,
): Candidate[] {
  const output: Candidate[] = [];
  const italian = italianDetails(html, requestedCode);
  const htmlDescription = plotFromHtml(html, requestedCode);
  const htmlGenres = genresFromHtml(html);
  for (const item of jsonLd(html)) {
    const type = clean(item['@type']);
    if (!/(Book|Product)/i.test(type)) continue;
    const info = titleInfo(item.name || item.headline);
    const author = person(item.author || item.creator || item.brand);
    if (!info.title || !author) continue;
    const explicitCode = clean(item.isbn || item.gtin || item.sku).replace(
      /[\s-]/g,
      '',
    );
    if (
      explicitCode &&
      explicitCode.toUpperCase() !==
        requestedCode.replace(/[\s-]/g, '').toUpperCase()
    )
      continue;
    const date = clean(item.datePublished || item.releaseDate);
    const structuredSeries =
      typeof item.isPartOf === 'object' && item.isPartOf
        ? clean((item.isPartOf as Record<string, unknown>).name)
        : '';
    const imageValue = scalar(item.image);
    const coverUrl =
      typeof imageValue === 'object' && imageValue
        ? rawText((imageValue as Record<string, unknown>).url)
        : rawText(imageValue);
    const description = plot(item.description) || htmlDescription;
    const enrichedGenres = new Set([
      ...genres(item.genre || item.category),
      ...htmlGenres,
      ...italian.genres,
      ...inferGenres(description),
    ]);
    if (/\bspicy\b|contenuti sessuali espliciti/i.test(description))
      enrichedGenres.add('Spicy');
    output.push({
      title: info.title,
      author,
      ...names(author),
      code: clean(item.isbn || item.gtin || item.sku || requestedCode),
      codeType,
      genres: [...enrichedGenres],
      publisher: person(item.publisher) || italian.publisher,
      publicationYear:
        Number(date.match(/\d{4}/)?.[0]) || italian.publicationYear,
      saga: structuredSeries || info.saga,
      sagaOrder: info.sagaOrder,
      prequel: '',
      sequel: '',
      coverUrl: coverUrl || null,
      plot: description,
      notes: '',
      rating: 0,
      isRead: false,
      inLibrary: false,
      lentTo: '',
      lentDate: '',
      source,
    });
  }
  return output;
}
async function page(url: string) {
  try {
    const response = await fetch(url, {
      headers: {
        'user-agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0.0.0 Safari/537.36',
        'accept-language': 'it-IT,it;q=0.9,en;q=0.7',
      },
      signal: AbortSignal.timeout(9000),
    });
    return response.ok ? await response.text() : '';
  } catch {
    return '';
  }
}
async function source(url: string, name: string, query: string, type: string) {
  return candidatesFrom(await page(url), name, query, type);
}
function inferGenres(value: string) {
  const found = new Set<string>();
  if (
    /amore|innamor|romantic|romance|desiderio|passione|storia d'amore|baciare|sentimento/i.test(
      value,
    )
  )
    found.add('Romanzo rosa');
  if (
    /vampir|licantrop|fantasm|demoni?|soprannatural|spirito|aldilà|angeli? custodi?/i.test(
      value,
    )
  )
    found.add('Paranormale');
  if (
    /orrore|horror|gotic|scenario da incubo|cadavere|carne in decomposizione|terrore/i.test(
      value,
    )
  )
    found.add('Horror');
  if (
    /magia|magico|streg|viaggi\w* nel tempo|draghi|regno incantato|fantasm|spirito|demoni?|angeli?|esseri? (?:quasi )?immortali|poteri soprannaturali/i.test(
      value,
    )
  )
    found.add('Fantasy');
  if (
    /thriller|serial killer|omicid|assassin|braccat|indagin|spirale di violenza|dare la caccia/i.test(
      value,
    )
  )
    found.add('Thriller');
  if (
    /young adult|adolescen[^.]{0,100}(?:scuola|liceo|college)|ragazz[oa][^.]{0,100}(?:scuola|liceo|college|poter)|(?:scuola|liceo|college)[^.]{0,100}ragazz/i.test(
      value,
    )
  )
    found.add('Young adult');
  if (
    /storia[^.]{0,180}(?:secolo|cinquecento|seicento|settecento|ottocento|novecento)|(?:secolo|cinquecento|seicento|settecento|ottocento|novecento)[^.]{0,180}storia|ambientat[oa][^.]{0,100}(?:\b1[5-9]\d{2}\b|prima guerra mondiale|seconda guerra mondiale|epoca vittoriana)/i.test(
      value,
    )
  )
    found.add('Romanzo storico');
  return [...found];
}
function bestPlot(first: string, second: string) {
  const score = (value: string) =>
    value.length -
    (/reviews? from|community for readers|acquista|spedizione/i.test(value)
      ? 500
      : 0) -
    (/[.…]$/.test(value) && value.length < 300 ? 300 : 0);
  return score(second) > score(first) ? second : first;
}
function merge(primary: Candidate, secondary: Candidate) {
  return {
    ...secondary,
    ...primary,
    title:
      secondary.title.length < primary.title.length
        ? secondary.title
        : primary.title,
    genres: [
      ...new Set([
        ...primary.genres,
        ...secondary.genres,
        ...inferGenres(`${primary.plot} ${secondary.plot}`),
      ]),
    ],
    publisher:
      /^(?:Goodreads|The StoryGraph)(?:\s|$)/i.test(primary.source) &&
      secondary.publisher
        ? secondary.publisher
        : primary.publisher || secondary.publisher,
    publicationYear: primary.publicationYear || secondary.publicationYear,
    saga: primary.saga || secondary.saga,
    sagaOrder: primary.sagaOrder || secondary.sagaOrder,
    prequel: primary.prequel || secondary.prequel,
    sequel: primary.sequel || secondary.sequel,
    coverUrl: primary.coverUrl || secondary.coverUrl,
    plot: bestPlot(primary.plot, secondary.plot),
    source: `${primary.source} + ${secondary.source}`,
  };
}
async function indexedSources(query: string, type: string) {
  const html = await page(
    `https://html.duckduckgo.com/html/?q=${encodeURIComponent(query)}`,
  );
  const urls = [...html.matchAll(/uddg=([^&"]+)/gi)]
    .map((match) => {
      try {
        return decodeURIComponent(match[1]);
      } catch {
        return '';
      }
    })
    .filter((url) =>
      /https?:\/\/(?:www\.)?(?:libraccio\.it|unilibro\.it|ibs\.it|libreriauniversitaria\.it|lafeltrinelli\.it|mondadoristore\.it|giunti\.it|newtoncompton\.com|hoepli\.it|abebooks\.(?:com|it|co\.uk))\//i.test(
        url,
      ),
    );
  const unique = [...new Set(urls)].slice(0, 8);
  const pages = await Promise.all(
    unique.map(async (url) => ({ url, html: await page(url) })),
  );
  return pages.flatMap((item) =>
    candidatesFrom(
      item.html,
      new URL(item.url).hostname.replace(/^www\./, ''),
      query,
      type,
    ),
  );
}
async function retailerProductSources(query: string, type: string) {
  const retailers = [
    {
      name: 'IBS',
      origin: 'https://www.ibs.it',
      search: `https://www.ibs.it/search/?query=${encodeURIComponent(query)}`,
    },
    {
      name: 'Feltrinelli',
      origin: 'https://www.lafeltrinelli.it',
      search: `https://www.lafeltrinelli.it/search?query=${encodeURIComponent(query)}`,
    },
  ];
  const found: Candidate[] = [];
  for (const retailer of retailers) {
    const search = await page(retailer.search);
    const links = [...search.matchAll(/href=["']([^"']+)["']/gi)]
      .map((match) => decodeHtml(match[1]))
      .filter(
        (link) =>
          link.includes(query) && /\/e\/\d{10,13}(?:[/?#]|$)/i.test(link),
      );
    for (const link of [...new Set(links)].slice(0, 2)) {
      try {
        const url = new URL(link, retailer.origin).toString();
        found.push(
          ...candidatesFrom(await page(url), retailer.name, query, type),
        );
      } catch {}
    }
  }
  return found;
}
const decodeEntities = (value: string) =>
  clean(
    value
      .replace(/&#x27;|&#39;|&apos;/gi, "'")
      .replace(/&quot;/gi, '"')
      .replace(/&amp;/gi, '&'),
  );
const escapeRegex = (value: string) =>
  value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
const withoutSeries = (title: string, saga: string) =>
  title
    .replace(
      new RegExp(
        `\\s*[.:–-]\\s*${escapeRegex(saga)}(?:\\s*\\([^)]*\\))?.*$`,
        'i',
      ),
      '',
    )
    .replace(/\s*\([^)]*(?:edition|edizione|tascabil)[^)]*\)\s*$/i, '')
    .trim();
async function indexedSeries(code: string) {
  if (!/^\d{10,13}$/.test(code)) return null;
  const search = await page(
    `https://www.abebooks.com/servlet/SearchResults?isbn=${encodeURIComponent(code)}`,
  );
  const meta = search.match(
    /aria-label="Book\s+(\d+)\s+of\s+\d+\s+-\s+([^,"]+)[^"]*"[\s\S]{0,1000}?href="([^"]+)"/i,
  );
  if (!meta) return null;
  const order = Number(meta[1]);
  const saga = titleCase(decodeEntities(meta[2]));
  const seriesUrl = new URL(meta[3], 'https://www.abebooks.com').toString();
  const listing = await page(seriesUrl);
  const records = listing
    .split(/data-test-id="listing-item-/i)
    .flatMap((chunk) => {
      const position = Number(
        chunk.match(/aria-label="Book\s+(\d+)\s+of\s+\d+\s+-/i)?.[1],
      );
      const rawTitle = chunk.match(
        /data-test-id="listing-title"[^>]*>([\s\S]*?)<\/h2>/i,
      )?.[1];
      const italian = /data-test-id="language-[^"]*">Language:\s*Italian/i.test(
        chunk,
      );
      if (!position || !rawTitle) return [];
      return [
        {
          position,
          title: withoutSeries(titleCase(decodeEntities(rawTitle)), saga),
          italian,
        },
      ];
    });
  const titleAt = (position: number) => {
    const matches = records.filter(
      (item) =>
        item.position === position && !/^Book\s+\d|^ISBN\b/i.test(item.title),
    );
    return (
      matches.find((item) => item.italian)?.title || matches[0]?.title || ''
    );
  };
  const cover =
    search.match(
      new RegExp(
        `https://pictures\\.abebooks\\.com/isbn/${code}-[^"']+?\\.(?:jpg|webp)`,
        'i',
      ),
    )?.[0] || '';
  return {
    saga,
    sagaOrder: order,
    prequel: order > 1 ? titleAt(order - 1) : '',
    sequel: titleAt(order + 1),
    coverUrl: cover,
  };
}
async function neighbours(saga: string, order: number | null, author: string) {
  if (!saga || !order) return { prequel: '', sequel: '' };
  const catalog = italianSeriesCatalog.find(
    (item) =>
      item.name.toLocaleLowerCase('it') === saga.toLocaleLowerCase('it'),
  );
  if (catalog)
    return {
      prequel: order > 1 ? catalog.titles[order - 2] || '' : '',
      sequel: catalog.titles[order] || '',
    };
  const html = await page(
    `https://www.goodreads.com/search?q=${encodeURIComponent(`${saga} ${author}`)}`,
  );
  const titles = [
    ...html.matchAll(/<img\s+alt="([^"]+)"\s+class="bookCover"/gi),
  ].map((match) => titleInfo(match[1]));
  const pick = async (wanted: number) => {
    const fromGoodreads = titles.find(
      (item) =>
        item.saga.toLocaleLowerCase() === saga.toLocaleLowerCase() &&
        item.sagaOrder === wanted,
    )?.title;
    if (fromGoodreads && likelyItalianTitle(fromGoodreads))
      return fromGoodreads;
    const indexed = await indexedSearch(`${saga} ${wanted} ${author} italiano`);
    const candidates = indexedResultTitles(indexed)
      .map((match) =>
        titleInfo(
          decodeEntities(match[1]).replace(
            new RegExp(`\\s+di\\s+${escapeRegex(author)}.*$`, 'i'),
            '',
          ),
        ),
      )
      .filter(
        (item) => item.sagaOrder === wanted && likelyItalianTitle(item.title),
      );
    return candidates[0]?.title || '';
  };
  return {
    prequel: order > 1 ? await pick(order - 1) : '',
    sequel: await pick(order + 1),
  };
}
const likelyItalianTitle = (value: string) =>
  !/^(?:der|die|das|ein|eine|the|a)\b/i.test(value) &&
  !/\b(?:tod|toten\w*|mord\w*|death|dead|whispers?|calling)\b/i.test(value);

async function indexedSearch(query: string) {
  const encoded = encodeURIComponent(query);
  const primary = await page(`https://html.duckduckgo.com/html/?q=${encoded}`);
  if (/class="result__a"/i.test(primary)) return primary;
  return page(`https://lite.duckduckgo.com/lite/?q=${encoded}`);
}

const indexedResultTitles = (html: string) => [
  ...html.matchAll(/class="(?:result__a|result-link)"[^>]*>([\s\S]*?)<\/a>/gi),
];

async function relationFor(title: string, author: string) {
  const html = await indexedSearch(
    `${title} ${author} seguito romanzo precedente`,
  );
  const text = decodeEntities(html);
  const raw =
    text.match(/\bDopo\s+([^,.]{3,80}),\s+(?:una|un|la|il)\b/i)?.[1] ||
    text.match(/storia iniziata in\s+([^.<]{3,80})/i)?.[1] ||
    '';
  const prequel = naturalTitle(raw.replace(/\s+(?:di|by)\s+.+$/i, '').trim());
  return prequel ? { saga: prequel, sagaOrder: 2, prequel } : null;
}
async function seriesFor(title: string, author: string) {
  const catalogMatch = catalogSeriesFor(title);
  if (catalogMatch) return catalogMatch;
  for (const query of [
    `${title} ${author}`,
    `${title.split(/\s+/)[0]} ${author}`,
  ]) {
    const html = await page(
      `https://www.goodreads.com/search?q=${encodeURIComponent(query)}`,
    );
    const meta = html.match(
      /<meta\s+property="og:title"\s+content="([^"]+)"/i,
    )?.[1];
    const titles = [
      ...(meta ? [titleInfo(meta)] : []),
      ...[...html.matchAll(/<img\s+alt="([^"]+)"\s+class="bookCover"/gi)].map(
        (match) => titleInfo(match[1]),
      ),
    ];
    const found = titles.find(
      (item) =>
        item.title.toLocaleLowerCase() === title.toLocaleLowerCase() &&
        item.saga &&
        item.sagaOrder,
    );
    if (found) return found;
  }
  const indexed = await indexedSearch(`"${title}" "${author}" Goodreads`);
  const indexedTitles = indexedResultTitles(indexed).map((match) =>
    titleInfo(decodeEntities(match[1]).replace(/\s+by\s+.+$/i, '')),
  );
  const found = indexedTitles.find((item) => item.saga && item.sagaOrder);
  if (found) return found;
  return null;
}

export async function GET(request: Request) {
  const query = new URL(request.url).searchParams.get('q')?.trim() || '';
  if (!query)
    return Response.json({ error: 'Inserisci un codice' }, { status: 400 });
  const type = detect(query);
  const normalized = query.replace(/[\s-]/g, '');
  const [goodreads, italian] = await Promise.all([
    source(
      `https://www.goodreads.com/search?q=${encodeURIComponent(query)}`,
      'Goodreads',
      query,
      type,
    ),
    source(
      `https://www.libreriauniversitaria.it/ricerca/query/${encodeURIComponent(normalized)}/gzuzqkrI_qOHGlQ966Pc-A`,
      'Libreria Universitaria',
      query,
      type,
    ),
  ]);
  let results =
    goodreads.length && italian.length
      ? [
          merge(goodreads[0], italian[0]),
          ...goodreads.slice(1),
          ...italian.slice(1),
        ]
      : [...goodreads, ...italian];
  const title = goodreads[0]?.title || query;
  const story = await source(
    `https://app.thestorygraph.com/browse?search_term=${encodeURIComponent(title)}`,
    'The StoryGraph',
    query,
    type,
  );
  if (results.length && story.length)
    results = [merge(results[0], story[0]), ...results.slice(1)];
  else if (!results.length) results = story;
  if (
    !results.length ||
    results.some(
      (item) =>
        !item.plot ||
        !item.coverUrl ||
        !item.publisher ||
        !item.publicationYear ||
        item.genres.length < 2,
    )
  ) {
    const fallbacks = await Promise.all([
      source(
        `https://www.ibs.it/search/?query=${encodeURIComponent(query)}`,
        'IBS',
        query,
        type,
      ),
      source(
        `https://www.lafeltrinelli.it/search?query=${encodeURIComponent(query)}`,
        'Feltrinelli',
        query,
        type,
      ),
      source(
        `https://www.mondadoristore.it/search/?g=${encodeURIComponent(query)}`,
        'Mondadori Store',
        query,
        type,
      ),
      indexedSources(normalized, type),
      retailerProductSources(normalized, type),
    ]);
    const additional = fallbacks.flat();
    if (results.length && additional.length) {
      const exact = additional.filter(
        (item) =>
          item.code.replace(/[\s-]/g, '').toUpperCase() ===
            normalized.toUpperCase() ||
          item.title.toLocaleLowerCase('it') ===
            results[0].title.toLocaleLowerCase('it'),
      );
      results = [
        exact.reduce((current, item) => merge(current, item), results[0]),
        ...results.slice(1),
        ...additional.filter((item) => !exact.includes(item)),
      ];
    } else results = [...results, ...additional];
  }
  if (!results.length && catalogCorrections[normalized]) {
    const correction = catalogCorrections[normalized];
    results = [
      {
        title: '',
        author: '',
        authorFirstName: '',
        authorLastName: '',
        code: normalized,
        codeType: type,
        genres: [],
        publisher: '',
        publicationYear: null,
        saga: '',
        sagaOrder: null,
        prequel: '',
        sequel: '',
        coverUrl: null,
        plot: '',
        notes: '',
        rating: 0,
        isRead: false,
        inLibrary: false,
        lentTo: '',
        lentDate: '',
        source: 'Catalogo verificato',
        ...correction,
      },
    ];
  }
  if (results[0]) {
    const catalogMatch = catalogSeriesFor(results[0].title);
    if (catalogMatch)
      results[0] = {
        ...results[0],
        ...catalogMatch,
        prequel:
          catalogMatch.sagaOrder > 1
            ? italianSeriesCatalog.find(
                (series) => series.name === catalogMatch.saga,
              )?.titles[catalogMatch.sagaOrder - 2] || ''
            : '',
        sequel:
          italianSeriesCatalog.find(
            (series) => series.name === catalogMatch.saga,
          )?.titles[catalogMatch.sagaOrder] || '',
      };
    const indexed =
      !results[0].saga ||
      !results[0].sagaOrder ||
      !results[0].prequel ||
      !results[0].sequel
        ? await indexedSeries(normalized)
        : null;
    if (indexed)
      results[0] = {
        ...results[0],
        title: withoutSeries(results[0].title, indexed.saga),
        saga: results[0].saga || indexed.saga,
        sagaOrder: results[0].sagaOrder || indexed.sagaOrder,
        prequel: results[0].prequel || indexed.prequel,
        sequel: results[0].sequel || indexed.sequel,
        coverUrl: results[0].coverUrl || indexed.coverUrl,
      };
    if (!results[0].saga || !results[0].sagaOrder) {
      const found = await seriesFor(results[0].title, results[0].author);
      if (found)
        results[0] = {
          ...results[0],
          saga: found.saga,
          sagaOrder: found.sagaOrder,
        };
      else {
        const relation = await relationFor(results[0].title, results[0].author);
        if (relation) results[0] = { ...results[0], ...relation };
      }
    }
    if (!likelyItalianTitle(results[0].prequel)) results[0].prequel = '';
    if (!likelyItalianTitle(results[0].sequel)) results[0].sequel = '';
    const adjacent = await neighbours(
      results[0].saga,
      results[0].sagaOrder,
      results[0].author,
    );
    const correction = catalogCorrections[normalized];
    results[0] = {
      ...results[0],
      prequel: results[0].prequel || adjacent.prequel,
      sequel: results[0].sequel || adjacent.sequel,
      ...correction,
      genres: correction?.genres || [
        ...new Set([...results[0].genres, ...inferGenres(results[0].plot)]),
      ],
    };
    results[0].genres = [
      ...new Set([
        ...results[0].genres,
        ...(seriesGenres[results[0].saga] || []),
      ]),
    ];
  }
  const seen = new Set<string>();
  results = results
    .filter((item) => {
      const key = `${item.title.toLowerCase()}|${item.author.toLowerCase()}|${item.code}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .slice(0, 8);
  // A code identifies an edition, not a list of search suggestions.  Retailers
  // often expose the same edition several times with complementary metadata;
  // collapse those records so the form always receives the fully enriched
  // candidate instead of making the user choose a partial duplicate.
  const exact = results.filter(
    (item) =>
      item.code.replace(/[\s-]/g, '').toUpperCase() ===
      normalized.toUpperCase(),
  );
  if (exact.length) {
    const consolidated = exact.reduce(
      (current, item) => merge(current, item),
      results[0] && exact.includes(results[0]) ? results[0] : exact[0],
    );
    results = [
      {
        ...consolidated,
        title: naturalTitle(clean(consolidated.title)),
        genres: [
          ...new Set([
            ...consolidated.genres,
            ...inferGenres(consolidated.plot),
            ...(seriesGenres[consolidated.saga] || []),
          ]),
        ],
      },
    ];
  }
  return Response.json({ codeType: type, candidates: results });
}
