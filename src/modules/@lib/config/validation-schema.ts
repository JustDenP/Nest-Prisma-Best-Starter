import { NodeEnv } from '@common/@types/enums/common.enum';
import Joi from 'joi';

export const validationSchema = Joi.object({
  /* App */
  NODE_ENV: Joi.string().valid(NodeEnv.Development, NodeEnv.Production, NodeEnv.Test).required(),
  PORT: Joi.number().required(),
  BASE_URL: Joi.string().required(),
  /* Database */
  DB_HOST: Joi.string().required(),
  DB_PORT: Joi.number().required(),
  DB_PASSWORD: Joi.string().allow('').optional(),
  DB_USERNAME: Joi.string().required(),
  DB_DATABASE: Joi.string().required(),
  DATABASE_URL: Joi.string().required(),
  /* Token */
  JWT_SECRET: Joi.string().required(),
  /* Oauth providers */
  GOOGLE_OAUTH_CLIENT_ID: Joi.string().required(),
  GOOGLE_OAUTH_CLIENT_SECRET: Joi.string().required(),
});
