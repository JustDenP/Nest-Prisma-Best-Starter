import { PrismaModule } from '@database/prisma.module';
import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';

import { HealthCheckerController } from './health-checker.controller';
import { ServiceHealthIndicator } from './health-indicators/service.indicator';

@Module({
  imports: [TerminusModule, PrismaModule],
  controllers: [HealthCheckerController],
  providers: [ServiceHealthIndicator],
})
export class HealthCheckerModule {}
