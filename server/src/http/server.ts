import { fastifyCors } from '@fastify/cors'
import fastifySwagger from '@fastify/swagger'
import scalarUI from '@scalar/fastify-api-reference'
import { fastify } from 'fastify'
import {
  jsonSchemaTransform,
  serializerCompiler,
  validatorCompiler,
} from 'fastify-type-provider-zod'

const server = fastify()

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.register(fastifyCors, {
  origin: '*',
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

server.listen({ port: 3333 }).then(() => {
  console.log('✅ | HTTP Server running! | Docs on: http://localhost:3333/docs')
})
