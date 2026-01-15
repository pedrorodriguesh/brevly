import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db } from '../../infra/db'

import { links } from '../../infra/db/schemas/links'

export const getLinksRoute: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/links',
    {
      schema: {
        summary: 'Get all links',
        tags: ['links'],
      },
    },
    async (_, reply) => {
      const shortenedLinks = await db
        .select({
          shortCode: links.short_code,
          fullUrl: links.full_url,
          accessCount: links.access_count,
        })
        .from(links)

      return reply.status(201).send({
        links: shortenedLinks,
      })
    },
  )
}
