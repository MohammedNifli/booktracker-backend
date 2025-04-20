import { pgTable, serial, varchar, text, date, pgEnum } from "drizzle-orm/pg-core"

export const bookStatusEnum=pgEnum('book_status',[
    'not_started',
    'in_progress',
    'finished'
])

export const books = pgTable('books', {
  id: serial('id').primaryKey(),  
  title: varchar('title', { length: 255 }).notNull(),  
  author: varchar('author', { length: 255 }).notNull(),  
  status: bookStatusEnum('status').notNull().default('not_started'),  
  createdAt: date('created_at').defaultNow().notNull(),
  updatedAt:date('updated_at').defaultNow().notNull()
})
