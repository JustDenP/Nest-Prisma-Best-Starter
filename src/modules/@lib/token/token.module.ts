import { PrismaModule } from '@database/prisma.module';
import { UserModule } from '@modules/user/user.module';
import { Module } from '@nestjs/common';

import { TokenService } from './token.service';

@Module({
  imports: [PrismaModule, UserModule],
  controllers: [],
  providers: [TokenService],
  exports: [TokenService],
})
export class TokenModule {}
