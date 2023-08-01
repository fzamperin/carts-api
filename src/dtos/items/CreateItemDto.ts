import { Static, Type } from '@sinclair/typebox';

export const CreateItemRequestDto = Type.Object({
  name: Type.String(),
  price: Type.Number({ exclusiveMinimum: 0 }),
});

export const CreateItemResponseDto = Type.Object(
  {
    id: Type.String({ format: 'uuid' }),
  },
  { description: 'Item created successfully' },
);

export type CreateItemRequestDtoType = Static<typeof CreateItemRequestDto>;
export type CreateItemResponseDtoType = Static<typeof CreateItemResponseDto>;
