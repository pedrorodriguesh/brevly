import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { env } from '../../env'
import { db } from '../../infra/db'
import { links } from '../../infra/db/schemas/links'

export const redirectRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/redirect/:short_code',
    {
      schema: {
        summary: 'Redirect user',
        tags: ['links'],
        params: z.object({
          short_code: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { short_code } = request.params
      const redirectUrl = new URL('/redirect', env.WEB_APP_URL)

      const [url] = await db
        .select({
          full_url: links.full_url,
          access_count: links.access_count,
        })
        .from(links)
        .where(eq(links.short_code, short_code))

      if (!url) {
        return reply.redirect(redirectUrl.toString(), 302)
      }

      const newAccessCount = url.access_count + 1

      await db
        .update(links)
        .set({ access_count: newAccessCount })
        .where(eq(links.short_code, short_code))

      // Redireciona para a página web que mostrará o loading e depois redirecionará
      redirectUrl.searchParams.set('url', url.full_url)

      return reply.redirect(redirectUrl.toString(), 302)
    },
  )
}
