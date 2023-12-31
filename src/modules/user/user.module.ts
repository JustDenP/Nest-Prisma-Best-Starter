import { PrismaModule } from '@database/prisma.module';
import { Module } from '@nestjs/common';

import { UserController } from './user.contoller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserRepository, UserService],
})
export class UserModule {}
