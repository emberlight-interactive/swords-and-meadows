import { Env } from './env.interface';

export const envDev: Env = {
  serverSSL: false,
  serverHostname: 'localhost',
  serverPort: 80,
  serverRoomName: 'main',
  clientTicksPerSecond: 60,
  serverTicksPerSecond: 12,
  interpolationFactor: 0.12,
};
