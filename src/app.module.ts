import { HttpCacheInterceptor } from '@common/interceptors/cache.interceptor';
import { ClearCacheInterceptor } from '@common/interceptors/clear-cache.interceptor';
import { StaticTimeoutInterceptor } from '@common/interceptors/static-timeout-handle.interceptor';
import { RealIpMiddleware } from '@common/middlewares/ip.middleware';
import { NestCacheModule } from '@modules/@lib/cache/cache.module';
import { ConstraintsModule } from '@modules/@lib/constraints.module';
import { NestHttpModule } from '@modules/@lib/http.module';
import { NestJwtModule } from '@modules/@lib/jwt.module';
import { NestPinoModule } from '@modules/@lib/pino';
import { NestTrottleModule } from '@modules/@lib/trottle.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UserModule } from '@modules/user/user.module';
import type { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard } from '@nestjs/throttler';

import { ApiConfigModule } from './modules/@lib/config/config.module';
import { HealthCheckerModule } from './modules/health-checker/health-checker.module';

@Module({
  imports: [
    ApiConfigModule,
    NestPinoModule,
    NestHttpModule,
    NestTrottleModule,
    NestCacheModule,
    HealthCheckerModule,
    ConstraintsModule,
    NestJwtModule,
    UserModule,
    AuthModule,
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: StaticTimeoutInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: HttpCacheInterceptor,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: ClearCacheInterceptor,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RealIpMiddleware).forRoutes('/');
  }
}
