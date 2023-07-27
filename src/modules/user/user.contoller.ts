import { PageOptionsDTO } from '@database/pagination/page-options.dto';
import { Controller_ } from '@modules/auth/decorators/auth-controller.decorator';
import { AuthUser } from '@modules/auth/decorators/auth-user.decorator';
import { Get, Query } from '@nestjs/common';
import { User } from '@prisma/client';

import { UserService } from './user.service';

@Controller_('users', true)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getPaginated(@AuthUser() user: User, @Query() pageOptions: PageOptionsDTO) {
    return this.userService.getPaginated(pageOptions);
  }
}
