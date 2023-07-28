import { ParamID } from '@common/@types/dtos/one-param-types.dto';
import { Role } from '@common/@types/enums/common.enum';
import { Public } from '@common/decorators/public.decorator';
import { PageOptionsDTO } from '@database/pagination/page-options.dto';
import { Auth } from '@modules/auth/decorators/auth.decorator';
import { Controller_ } from '@modules/auth/decorators/auth-controller.decorator';
import { Body, Delete, Get, Param, Patch, Query } from '@nestjs/common';
import { ApiOperation } from '@nestjs/swagger';

import { UpdateUserDTO } from './dto/update.dto';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Controller_('users', true)
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly userRepository: UserRepository,
  ) {}

  @Public()
  @ApiOperation({ summary: 'Get users paginated' })
  @Get()
  getPaginated(@Query() pageOptions: PageOptionsDTO) {
    return this.userService.getPaginated(pageOptions);
  }

  @ApiOperation({ summary: 'Find user by ID' })
  @Get(':id')
  findById(@Param() paramID: ParamID) {
    return this.userRepository._findFirst({ where: { id: paramID.id } });
  }

  @ApiOperation({ summary: 'Update user' })
  @Patch(':id')
  update(@Param() paramID: ParamID, @Body() inputData: UpdateUserDTO) {
    return this.userRepository._update({ where: { id: paramID.id }, data: inputData });
  }

  @ApiOperation({ summary: 'Soft delete user' })
  @Delete(':id')
  softDelete(@Param() paramID: ParamID) {
    return this.userRepository._softDelete({ where: { id: paramID.id } });
  }

  @ApiOperation({ summary: 'Restore user' })
  @Patch('/restore/:id')
  restore(@Param() paramID: ParamID) {
    return this.userRepository._restore({ where: { id: paramID.id } });
  }

  @Auth([Role.ADMIN])
  @ApiOperation({ summary: 'Permanently delete user' })
  @Delete('/permanent/:id')
  delete(@Param() paramID: ParamID) {
    return this.userRepository._permanentDelete({ where: { id: paramID.id } });
  }
}
