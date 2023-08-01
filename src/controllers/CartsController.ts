import { FastifyPluginAsync, FastifyInstance } from 'fastify';
import fp from 'fastify-plugin';
import { AppDataSource } from '../data-source';
import { In } from 'typeorm';
import { ItemEntity } from '../entities/ItemEntity';
import { CartEntity } from '../entities/CartEntity';
import { CartItemEntity } from '../entities/CartItemEntity';
import {
  CreateCartRequestDto,
  CreateCartRequestDtoType,
  CreateCartResponseDto,
  CreateCartResponseDtoType,
} from '../dtos/carts/CreateCartDto';
import {
  UpdateCartRequestDto,
  UpdateCartRequestDtoType,
  UpdateCartRequestIdDto,
  UpdateCartRequestIdDtoType,
  UpdateCartResponseDto,
  UpdateCartResponseDtoType,
} from '../dtos/carts/UpdateCartDto';
import {
  GetCartDtoRequestDto,
  GetCartDtoRequestDtoType,
  GetCartDtoResponseDto,
  GetCartDtoResponseDtoType,
} from '../dtos/carts/GetCartDto';
import {
  DeleteCartDtoRequestDto,
  DeleteCartDtotoRequestDtoType,
} from '../dtos/carts/DeleteCartDto';

const cartEntityRepository = AppDataSource.getRepository(CartEntity);

type CartTotal = {
  total: number;
  subtotal: number;
};

async function createOrUpdateCartAndCartItems(
  cartDto: UpdateCartRequestDtoType & CreateCartRequestDtoType,
  id?: string,
): Promise<CreateCartResponseDtoType | UpdateCartResponseDtoType> {
  const result = await AppDataSource.transaction<
    CreateCartResponseDtoType | UpdateCartResponseDtoType
  >(async (transactionManager) => {
    let cartEntity = new CartEntity();
    const { cartItems, discount, taxes } = cartDto;

    const itemsDb = await transactionManager.find(ItemEntity, {
      where: {
        id: In(cartItems.map((cartItem) => cartItem.item.id)),
      },
      select: ['id', 'price', 'name'],
    });

    const totalAndSubTotal = await calculateTotalAndSubTotal(
      {
        cartItems,
        taxes,
        discount,
      },
      itemsDb,
    );

    cartEntity = Object.assign(cartEntity, {
      id: id ? id : undefined,
      discount,
      taxes,
      ...totalAndSubTotal,
    });

    cartEntity.cartItems = cartItems.map((cartItem) => {
      const cartItemEntity = new CartItemEntity();
      cartItemEntity.id = cartItem.id;
      cartItemEntity.item_id = cartItem.item.id;
      cartItemEntity.quantity = cartItem.quantity;
      cartItemEntity.cart_id = cartEntity.id;
      cartItemEntity.item = itemsDb.find(
        (itemDb) => itemDb.id === cartItem.item.id,
      ) as ItemEntity;
      return cartItemEntity;
    });

    cartEntity = await transactionManager.save(cartEntity);

    return { ...cartEntity };
  });

  return result;
}

async function calculateTotalAndSubTotal(
  cartDto: CreateCartRequestDtoType,
  items: ItemEntity[],
): Promise<CartTotal> {
  const resultTotal: CartTotal = {
    subtotal: 0,
    total: 0,
  };

  items.forEach((item) => {
    const itemDto = cartDto.cartItems.find(
      (itemDto) => itemDto.item.id === item.id,
    );

    if (itemDto) {
      resultTotal.subtotal += itemDto.quantity * item.price;
    }
  });

  resultTotal.total = resultTotal.subtotal;

  resultTotal.total -=
    cartDto.discount && cartDto.discount > 0
      ? (resultTotal.total * cartDto.discount) / 100
      : 0;

  resultTotal.total +=
    cartDto.taxes && cartDto.taxes > 0
      ? (resultTotal.total * cartDto.taxes) / 100
      : 0;

  return resultTotal;
}

const itemsRouter: FastifyPluginAsync = async (server: FastifyInstance) => {
  server.post<{
    Body: CreateCartRequestDtoType;
    Reply: CreateCartResponseDtoType;
  }>(
    '/carts',
    {
      schema: {
        tags: ['carts'],
        description: 'Route to create a Cart by ID',
        body: CreateCartRequestDto,
        response: {
          200: CreateCartResponseDto,
        },
      },
    },
    async (req, reply) => {
      const result: CreateCartResponseDtoType =
        await createOrUpdateCartAndCartItems(
          req.body as CreateCartResponseDtoType,
        );

      reply.status(200).send(result);
    },
  );

  server.put<{
    Params: UpdateCartRequestIdDtoType;
    Body: UpdateCartRequestDtoType;
    Reply: UpdateCartResponseDtoType;
  }>(
    '/carts/:id',
    {
      schema: {
        tags: ['carts'],
        description: 'Route to update a Cart by ID',
        params: UpdateCartRequestIdDto,
        body: UpdateCartRequestDto,
        response: {
          200: UpdateCartResponseDto,
        },
      },
    },
    async (req, reply) => {
      const { id } = req.params;
      const result = await createOrUpdateCartAndCartItems(req.body, id);

      reply.status(200).send(result);
    },
  );

  server.get<{
    Params: GetCartDtoRequestDtoType;
    Reply: GetCartDtoResponseDtoType;
  }>(
    '/carts/:id',
    {
      schema: {
        tags: ['carts'],
        description: 'Route to Get a Cart by ID',
        params: GetCartDtoRequestDto,
        response: {
          200: GetCartDtoResponseDto,
          404: {
            type: 'null',
            description: 'cart not found',
          },
        },
      },
    },
    async (req, reply) => {
      const { id } = req.params;
      const cartEntityRepository = AppDataSource.getRepository(CartEntity);

      const cart = await cartEntityRepository.findOne({
        where: {
          id,
        },
        relations: {
          cartItems: {
            item: true,
          },
        },
      });

      if (!cart) {
        return reply.status(404).send();
      }

      reply.status(200).send(cart);
    },
  );

  server.delete<{
    Params: DeleteCartDtotoRequestDtoType;
  }>(
    '/carts/:id',
    {
      schema: {
        tags: ['carts'],
        description: 'Route to Delete a Cart by ID',
        params: DeleteCartDtoRequestDto,
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

      const { affected } = await cartEntityRepository.delete({
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
