import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../infra/db'

import { linksTable } from '../../infra/db/schemas/links'

export const createLinkRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/link',
    {
      schema: {
        summary: 'Create a new shortened link',
        tags: ['links'],
        body: z.object({
          shortened_url: z.string(),
          full_url: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { shortened_url, full_url } = request.body

      const shortenedUrlAlreadyExists = await db
        .select()
        .from(linksTable)
        .where(eq(linksTable.shortened_url, shortened_url))

      if (shortenedUrlAlreadyExists.length > 0) {
        return reply.status(404).send({
          message: 'This shortened url already exists.',
        })
      }

      await db.insert(linksTable).values({ shortened_url, full_url })

      reply.status(200).send({
        message: 'Shortened url created successfully!',
      })
    },
  )
}
