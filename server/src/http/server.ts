import { fastifyCors } from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import scalarUI from '@scalar/fastify-api-reference'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'
import { env } from '../env'
import { createLinkRoute } from './routes/create-link'
import { deleteLinkRoute } from './routes/delete-link'
import { exportCsv } from './routes/export-csv'
import { getLinksRoute } from './routes/get-links'
import { redirectRoute } from './routes/redirect'

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.register(fastifyCors, {
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'DELETE', 'PUT', 'PATCH'],
})

server.register(fastifySwagger, {
  openapi: {
    info: {
      title: 'Brev.ly',
      summary: 'Shortener links app',
      version: '1.0.0',
    },
  },
  transform: jsonSchemaTransform,
})

server.register(scalarUI, {
  routePrefix: '/docs',
})

// ## Routes ##
server.register(createLinkRoute)
server.register(redirectRoute)
server.register(getLinksRoute)
server.register(deleteLinkRoute)
server.register(exportCsv)

server.listen({ port: env.PORT }).then(() => {
  console.log('✅ | HTTP Server running! | Docs on: http://localhost:3333/docs')
})
