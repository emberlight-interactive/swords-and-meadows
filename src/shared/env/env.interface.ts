export interface Env {
  serverSSL: boolean;
  serverHostname: string;
  serverPort: number;
  serverRoomName: string;
  clientFixedTimeStep: number;
  serverFixedTimeStep: number;
  interpolationFactor: number;
}
