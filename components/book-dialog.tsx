'use client';
import { useEffect, useRef, useState } from 'react';
import { BookOpen, ImageUp, LoaderCircle, Search, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import type { Book, BookDraft } from '@/types/book';
import { emptyBook } from '@/types/book';
import { coverSrc } from '@/lib/cover-url';

type Option = BookDraft & { source?: string };
export function BookDialog({
  open,
  editing,
  onClose,
  onSaved,
}: {
  open: boolean;
  editing: Book | null;
  onClose: () => void;
  onSaved: (book: Book) => void;
}) {
  const [draft, setDraft] = useState<BookDraft>(emptyBook);
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState<Option[]>([]);
  const [searching, setSearching] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState('');
  const lastAutomaticQuery = useRef('');
  useEffect(() => {
    if (!open) return;
    setDraft(
      editing ? (({ id: _id, ...rest }) => rest)(editing) : { ...emptyBook },
    );
    setQuery(editing?.code || '');
    setOptions([]);
    setStatus('');
  }, [open, editing]);
  const set = <K extends keyof BookDraft>(key: K, value: BookDraft[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));
  async function lookup(value = query) {
    const code = value.trim();
    if (!code) {
      setStatus('Inserisci un codice.');
      return;
    }
    setSearching(true);
    setStatus('Ricerca automatica dei dati…');
    setOptions([]);
    try {
      const response = await fetch(`/api/lookup?q=${encodeURIComponent(code)}`);
      const result = (await response.json()) as {
        candidates?: Option[];
        codeType?: string;
        error?: string;
      };
      if (!response.ok) throw new Error(result.error);
      const found = result.candidates || [];
      setOptions(found);
      if (found.length === 1)
        setDraft((current) => ({ ...current, ...found[0] }));
      else
        setDraft((current) => ({
          ...current,
          code,
          codeType: result.codeType || current.codeType,
        }));
      setStatus(
        found.length === 0
          ? 'Nessun risultato: puoi compilare i dati manualmente.'
          : found.length === 1
            ? 'Edizione trovata. Controlla i dati prima di salvare.'
            : 'Sono state trovate più edizioni: scegli quella corretta.',
      );
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : 'Ricerca non riuscita.',
      );
    } finally {
      setSearching(false);
    }
  }
  useEffect(() => {
    if (!open || editing) return;
    const normalized = query.replace(/[\s-]/g, '');
    if (
      !/^(?:\d{7}[\dX]|\d{9}[\dX]|\d{13})$/i.test(normalized) ||
      lastAutomaticQuery.current === normalized
    )
      return;
    const timer = window.setTimeout(() => {
      lastAutomaticQuery.current = normalized;
      void lookup(normalized);
    }, 650);
    return () => window.clearTimeout(timer);
  }, [query, open, editing]);
  async function upload(file?: File) {
    if (!file) return;
    setStatus('Caricamento della copertina…');
    const body = new FormData();
    body.append('file', file);
    try {
      const response = await fetch('/api/uploads', { method: 'POST', body });
      const result = (await response.json()) as {
        url?: string;
        error?: string;
      };
      if (!response.ok || !result.url) throw new Error(result.error);
      set('coverUrl', result.url);
      setStatus('Copertina caricata.');
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : 'Caricamento non riuscito.',
      );
    }
  }
  async function save() {
    if (!draft.title.trim() || !draft.author.trim()) {
      setStatus('Titolo e autore sono obbligatori.');
      return;
    }
    setSaving(true);
    const parts = draft.author.trim().split(/\s+/);
    const normalized = {
      ...draft,
      authorFirstName: parts.slice(0, -1).join(' '),
      authorLastName: parts.at(-1) || draft.author,
    };
    try {
      const response = await fetch(
        editing ? `/api/books/${editing.id}` : '/api/books',
        {
          method: editing ? 'PATCH' : 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(normalized),
        },
      );
      const result = (await response.json()) as { book?: Book; error?: string };
      if (!response.ok || !result.book) throw new Error(result.error);
      onSaved(result.book);
      onClose();
    } catch (error) {
      setStatus(
        error instanceof Error ? error.message : 'Salvataggio non riuscito.',
      );
    } finally {
      setSaving(false);
    }
  }
  return (
    <Dialog open={open} onOpenChange={(next) => next && undefined}>
      <DialogContent
        showCloseButton={false}
        className="max-h-[92vh] max-w-[calc(100%-2rem)] overflow-y-auto rounded-[18px] border-[#d8bea0] bg-[#fff8ed] p-7 sm:max-w-[1140px]"
      >
        <DialogHeader>
          <DialogTitle className="text-[30px] font-normal">
            {editing ? 'Modifica il libro' : 'Aggiungi un nuovo libro'}
          </DialogTitle>
          <DialogDescription className="sr-only">
            Modulo di inserimento del libro
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Titolo" wide>
            <Input
              disabled={searching}
              value={draft.title}
              onChange={(e) => set('title', e.target.value)}
            />
          </Field>
          <Field label="Autore">
            <Input
              disabled={searching}
              value={draft.author}
              onChange={(e) => set('author', e.target.value)}
            />
          </Field>
          <Field label="Tipo codice">
            <Input
              disabled
              value={draft.codeType}
              placeholder="Rileva automaticamente"
            />
          </Field>
          <Field label="ISBN / ISSN / codice a barre">
            <Input
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                set('code', e.target.value);
              }}
              onKeyDown={(e) => e.key === 'Enter' && lookup()}
              placeholder="Inserisci o incolla il codice"
            />
          </Field>
          <Field label="Il mio rating">
            <Stars
              value={draft.rating}
              onChange={(value) => set('rating', value)}
            />
          </Field>
        </div>
        <div>
          <Button
            onClick={lookup}
            disabled={searching}
            variant="outline"
            className="border-[#d4b997] bg-[#f8ead7]"
          >
            {searching ? <LoaderCircle className="animate-spin" /> : <Search />}{' '}
            Cerca dati
          </Button>
          <p className="mt-2 text-[13px] leading-snug text-[#75695f]">
            Titolo, autore, trama, categoria, saga, prequel/sequel e copertina
            vengono cercati automaticamente.
          </p>
        </div>
        {status && (
          <p
            aria-live="polite"
            className="rounded-lg bg-[#efe1d0] px-3 py-2 text-sm"
          >
            {status}
          </p>
        )}
        {options.length > 1 && (
          <div className="grid max-h-56 gap-2 overflow-y-auto rounded-xl border border-[#d8c1a6] p-3 sm:grid-cols-2">
            {options.map((option, index) => (
              <button
                key={`${option.title}-${index}`}
                onClick={() =>
                  setDraft((current) => ({ ...current, ...option }))
                }
                className="flex gap-3 rounded-lg border border-[#e2cfb8] bg-[#fffdf8] p-3 text-left hover:border-[#718869]"
              >
                {option.coverUrl ? (
                  <img
                    src={coverSrc(option.coverUrl)}
                    alt=""
                    className="h-20 w-14 rounded object-cover"
                  />
                ) : (
                  <span className="grid h-20 w-14 place-items-center bg-[#e5d3bd]">
                    <BookOpen />
                  </span>
                )}
                <span>
                  <strong className="block">{option.title}</strong>
                  <span className="text-sm">{option.author}</span>
                  <small className="block text-[#7d7166]">
                    {option.publisher}
                    <br />
                    {option.source}
                  </small>
                </span>
              </button>
            ))}
          </div>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Genere">
            <Input
              disabled={searching}
              value={draft.genres.join(', ')}
              onChange={(e) =>
                set(
                  'genres',
                  e.target.value
                    .split(',')
                    .map((value) => value.trim())
                    .filter(Boolean),
                )
              }
            />
          </Field>
          <Field label="Editore">
            <Input
              disabled={searching}
              value={draft.publisher}
              onChange={(e) => set('publisher', e.target.value)}
            />
          </Field>
          <Field label="Pubblicazione">
            <Input
              disabled={searching}
              value={draft.publicationYear || ''}
              onChange={(e) =>
                set('publicationYear', Number(e.target.value) || null)
              }
              placeholder="Anno di pubblicazione"
            />
          </Field>
          <Field label="Saga">
            <Input
              disabled={searching}
              value={draft.saga}
              onChange={(e) => set('saga', e.target.value)}
              placeholder="Nome della saga, se presente"
            />
          </Field>
          <Field label="Prequel">
            <Input
              disabled={searching}
              value={draft.prequel}
              onChange={(e) => set('prequel', e.target.value)}
              placeholder="Libro precedente, se esistente"
            />
          </Field>
          <Field label="Sequel">
            <Input
              disabled={searching}
              value={draft.sequel}
              onChange={(e) => set('sequel', e.target.value)}
              placeholder="Libro successivo, se esistente"
            />
          </Field>
          <Field label="URL copertina" wide>
            <Input
              disabled={searching}
              value={draft.coverUrl || ''}
              onChange={(e) => set('coverUrl', e.target.value || null)}
              placeholder="https://…"
            />
          </Field>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border border-[#d5b995] bg-[#f7e8d4] px-3 py-2">
            <ImageUp className="size-4" /> Scegli immagine dal PC
            <input
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => upload(e.target.files?.[0])}
            />
          </label>
          <Button variant="outline" onClick={() => set('coverUrl', null)}>
            Rimuovi copertina
          </Button>
        </div>
        <div className="grid min-h-40 grid-cols-[105px_1fr] gap-5 rounded-xl border border-dashed border-[#d4b99b] p-4">
          {draft.coverUrl ? (
            <img
              src={coverSrc(draft.coverUrl)}
              alt="Anteprima copertina"
              className="h-36 w-24 rounded object-cover"
            />
          ) : (
            <span className="grid h-36 w-24 place-items-center rounded bg-[#dfcdb6] px-2 text-center text-xs">
              Nessuna copertina
            </span>
          )}
          <div className="self-center">
            <strong className="text-lg">
              {draft.title || 'Bozza del libro'}
            </strong>
            <p className="text-sm text-[#786c61]">
              {draft.author ||
                'Inserisci un codice: i dati verranno cercati automaticamente.'}
            </p>
          </div>
        </div>
        <Field label="Trama">
          <Textarea
            disabled={searching}
            className="min-h-40"
            value={draft.plot}
            onChange={(e) => set('plot', e.target.value)}
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Prestato a">
            <Input
              value={draft.lentTo}
              onChange={(e) => set('lentTo', e.target.value)}
              placeholder="Nessuno"
            />
          </Field>
          <Field label="Data prestito">
            <Input
              type="date"
              value={draft.lentDate}
              onChange={(e) => set('lentDate', e.target.value)}
            />
          </Field>
        </div>
        <Field label="Le mie note">
          <Textarea
            className="min-h-24"
            value={draft.notes}
            onChange={(e) => set('notes', e.target.value)}
          />
        </Field>
        <div className="flex flex-wrap items-center gap-12">
          <label className="flex items-center gap-2">
            <Checkbox
              checked={draft.isRead}
              onCheckedChange={(value) => set('isRead', Boolean(value))}
            />{' '}
            Libro letto
          </label>
          <label className="flex items-center gap-2">
            <Checkbox
              checked={draft.inLibrary}
              onCheckedChange={(value) => set('inLibrary', Boolean(value))}
            />{' '}
            In libreria
          </label>
        </div>
        <div className="sticky -bottom-7 -mx-7 -mb-7 flex justify-end gap-2 border-t border-[#e1cdb5] bg-[#fff8ed]/96 p-4">
          <Button variant="outline" onClick={onClose}>
            Annulla
          </Button>
          <Button
            onClick={save}
            disabled={saving || searching}
            className="bg-[#6f8b66] text-white"
          >
            {saving && <LoaderCircle className="animate-spin" />}
            {editing ? 'Salva modifiche' : 'Aggiungi libro'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
function Field({
  label,
  wide = false,
  children,
}: {
  label: string;
  wide?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`grid gap-1 text-[15px] ${wide ? 'sm:col-span-2' : ''}`}>
      <span>{label}</span>
      {children}
    </label>
  );
}
function Stars({
  value,
  onChange,
}: {
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <div className="flex h-8 items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          type="button"
          key={star}
          onClick={() => onChange(value === star ? 0 : star)}
          aria-label={`${star} stelle`}
        >
          <Star
            className={`size-5 ${star <= value ? 'fill-[#e5a82a] text-[#e5a82a]' : 'text-[#9a8e82]'}`}
          />
        </button>
      ))}
    </div>
  );
}
