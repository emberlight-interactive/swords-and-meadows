import { Env } from './env.interface';

export const envDev: Env = {
  serverSSL: false,
  serverHostname: 'localhost',
  serverPort: 2567,
  serverRoomName: 'main',
  clientFixedTimeStep: 1000 / 60,
  serverFixedTimeStep: 1000 / 12,
  interpolationFactor: 0.12,
};
