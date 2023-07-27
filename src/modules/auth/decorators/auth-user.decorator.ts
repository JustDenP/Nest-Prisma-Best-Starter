import type { ExecutionContext } from '@nestjs/common';
import { createParamDecorator } from '@nestjs/common';
import { User } from '@prisma/client';

import IRequestWithUser from '../types/interfaces/request-with-user.interface';

/* A decorator that will be used to get the user from the request. */
export const AuthUser = createParamDecorator((_data: keyof User, context: ExecutionContext) => {
  const request: IRequestWithUser = context.switchToHttp().getRequest();
  const user = request.user;

  return user;
});
