import { registerAs } from '@nestjs/config';

export const app = registerAs('app', () => ({
  port: Number(process.env.PORT),
  base_url: process.env.BASE_URL,
  isCors: true,
}));
