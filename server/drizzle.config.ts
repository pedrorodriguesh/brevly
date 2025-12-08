import { defineConfig } from 'drizzle-kit'
import { env } from './src/env'

export default defineConfig({
  out: 'src/infra/db/migrations',
  schema: 'src/infra/db/schemas/*',
  dialect: 'postgresql',
  casing: 'snake_case',
  dbCredentials: {
    url: env.DATABASE_URL,
  },
})
