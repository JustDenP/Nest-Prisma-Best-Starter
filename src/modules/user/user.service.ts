import { Injectable } from '@nestjs/common';
import { PageOptionsDTO } from 'database/pagination/page-options.dto';
import { PrismaService } from 'database/prisma.service';
import { UserRepository } from './user.repository';

@Injectable()
export class UserService {
  constructor(
    private readonly orm: PrismaService,
    private readonly userRepository: UserRepository,
  ) {}

  getPaginated(pageOptions: PageOptionsDTO) {
    return this.userRepository.getPaginated(pageOptions);
  }
}
