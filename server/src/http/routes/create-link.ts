import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import z from 'zod'

export const createLinkRoute: FastifyPluginAsyncZod = async (server) => {
  server.post(
    '/link',
    {
      schema: {
        summary: 'Create a new shortened link',
        tags: ['links'],
        body: z.object({
          shortened_link: z.string(),
          full_link: z.string(),
        }),
      },
    },
    async (request, reply) => {
      const { shortened_link } = request.body

      reply.send(shortened_link)
    },
  )
}
