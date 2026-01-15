import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../infra/db'
import { links } from '../../infra/db/schemas/links'

export const deleteLinkRoute: FastifyPluginAsyncZod = async (server) => {
  server.delete(
    '/link/:short_code',
    {
      schema: {
        summary: 'Delete shortened link',
        tags: ['links'],
        params: z.object({
          short_code: z.string(),
        }),
      },
    },
    async (request, reply) => {
      try {
        const { short_code } = request.params

        await db.delete(links).where(eq(links.short_code, short_code))

        return reply.status(200).send({
          message: 'Link removed with success!'
        })
      } catch (error) {
        console.log(error)
      }
    },
  )
}
