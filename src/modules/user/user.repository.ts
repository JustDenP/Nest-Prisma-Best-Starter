import { NoContentException } from '@common/exceptions/no-content.exception';
import { Injectable } from '@nestjs/common';
import { Prisma, User } from '@prisma/client';
import { Pagination } from 'database/pagination';
import { PageOptionsDTO } from 'database/pagination/page-options.dto';
import { PrismaService } from 'database/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly orm: PrismaService) {}

  /* Get paginated users */
  async getPaginated(pageOptionsDTO: PageOptionsDTO) {
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

  async createUser(params: { data: Prisma.UserCreateInput }): Promise<User> {
    const { data } = params;
    return this.orm.user.create({ data });
  }

  async getUsers(params: {
    skip?: number;
    take?: number;
    cursor?: Prisma.UserWhereUniqueInput;
    where?: Prisma.UserWhereInput;
    orderBy?: Prisma.UserOrderByWithRelationInput;
  }): Promise<User[]> {
    const { skip, take, cursor, where, orderBy } = params;
    return this.orm.user.findMany({ skip, take, cursor, where, orderBy });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;
    return this.orm.user.update({ where, data });
  }

  async deleteUser(params: { where: Prisma.UserWhereUniqueInput }): Promise<User> {
    const { where } = params;
    return this.orm.user.delete({ where });
  }
}
