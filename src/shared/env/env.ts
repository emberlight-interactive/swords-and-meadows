import { envDev } from './env-dev';
import { envProd } from './env-prod';
import { Env } from './env.interface';

export const env: Env =
  process.env.NODE_ENV === 'development' ? envDev : envProd;
