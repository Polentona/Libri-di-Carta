import { index, integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const books = sqliteTable('books', {
  id: integer('id').primaryKey({ autoIncrement: true }), title: text('title').notNull(), author: text('author').notNull(),
  authorFirstName: text('author_first_name').notNull().default(''), authorLastName: text('author_last_name').notNull().default(''),
  code: text('code').notNull().default(''), codeType: text('code_type').notNull().default(''), genres: text('genres').notNull().default('[]'),
  publisher: text('publisher').notNull().default(''), publicationYear: integer('publication_year'), saga: text('saga').notNull().default(''),
  sagaOrder: integer('saga_order'), prequel: text('prequel').notNull().default(''), sequel: text('sequel').notNull().default(''),
  coverUrl: text('cover_url'), plot: text('plot').notNull().default(''), notes: text('notes').notNull().default(''),
  rating: integer('rating').notNull().default(0), isRead: integer('is_read', { mode: 'boolean' }).notNull().default(false),
  inLibrary: integer('in_library', { mode: 'boolean' }).notNull().default(false), lentTo: text('lent_to').notNull().default(''),
  lentDate: text('lent_date').notNull().default(''), createdAt: text('created_at').notNull(), updatedAt: text('updated_at').notNull(),
}, (table) => [index('idx_books_author').on(table.authorLastName, table.authorFirstName), index('idx_books_saga').on(table.saga, table.sagaOrder), index('idx_books_code').on(table.code)]);
