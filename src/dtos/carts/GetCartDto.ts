import { Static, Type } from '@sinclair/typebox';

export const GetCartDtoRequestDto = Type.Object({
  id: Type.String(),
});

export const GetCartDtoResponseDto = Type.Object({
  id: Type.String(),
  discount: Type.Optional(Type.Number({ exclusiveMinimum: 0 })),
  taxes: Type.Optional(Type.Number({ exclusiveMinimum: 0 })),
  total: Type.Number(),
  subtotal: Type.Number(),
  cartItems: Type.Array(
    Type.Object({
      id: Type.String({ format: 'uuid' }),
      quantity: Type.Integer({ minimum: 1 }),
      item: Type.Object({
        id: Type.String({ format: 'uuid' }),
        price: Type.Number(),
        name: Type.String(),
      }),
    }),
  ),
});

export type GetCartDtoRequestDtoType = Static<typeof GetCartDtoRequestDto>;
export type GetCartDtoResponseDtoType = Static<typeof GetCartDtoResponseDto>;
