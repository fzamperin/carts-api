import { Static, Type } from '@sinclair/typebox';

export const DeleteCartDtoRequestDto = Type.Object({
  id: Type.String(),
});

export type DeleteCartDtotoRequestDtoType = Static<
  typeof DeleteCartDtoRequestDto
>;
