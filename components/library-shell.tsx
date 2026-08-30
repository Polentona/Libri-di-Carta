'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  BookOpen,
  ChevronLeft,
  ChevronRight,
  Plus,
  Search,
  Star,
} from 'lucide-react';
import { BookCard } from '@/components/book-card';
import { BookDialog } from '@/components/book-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Book } from '@/types/book';
import { coverSrc } from '@/lib/cover-url';
const sections = [
  'Home',
  'La mia libreria',
  'Letti',
  'Da leggere',
  'Prestati',
  'Autori',
  'Categorie',
  'Saghe e trilogie',
] as const;
type Section = (typeof sections)[number];
const PAGE_SIZE = 10;
export function LibraryShell() {
  const [books, setBooks] = useState<Book[]>([]),
    [section, setSection] = useState<Section>('Home'),
    [query, setQuery] = useState(''),
    [page, setPage] = useState(1),
    [dialogOpen, setDialogOpen] = useState(false),
    [editing, setEditing] = useState<Book | null>(null),
    [letter, setLetter] = useState(''),
    [author, setAuthor] = useState(''),
    [genre, setGenre] = useState(''),
    [loading, setLoading] = useState(true);
  useEffect(() => {
    void fetch('/api/books')
      .then((r) => r.json() as Promise<{ books?: Book[] }>)
      .then(
        (d) => setBooks(d.books || []),
        () => setBooks([]),
      )
      .finally(() => setLoading(false));
  }, []);
  useEffect(() => setPage(1), [section, query, letter, author, genre]);
  const sorted = useMemo(() => [...books].sort(sortBooks), [books]);
  const searched = useMemo(() => {
    const q = fold(query);
    return q
      ? sorted.filter((b) =>
          fold(`${b.author} ${b.title} ${b.code}`).includes(q),
        )
      : sorted;
  }, [sorted, query]);
  const filtered = useMemo(
    () =>
      searched.filter((b) =>
        section === 'La mia libreria'
          ? b.inLibrary
          : section === 'Letti'
            ? b.isRead
            : section === 'Da leggere'
              ? !b.isRead
              : section === 'Prestati'
                ? !!b.lentTo
                : section === 'Autori' && author
                  ? b.author === author
                  : section === 'Categorie' && genre
                    ? b.genres.includes(genre)
                    : true,
      ),
    [searched, section, author, genre],
  );
  const genres = useMemo(
    () =>
      [...new Set(books.flatMap((b) => b.genres))].sort((a, b) =>
        a.localeCompare(b, 'it'),
      ),
    [books],
  );
  const authors = useMemo(
    () =>
      [...new Set(books.map((b) => b.author))].sort((a, b) =>
        authorKey(a).localeCompare(authorKey(b), 'it'),
      ),
    [books],
  );
  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const visible = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  function chooseSection(next: Section) {
    setSection(next);
    setAuthor('');
    setGenre('');
    setLetter('');
  }
  async function patch(book: Book, changes: Partial<Book>) {
    const r = await fetch(`/api/books/${book.id}`, {
      method: 'PATCH',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(changes),
    });
    const d = (await r.json()) as { book?: Book };
    if (d.book) setBooks((c) => c.map((i) => (i.id === book.id ? d.book! : i)));
  }
  async function remove(book: Book) {
    if (!window.confirm(`Eliminare “${book.title}”?`)) return;
    await fetch(`/api/books/${book.id}`, { method: 'DELETE' });
    setBooks((c) => c.filter((i) => i.id !== book.id));
  }
  return (
    <div className="paper-background px-3 pb-16 pt-3 sm:px-5">
      <header className="sticky top-3 z-40 mx-auto flex max-w-[1880px] flex-wrap items-center gap-3 rounded-[18px] border border-[#efe2d2] bg-[#fffaf2]/96 px-5 py-2.5 shadow-[0_7px_24px_rgba(103,76,49,.08)] backdrop-blur-sm lg:grid lg:grid-cols-[1fr_auto_1fr]">
        <button
          onClick={() => chooseSection('Home')}
          className="mr-auto flex items-center gap-3 whitespace-nowrap lg:mr-0 lg:justify-self-start"
        >
          <BookLogo />
          <span className="text-[28px] font-bold leading-none">
            Libri di Carta
          </span>
        </button>
        <nav className="order-3 flex w-full gap-1 overflow-x-auto lg:order-none lg:w-auto lg:justify-self-center">
          {sections.map((item) => (
            <button
              key={item}
              onClick={() => chooseSection(item)}
              className={`shrink-0 border-b-2 px-2.5 py-2 text-[16px] ${section === item ? 'border-[#574d44] font-bold' : 'border-transparent hover:border-[#c8b49d]'}`}
            >
              {item}
            </button>
          ))}
        </nav>
        <div className="order-2 flex items-center gap-3 lg:order-none lg:justify-self-end">
          <label className="relative hidden xl:block">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="h-11 w-[250px] bg-[#fffdfa] pl-9"
              placeholder="Cerca autore, titolo o codice…"
            />
          </label>
          <Button
            onClick={() => {
              setEditing(null);
              setDialogOpen(true);
            }}
            variant="outline"
            className="h-11 bg-[#fff7eb]"
          >
            <Plus /> Aggiungi libro
          </Button>
        </div>
      </header>
      <main className="mx-auto mt-10 max-w-[1510px] sm:mt-12">
        <div className="mb-7">
          <h1 className="text-[38px] leading-tight">{section}</h1>
          <p className="mt-2 text-[17px] text-[#83766b]">{subtitle(section)}</p>
        </div>
        <label className="relative mb-7 block xl:hidden">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2" />
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="h-11 bg-[#fffaf3]/95 pl-9"
            placeholder="Cerca autore, titolo o codice…"
          />
        </label>
        {section === 'Autori' && !author && (
          <Authors
            authors={authors}
            letter={letter}
            setLetter={setLetter}
            setAuthor={setAuthor}
          />
        )}{' '}
        {section === 'Categorie' && (
          <div className="mb-7 max-w-sm">
            <Select
              value={genre || null}
              onValueChange={(value) => setGenre(value || '')}
            >
              <SelectTrigger className="h-12 bg-[#fffaf3]">
                <SelectValue placeholder="Scegli una categoria" />
              </SelectTrigger>
              <SelectContent>
                {genres.map((g) => (
                  <SelectItem key={g} value={g}>
                    {g}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
        {section === 'Saghe e trilogie' ? (
          <Sagas books={filtered} />
        ) : (
          (section !== 'Autori' || !!author) &&
          (loading ? (
            <Empty label="Caricamento…" />
          ) : visible.length ? (
            <div className="grid gap-6">
              {visible.map((book) => (
                <BookCard
                  key={book.id}
                  book={book}
                  onEdit={() => {
                    setEditing(book);
                    setDialogOpen(true);
                  }}
                  onDelete={() => remove(book)}
                  onPatch={(changes) => patch(book, changes)}
                />
              ))}
            </div>
          ) : (
            <Empty
              label={query ? 'Nessun risultato' : 'Nessun libro inserito'}
            />
          ))
        )}
        {section !== 'Saghe e trilogie' && filtered.length > PAGE_SIZE && (
          <Pagination page={page} pages={pages} setPage={setPage} />
        )}
      </main>
      <BookDialog
        open={dialogOpen}
        editing={editing}
        onClose={() => setDialogOpen(false)}
        onSaved={(book) =>
          setBooks((c) =>
            c.some((i) => i.id === book.id)
              ? c.map((i) => (i.id === book.id ? book : i))
              : [...c, book],
          )
        }
      />
    </div>
  );
}
function Authors({
  authors,
  letter,
  setLetter,
  setAuthor,
}: {
  authors: string[];
  letter: string;
  setLetter: (v: string) => void;
  setAuthor: (v: string) => void;
}) {
  const shown = authors.filter(
    (n) => !letter || fold(authorKey(n)).startsWith(fold(letter)),
  );
  return (
    <div>
      <div className="mb-7 flex flex-wrap justify-center gap-1">
        {'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((x) => (
          <button
            key={x}
            onClick={() => setLetter(letter === x ? '' : x)}
            className={`grid size-9 place-items-center rounded-md border border-[#bca68f] text-lg ${letter === x ? 'bg-[#77906d] text-white' : 'bg-[#fff8ef]/90 hover:bg-[#eadbc8]'}`}
          >
            {x}
          </button>
        ))}
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {shown.map((name) => (
          <button
            key={name}
            onClick={() => setAuthor(name)}
            className="rounded-2xl border border-[#e2cfb8] bg-[#fffaf3]/94 px-5 py-5 text-left text-xl shadow-sm"
          >
            {name}
            <small className="mt-1 block text-[#827468]">
              Visualizza i libri
            </small>
          </button>
        ))}
      </div>
      {!shown.length && <Empty label="Nessun autore inserito" />}
    </div>
  );
}
function Sagas({ books }: { books: Book[] }) {
  const grouped = new Map<string, Book[]>();
  for (const b of books.filter((x) => x.saga))
    grouped.set(b.saga, [...(grouped.get(b.saga) || []), b]);
  if (!grouped.size) return <Empty label="Nessuna saga inserita" />;
  return (
    <div className="grid gap-6">
      {[...grouped].map(([name, list]) => (
        <SagaRow key={name} name={name} books={list} />
      ))}
    </div>
  );
}
function SagaRow({ name, books }: { name: string; books: Book[] }) {
  const row = useRef<HTMLDivElement>(null);
  const [overflow, setOverflow] = useState(false);
  const saga = [...books].sort(
    (a, b) =>
      (a.sagaOrder ?? 999) - (b.sagaOrder ?? 999) ||
      a.title.localeCompare(b.title, 'it'),
  );
  const avg = saga.reduce((s, b) => s + b.rating, 0) / saga.length;
  useEffect(() => {
    const check = () =>
      setOverflow(
        Boolean(
          row.current && row.current.scrollWidth > row.current.clientWidth + 2,
        ),
      );
    check();
    const observer = new ResizeObserver(check);
    if (row.current) observer.observe(row.current);
    return () => observer.disconnect();
  }, [books.length]);
  return (
    <section className="grid gap-5 rounded-[20px] border border-[#d9bea0] bg-[#fbf4e9]/96 p-6 lg:grid-cols-[270px_minmax(0,1fr)]">
      <div>
        <h2 className="text-[27px] font-bold">{name}</h2>
        <p className="text-lg text-[#75685e]">{saga[0]?.author}</p>
        <p className="mt-3 flex items-center gap-2">
          <Star className="size-5 fill-[#e5a82a] text-[#e5a82a]" />
          {avg.toFixed(1)} media
        </p>
      </div>
      <div className="relative min-w-0">
        <div ref={row} className="flex gap-4 overflow-x-hidden pb-2">
          {saga.map((b) => (
            <div key={b.id} className="w-28 shrink-0">
              {b.coverUrl ? (
                <img
                  src={coverSrc(b.coverUrl, b.code)}
                  alt={b.title}
                  className="h-40 w-28 rounded object-cover shadow"
                />
              ) : (
                <div className="grid h-40 place-items-center rounded bg-[#e5d2bb]">
                  <BookOpen />
                </div>
              )}
              <p className="mt-2 line-clamp-2 text-sm font-bold">{b.title}</p>
              {b.inLibrary && (
                <small className="text-[#6e8865]">in libreria</small>
              )}
            </div>
          ))}
        </div>
        {overflow && (
          <button
            onClick={() =>
              row.current?.scrollBy({
                left: row.current.clientWidth * 0.75,
                behavior: 'smooth',
              })
            }
            className="absolute right-1 top-16 grid size-10 place-items-center rounded-full border border-[#bda486] bg-[#fffdf9] shadow"
            aria-label="Mostra altri libri della saga"
          >
            <ChevronRight />
          </button>
        )}
      </div>
    </section>
  );
}
function Pagination({
  page,
  pages,
  setPage,
}: {
  page: number;
  pages: number;
  setPage: (v: number) => void;
}) {
  return (
    <div className="mt-8 flex items-center justify-center gap-4">
      <Button
        variant="outline"
        size="icon"
        disabled={page === 1}
        onClick={() => setPage(page - 1)}
      >
        <ChevronLeft />
      </Button>
      <span>
        Pagina {page} di {pages}
      </span>
      <Button
        variant="outline"
        size="icon"
        disabled={page === pages}
        onClick={() => setPage(page + 1)}
      >
        <ChevronRight />
      </Button>
    </div>
  );
}
function Empty({ label }: { label: string }) {
  return (
    <div className="rounded-[20px] border border-[#ead9c6] bg-[#fffaf3]/88 px-6 py-20 text-center shadow-sm">
      <BookOpen className="mx-auto mb-4 size-11 text-[#8a9c7d]" />
      <p className="text-[23px]">{label}</p>
      {label === 'Nessun libro inserito' && (
        <p className="mt-1 text-[#887b70]">
          Usa “Aggiungi libro” per creare la prima scheda.
        </p>
      )}
    </div>
  );
}
function BookLogo() {
  return (
    <span className="relative block h-9 w-10">
      <i className="absolute left-1 top-0 h-7 w-5 rounded-sm bg-[#6ed36e]" />
      <i className="absolute left-3 top-2 h-7 w-5 rounded-sm bg-[#f05aa7]" />
      <i className="absolute left-5 top-4 h-6 w-5 rounded-sm bg-[#4595e8]" />
    </span>
  );
}
function fold(v: string) {
  return v
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}
function authorKey(v: string) {
  const p = v.trim().split(/\s+/);
  return `${p.at(-1) || ''} ${p.slice(0, -1).join(' ')}`;
}
function sortBooks(a: Book, b: Book) {
  return (
    a.authorLastName.localeCompare(b.authorLastName, 'it') ||
    a.authorFirstName.localeCompare(b.authorFirstName, 'it') ||
    a.saga.localeCompare(b.saga, 'it') ||
    (a.sagaOrder ?? 999) - (b.sagaOrder ?? 999) ||
    a.title.localeCompare(b.title, 'it')
  );
}
function subtitle(s: Section) {
  return (
    {
      Home: 'Tutti i libri inseriti nel sito.',
      'La mia libreria': 'I romanzi presenti nella tua libreria.',
      Letti: 'I romanzi che hai già letto.',
      'Da leggere': 'I romanzi ancora da leggere.',
      Prestati: 'I libri che hai prestato.',
      Autori: 'Esplora la libreria per autore.',
      Categorie: 'Esplora la libreria per genere.',
      'Saghe e trilogie': 'Tutte le saghe e i romanzi che ne fanno parte.',
    } as Record<Section, string>
  )[s];
}
