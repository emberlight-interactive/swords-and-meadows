export interface ServerMessenger {
  send: (type: string | number, message: object) => void;
}
