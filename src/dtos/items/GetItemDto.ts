import { Static, Type } from '@sinclair/typebox';

export const GetItemDtoRequestDto = Type.Object({
  id: Type.String(),
});

export const GetItemDtoResponseDto = Type.Union([
  Type.Object({
    id: Type.String(),
    name: Type.String(),
    price: Type.Number(),
  }),
  Type.Null(),
]);

export type GetItemDtoRequestDtoType = Static<typeof GetItemDtoRequestDto>;
export type GetItemDtoResponseDtoDtoType = Static<typeof GetItemDtoResponseDto>;
