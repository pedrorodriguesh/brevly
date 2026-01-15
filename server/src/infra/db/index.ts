import { drizzle } from 'drizzle-orm/node-postgres'
import postgres from 'postgres'
import { env } from '../../env'

export const db = drizzle(env.DATABASE_URL, {
  casing: 'snake_case',
  schema: {},
})
export const pg = postgres(env.DATABASE_URL)
