import 'reflect-metadata';
import 'dotenv/config';

import fastify from 'fastify';
import cors from '@fastify/cors';
import ItemsController from './controllers/ItemsController';
import { AppDataSource } from './data-source';
import { TypeBoxTypeProvider } from '@fastify/type-provider-typebox';
import CartsController from './controllers/CartsController';
import fastifySwagger from '@fastify/swagger';
import fastifySwaggerUi from '@fastify/swagger-ui';

AppDataSource.initialize().then(async () => {
  const server = fastify({
    logger: true,
  }).withTypeProvider<TypeBoxTypeProvider>();

  // Register Fastify CORS plugin
  server.register(cors);

  server.register(fastifySwagger, {
    swagger: {
      info: {
        title: 'Cart API',
        description:
          'Swagger for cat and items endpoint, for the purpose of play around and test',
        version: '1.0.0',
      },
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'carts', description: 'Carts related end-points' },
        { name: 'items', description: 'Items related end-points' },
      ],
    },
  });

  server.register(fastifySwaggerUi, {
    routePrefix: '/docs',
  });

  server.register(ItemsController);
  server.register(CartsController);

  try {
    const port = Number(process.env.PORT) || 3000;
    await server.listen({ port, host: '0.0.0.0' });
    console.log(`Server is running on http://localhost:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
});
