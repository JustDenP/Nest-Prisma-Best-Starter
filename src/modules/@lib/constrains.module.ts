import { IsUniqueConstraint } from '@common/decorators/validators/is-unique.decorator';
import { Module } from '@nestjs/common';
import { PrismaModule } from 'database/prisma.module';

const constraints = [IsUniqueConstraint];

@Module({
  imports: [PrismaModule],
  providers: [...constraints],
  exports: [...constraints],
})
export class ConstraintsModule {}
