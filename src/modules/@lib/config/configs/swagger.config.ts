import { registerAs } from '@nestjs/config';

export const swagger = registerAs('swagger', () => ({
  enabled: true,
  title: 'My beautiful application',
  description: 'The nestjs API description',
  path: 'api',
}));
