import { NoContentException } from '@common/exceptions/no-content.exception';
import { Pagination } from '@database/pagination';
import { PageDTO } from '@database/pagination/page.dto';
import { PageOptionsDTO } from '@database/pagination/page-options.dto';
import { PrismaService } from '@database/prisma.service';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly orm: PrismaService) {}

  _create(params: { data: Prisma.UserCreateInput }): Promise<User> {
    const { data } = params;

    return this.orm.user.create({ data });
  }

  _findFirst(params: { where: Prisma.UserWhereInput }): Promise<User> {
    const { where } = params;

    return this.orm.user.findFirst({ where });
  }

  async _getPaginated(pageOptionsDTO: PageOptionsDTO): Promise<PageDTO<User>> {
    try {
      const query = Pagination.getQuery(pageOptionsDTO);
      const [total, results] = await this.orm.$transaction([
        this.orm.user.count(query),
        this.orm.user.findMany(query),
      ]);

      return Pagination.paginate<User>(pageOptionsDTO, total, results);
    } catch (error) {
      throw new NoContentException();
    }
  }

  _findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;

    return this.orm.user.findMany({ skip, take, cursor, where, orderBy });
  }

  _update(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;

    return this.orm.user.update({ where, data });
  }

  _softDelete(params: { where: Prisma.UserWhereUniqueInput }): Promise<User> {
    const { where } = params;

    return this._update({
      where,
      data: {
        deletedAt: new Date(),
      },
    });
  }

  _restore(params: { where: Prisma.UserWhereUniqueInput }): Promise<User> {
    const { where } = params;

    return this._update({
      where,
      data: {
        deletedAt: null,
      },
    });
  }

  _permanentDelete(params: { where: Prisma.UserWhereUniqueInput }): Promise<User> {
    const { where } = params;

    return this.orm.user.delete({ where });
  }
}
