'use client';
import { BookOpen, Pencil, Star, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import type { Book } from '@/types/book';
import { coverSrc } from '@/lib/cover-url';
export function BookCard({
  book,
  onEdit,
  onDelete,
  onPatch,
}: {
  book: Book;
  onEdit: () => void;
  onDelete: () => void;
  onPatch: (patch: Partial<Book>) => void;
}) {
  return (
    <article className="relative grid gap-6 rounded-[20px] border border-[#d9bea0] bg-[#fbf4e9]/96 p-6 shadow-[0_12px_30px_rgba(95,69,42,.09)] sm:grid-cols-[150px_1fr]">
      <aside className="mx-auto w-[150px]">
        {book.coverUrl ? (
          <img
            src={coverSrc(book.coverUrl)}
            alt={`Copertina di ${book.title}`}
            className="h-[220px] w-[150px] rounded-lg object-cover shadow-md"
          />
        ) : (
          <div className="grid h-[220px] place-items-center rounded-lg bg-[#d9c2a8]">
            <BookOpen className="size-12" />
          </div>
        )}
        <div className="mt-3 space-y-1 text-sm leading-tight">
          {book.prequel && (
            <p>
              <b>Prequel:</b>
              <br />
              {book.prequel}
            </p>
          )}
          {book.sequel && (
            <p>
              <b>Sequel:</b>
              <br />
              {book.sequel}
            </p>
          )}
          <p className="pt-2 text-[12px] font-bold uppercase tracking-wide">
            Il mio rating
          </p>
          <Stars
            value={book.rating}
            onChange={(rating) => onPatch({ rating })}
          />
        </div>
      </aside>
      <div className="min-w-0 pr-16">
        <h2 className="text-[27px] font-bold leading-tight">{book.title}</h2>
        <p className="mt-1 text-lg text-[#73675d]">{book.author}</p>
        {book.plot && (
          <div className="mt-4">
            <p className="mb-1 border-b border-[#a9947c] text-xs font-bold uppercase">
              Trama
            </p>
            <p className="whitespace-pre-line text-[16px] leading-relaxed">
              {book.plot}
            </p>
          </div>
        )}
        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {book.saga && (
            <div className="rounded-xl border border-[#c9a987] bg-[#fffdf9] px-4 py-3">
              <b className="text-sm uppercase">Saga</b>
              <p>{book.saga}</p>
            </div>
          )}
          {book.notes && (
            <div className="rounded-xl border border-[#c9a987] bg-[#fffdf9] px-4 py-3">
              <b className="text-sm uppercase">Le mie note</b>
              <p>{book.notes}</p>
            </div>
          )}
        </div>
        {book.lentTo && (
          <p className="mt-3 text-xs text-black">
            <b>Prestato a:</b> {book.lentTo}
            {book.lentDate ? ` · ${formatDate(book.lentDate)}` : ''}
          </p>
        )}
      </div>
      <label className="absolute right-5 top-5 flex items-center gap-2 text-sm">
        <Checkbox
          checked={book.isRead}
          onCheckedChange={(v) => onPatch({ isRead: Boolean(v) })}
        />{' '}
        Letto
      </label>
      <div className="absolute bottom-4 right-4 flex gap-1">
        <button
          onClick={onEdit}
          className="rounded-lg p-2 hover:bg-[#e3cbb0]"
          aria-label={`Modifica ${book.title}`}
        >
          <Pencil className="size-4" />
        </button>
        <button
          onClick={onDelete}
          className="rounded-lg p-2 text-[#a35f55] hover:bg-[#edd1c7]"
          aria-label={`Elimina ${book.title}`}
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </article>
  );
}
function Stars({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <div className="mt-1 flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          onClick={() => onChange(value === star ? 0 : star)}
          aria-label={`${star} stelle`}
        >
          <Star
            className={`size-4 ${star <= value ? 'fill-[#e5a82a] text-[#e5a82a]' : 'text-[#9f9285]'}`}
          />
        </button>
      ))}
    </div>
  );
}
function formatDate(value: string) {
  const [y, m, d] = value.split('-');
  return d && m && y ? `${d}/${m}/${y}` : value;
}
