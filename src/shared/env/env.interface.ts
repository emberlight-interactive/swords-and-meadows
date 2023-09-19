export interface Env {
  serverSSL: boolean;
  serverHostname: string;
  serverPort: number;
  serverRoomName: string;
  clientTicksPerSecond: number;
  serverTicksPerSecond: number;
  interpolationFactor: number;
}
