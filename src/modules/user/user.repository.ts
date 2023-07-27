import { NoContentException } from '@common/exceptions/no-content.exception';
import { CryptUtils } from '@common/helpers/crypt';
import { Pagination } from '@database/pagination';
import { PageDTO } from '@database/pagination/page.dto';
import { PageOptionsDTO } from '@database/pagination/page-options.dto';
import { PrismaService } from '@database/prisma.service';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';

@Injectable()
export class UserRepository {
  constructor(private readonly orm: PrismaService) {}

  /* Get paginated users */
  async _getPaginated(pageOptionsDTO: PageOptionsDTO): Promise<PageDTO<User>> {
    try {
      const query = Pagination.getQuery(pageOptionsDTO);
      const [total, results] = await this.orm.$transaction([
        this.orm.user.count(query),
        this.orm.user.findMany(query),
      ]);

      return Pagination.paginate<User>(pageOptionsDTO, total, results);
    } catch (error: any) {
      throw new NoContentException();
    }
  }

  _create(params: { data: Prisma.UserCreateInput }): Promise<User> {
    const { data } = params;
    const { password } = data;
    const hashed = CryptUtils.generateHash(password);

    return this.orm.user.create({
      data: {
        ...data,
        password: hashed,
      },
    });
  }

  async _findFirst(params: { where?: Prisma.UserWhereInput }, withPassword = false): Promise<User> {
    const { where } = params;
    const user = await this.orm.user.findFirst({ where });
    if (!withPassword) delete user.password;

    return user;
  }

  async _findMany(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take = 200, cursor, where, orderBy } = params;

    /* Prevent performance issues if there will be too many users. */
    if (take > 200) new ForbiddenException('Too many users requested.');

    const users = await this.orm.user.findMany({ skip, take, cursor, where, orderBy });
    users.map((each) => {
      delete each['password'];

      return each;
    });

    return users;
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

    return this.orm.user.update({
      where,
      data: {
        deletedAt: new Date(),
      },
    });
  }

  _restore(params: { where: Prisma.UserWhereUniqueInput }): Promise<User> {
    const { where } = params;

    return this.orm.user.update({
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
