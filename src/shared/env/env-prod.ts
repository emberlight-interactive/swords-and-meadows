import { Env } from './env.interface';

export const envProd: Env = {
  serverSSL: true,
  serverHostname: 'samo-alpha-server-x562qguoqq-uc.a.run.app',
  serverPort: 80,
  serverRoomName: 'main',
  clientFixedTimeStep: 1000 / 60,
  serverFixedTimeStep: 1000 / 12,
  interpolationFactor: 0.12,
};
