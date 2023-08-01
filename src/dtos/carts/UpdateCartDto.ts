import { Static, Type } from '@sinclair/typebox';

export const UpdateCartRequestIdDto = Type.Object({
  id: Type.String({ format: 'uuid' }),
});

export const UpdateCartRequestDto = Type.Object({
  discount: Type.Optional(Type.Number({ exclusiveMinimum: 0 })),
  taxes: Type.Optional(Type.Number({ exclusiveMinimum: 0 })),
  cartItems: Type.Array(
    Type.Object({
      id: Type.String({ format: 'uuid' }),
      quantity: Type.Integer({ minimum: 1 }),
      item: Type.Object({
        id: Type.String({ format: 'uuid' }),
      }),
    }),
    { minItems: 1 },
  ),
});

export const UpdateCartResponseDto = Type.Object({
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

export type UpdateCartRequestDtoType = Static<typeof UpdateCartRequestDto>;
export type UpdateCartRequestIdDtoType = Static<typeof UpdateCartRequestIdDto>;
export type UpdateCartResponseDtoType = Static<typeof UpdateCartResponseDto>;
