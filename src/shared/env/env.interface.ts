export interface Env {
  serverWsUrl: string;
  serverHttpUrl: string;
  serverPort: number;
  serverRoomName: string;
  clientFixedTimeStep: number;
  serverFixedTimeStep: number;
  interpolationFactor: number;
}
