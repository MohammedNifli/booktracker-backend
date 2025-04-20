import { pgTable, serial, integer, text, timestamp, foreignKey } from "drizzle-orm/pg-core";
import { books } from "./book"; 

export const notes = pgTable('notes', {
  id: serial('id').primaryKey(),
  bookId: integer('book_id').references(() => books.id).notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { mode: 'date' }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { mode: 'date' }).defaultNow().notNull()
});