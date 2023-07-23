import { HelperService } from '@common/helpers/helpers';
import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ApiConfigService } from './config.service';
import { app } from './configs/app.config';
import { oauth } from './configs/oauth.config';
import { swagger } from './configs/swagger.config';
import { token } from './configs/token.config';
import { validationSchema } from './validation-schema';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [`${process.cwd()}/.env`],
      load: [app, token, oauth, swagger],
      cache: HelperService.isDev() ? false : true,
      expandVariables: true,
      validationSchema,
      validationOptions: {
        allowUnknown: true,
        abortEarly: true,
      },
    }),
  ],
  providers: [ApiConfigService],
  exports: [ApiConfigService],
})
export class ApiConfigModule {}
