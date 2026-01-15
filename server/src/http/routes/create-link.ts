import { eq } from 'drizzle-orm'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'
import { db } from '../../infra/db'

import { links } from '../../infra/db/schemas/links'

export const createLinkRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/link',
    {
      schema: {
        summary: 'Create a new shortened link',
        tags: ['links'],
        body: z.object({
          short_code: z.string(),
          full_url: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { short_code, full_url } = request.body

      const shortenedUrlAlreadyExists = await db
        .select()
        .from(links)
        .where(eq(links.short_code, short_code))

      if (shortenedUrlAlreadyExists.length > 0) {
        console.log('Short-code já existente.')
        return reply.status(404).send({
          message: 'This shortened url already exists.',
        })
      }

      await db.insert(links).values({ short_code, full_url })

      return reply.status(201).send({
        message: 'Shortened url created successfully!',
      })
    },
  )
}
