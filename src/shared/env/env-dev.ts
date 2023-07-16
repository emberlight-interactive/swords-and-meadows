import { Env } from './env.interface';

export const envDev: Env = {
  serverWsUrl: 'ws://localhost:2567',
  serverHttpUrl: 'http://localhost:2567',
  serverPort: 2567,
  serverRoomName: 'main',
  fixedTimeStep: 1000 / 60,
};
