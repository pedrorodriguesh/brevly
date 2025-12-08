import { sql } from 'drizzle-orm'
import { date, integer, pgTable, text, uuid } from 'drizzle-orm/pg-core'

export const linksTable = pgTable('links', {
  id: uuid().default(sql`uuidv7()`).primaryKey(),
  shortened_url: text().notNull(),
  full_url: text().notNull(),
  access_count: integer().default(0).notNull(),
  created_at: date().defaultNow(),
})
