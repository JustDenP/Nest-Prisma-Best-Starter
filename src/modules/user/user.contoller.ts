import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { PageOptionsDTO } from 'database/pagination/page-options.dto';
import { RegisterUserDTO } from './dto/sign/user-register.dto';
import { UserService } from './user.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getPaginated(@Query() pageOptions: PageOptionsDTO) {
    return this.userService.getPaginated(pageOptions);
  }

  @Post('register')
  register(@Body() data: RegisterUserDTO) {
    return this.userService.register(data);
  }
}
