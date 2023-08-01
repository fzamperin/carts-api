import { Static, Type } from '@sinclair/typebox';

export const DeleteItemDtoRequestDto = Type.Object({
  id: Type.String({ format: 'uuid' }),
});

export type DeleteItemDtotoRequestDtoType = Static<
  typeof DeleteItemDtoRequestDto
>;
