import { FastifyPluginAsync, FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import {
  CreateItemRequestDto,
  CreateItemRequestDtoType,
  CreateItemResponseDto,
  CreateItemResponseDtoType,
} from '../dtos/items/CreateItemDto';
import {
  GetItemDtoRequestDto,
  GetItemDtoRequestDtoType,
  GetItemDtoResponseDto,
  GetItemDtoResponseDtoDtoType,
} from '../dtos/items/GetItemDto';
import { AppDataSource } from '../data-source';
import { ItemEntity } from '../entities/ItemEntity';
import {
  DeleteItemDtoRequestDto,
  DeleteItemDtotoRequestDtoType,
} from '../dtos/items/DeleteItemDto';
import {
  UpdateItemRequestDto,
  UpdateItemRequestDtoType,
  UpdateItemRequestIdDto,
  UpdateItemRequestIdDtoType,
  UpdateItemResponseDto,
  UpdateItemResponseDtoType,
} from '../dtos/items/UpdateItemDto';

const itemsRepository = AppDataSource.getRepository(ItemEntity);

const itemsRouter: FastifyPluginAsync = async (server: FastifyInstance) => {
  server.post<{
    Body: CreateItemRequestDtoType;
    Reply: CreateItemResponseDtoType;
  }>(
    '/items',
    {
      schema: {
        tags: ['items'],
        description: 'Route to create a Item by ID',
        body: CreateItemRequestDto,
        response: { 200: CreateItemResponseDto },
      },
    },
    async (req, reply) => {
      const { name, price } = req.body;
      const savedItem = await itemsRepository.save({
        name,
        price,
      });
      reply.status(200).send({
        id: savedItem.id,
      });
    },
  );

  server.put<{
    Params: UpdateItemRequestIdDtoType;
    Body: UpdateItemRequestDtoType;
    Reply: UpdateItemResponseDtoType;
  }>(
    '/items/:id',
    {
      schema: {
        tags: ['items'],
        description: 'Route to update a Item by ID',
        body: UpdateItemRequestDto,
        params: UpdateItemRequestIdDto,
        response: {
          200: UpdateItemResponseDto,
          404: {
            type: 'null',
            description: 'Item not found',
          },
        },
      },
    },
    async (req, reply) => {
      const { name, price } = req.body;
      const { id } = req.params;

      const exists = await itemsRepository.countBy({
        id,
      });

      if (exists === 0) {
        return reply.status(404).send();
      }

      const updatedItem = await itemsRepository.save({
        id,
        name,
        price,
      });

      reply.status(200).send(updatedItem);
    },
  );

  server.get<{
    Params: GetItemDtoRequestDtoType;
    Reply: GetItemDtoResponseDtoDtoType;
  }>(
    '/items/:id',
    {
      schema: {
        tags: ['items'],
        description: 'Route to get a Item by ID',
        params: GetItemDtoRequestDto,
        response: {
          200: GetItemDtoResponseDto,
          404: {
            type: 'null',
            description: 'Item not found',
          },
        },
      },
    },
    async (req, reply) => {
      const { id } = req.params;
      const item = await itemsRepository.findOneBy({
        id,
      });

      if (!item) {
        return reply.status(404).send();
      }

      reply.status(200).send(item);
    },
  );
  server.delete<{
    Params: DeleteItemDtotoRequestDtoType;
  }>(
    '/items/:id',
    {
      schema: {
        tags: ['items'],
        description: 'Route to delete a Item by ID',
        params: DeleteItemDtoRequestDto,
        response: {
          204: {
            type: 'null',
            description: 'No Content',
          },
        },
      },
    },
    async (req, reply) => {
      const { id } = req.params;

      const { affected } = await itemsRepository.delete({
        id,
      });

      if (affected === 0) {
        return reply.status(404).send();
      }

      reply.status(204).send();
    },
  );
};

export default fp(itemsRouter);
