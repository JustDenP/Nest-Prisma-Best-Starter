import { IsUniqueConstraint } from '@common/decorators/validators/is-unique.decorator';
import { PrismaModule } from '@database/prisma.module';
import { Module } from '@nestjs/common';

const constraints = [IsUniqueConstraint];

@Module({
  imports: [PrismaModule],
  providers: [...constraints],
  exports: [...constraints],
})
export class ConstraintsModule {}
