import { Static, Type } from '@sinclair/typebox';

export const UpdateItemRequestIdDto = Type.Object({
  id: Type.String({ format: 'uuid' }),
});

export const UpdateItemRequestDto = Type.Object({
  name: Type.String(),
  price: Type.Number({ exclusiveMinimum: 0 }),
});

export const UpdateItemResponseDto = Type.Object({
  id: Type.String(),
  name: Type.String(),
  price: Type.Number(),
});

export type UpdateItemRequestDtoType = Static<typeof UpdateItemRequestDto>;
export type UpdateItemRequestIdDtoType = Static<typeof UpdateItemRequestIdDto>;
export type UpdateItemResponseDtoType = Static<typeof UpdateItemResponseDto>;
