import { Module } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { PrismaModule } from 'database/prisma.module';
import { UserService } from './user.service';
import { UserController } from './user.contoller';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserRepository, UserService],
  exports: [UserModule],
})
export class UserModule {}
