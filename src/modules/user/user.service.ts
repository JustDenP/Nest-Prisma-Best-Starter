import { Msgs } from '@common/@types/constants/messages';
import { PageOptionsDTO } from '@database/pagination/page-options.dto';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

import { UpdateUserDTO } from './dto/update.dto';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  async findFirst(params: { where: Prisma.UserWhereInput }, withPassword = false): Promise<User> {
    const { where } = params;

    const user = await this.userRepository._findFirst({ where });
    if (user && !withPassword) delete user.password;

    return user;
  }

  getPaginated(pageOptions: PageOptionsDTO) {
    return this.userRepository._getPaginated(pageOptions);
  }

  async findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take = 200, cursor, where, orderBy } = params;
    /* Prevent performance issues if there will be too many users. */
    if (take > 200) new ForbiddenException(Msgs.exception.tooManyEntitiesRequested);

    const users = await this.userRepository._findMany({ skip, take, cursor, where, orderBy });
    users.map((each) => {
      if (each.password) delete each.password;

      return each;
    });

    return users;
  }

  update(params: { where: Prisma.UserWhereUniqueInput; data: UpdateUserDTO }): Promise<User> {
    const { where, data } = params;

    return this.userRepository._update({ where, data });
  }

  softDelete(params: { where: Prisma.UserWhereUniqueInput }): Promise<User> {
    const { where } = params;

    return this.userRepository._softDelete({
      where,
    });
  }

  restore(params: { where: Prisma.UserWhereUniqueInput }): Promise<User> {
    const { where } = params;

    return this.userRepository._restore({
      where,
    });
  }

  permanentDelete(params: { where: Prisma.UserWhereUniqueInput }): Promise<User> {
    const { where } = params;

    return this.userRepository._permanentDelete({ where });
  }
}
