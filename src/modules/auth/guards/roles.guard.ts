import { IS_PUBLIC_KEY_META } from '@common/@types/constants/metadata';
import { Role } from '@common/@types/enums/common.enum';
import type { CanActivate, ExecutionContext } from '@nestjs/common';
import { Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import IRequestWithUser from '../types/interfaces/request-with-user.interface';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<Role[]>('roles', context.getHandler());
    const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY_META, context.getHandler());

    if (isPublic) {
      return true;
    }

    if (!roles || !roles.length) {
      return true;
    }

    const request: IRequestWithUser = context.switchToHttp().getRequest();
    const user = request.user;

    return roles.some((r) => user.role.includes(r));
  }
}
