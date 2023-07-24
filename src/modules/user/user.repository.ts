import { NoContentException } from '@common/exceptions/no-content.exception';
import { Injectable } from '@nestjs/common';
import { User } from '@prisma/client';
import { Pagination } from 'database/paginate';
import { PageOptionsDTO } from 'database/pagination/page-options.dto';
import { PrismaService } from 'database/prisma.service';

@Injectable()
export class UserRepository {
  constructor(private readonly orm: PrismaService) {}

  async getPaginated(pageOptionsDTO: PageOptionsDTO) {
    try {
      const query = Pagination.getQuery(pageOptionsDTO);
      const [total, results] = await this.orm.$transaction([
        this.orm.user.count(),
        this.orm.user.findMany(query),
      ]);
      return Pagination.paginate<User>(pageOptionsDTO, total, results);
    } catch (error: any) {
      throw new NoContentException();
    }
  }
}
