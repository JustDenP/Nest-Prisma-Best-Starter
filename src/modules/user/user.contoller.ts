import { Controller, Get, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { PageOptionsDTO } from 'database/pagination/page-options.dto';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getPaginated(@Query() pageOptions: PageOptionsDTO) {
    return this.userService.getPaginated(pageOptions);
  }
}
