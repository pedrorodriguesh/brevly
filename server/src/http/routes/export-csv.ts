import { PassThrough, Transform } from 'node:stream'
import { pipeline } from 'node:stream/promises'
import { stringify } from 'csv-stringify'
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod'
import { db, pg } from '../../infra/db'
import { links } from '../../infra/db/schemas/links'
import { uploadToStorage } from '../../infra/storage/upload-to-storage'

export const exportCsv: FastifyPluginAsyncZod = async (server) => {
  server.get(
    '/export',
    {
      schema: {
        summary: 'Export csv with all links',
        tags: ['links'],
      },
    },
    async (_, reply) => {
      const { sql, params } = db
        .select({
          shortCode: links.short_code,
          fullUrl: links.full_url,
          accessCount: links.access_count,
          createdAt: links.created_at,
        })
        .from(links)
        .toSQL()

      const cursor = pg.unsafe(sql, params as string[]).cursor(2)

      console.log(params)

      const csv = stringify({
        delimiter: ',',
        header: true,
        columns: [
          { key: 'full_url', header: 'URL Original' },
          { key: 'short_url', header: 'URL Encurtada' },
          { key: 'access_count', header: 'Número de acessos' },
          { key: 'created_at', header: 'Data de criação' },
        ],
      })

      const uploadToStorageStream = new PassThrough()

      const convertToCSVPipeline = pipeline(
        cursor,
        new Transform({
          objectMode: true,
          transform(chunks: any[], _, callback) {
            for (const chunk of chunks) {
              const createdAt =
                chunk.created_at instanceof Date
                  ? chunk.created_at
                  : new Date(chunk.created_at)

              this.push({
                ...chunk,
                short_url: `brev.ly/${chunk.short_code}`,
                created_at: createdAt.toLocaleString('pt-BR', {
                  timeZone: 'America/Sao_Paulo',
                  dateStyle: 'short',
                  timeStyle: 'short',
                }),
              })
            }
            callback()
          },
        }),
        csv,
        uploadToStorageStream,
      )

      const upload = uploadToStorage({
        contentType: 'text/csv',
        folder: 'links',
        fileName: `${new Date().toISOString()}-uploads.csv`,
        contentStream: uploadToStorageStream,
      })

      const [{ url }] = await Promise.all([upload, convertToCSVPipeline])

      return reply.status(201).send({
        reportUrl: url,
      })
    },
  )
}
