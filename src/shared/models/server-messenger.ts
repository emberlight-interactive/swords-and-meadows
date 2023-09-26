export interface ServerMessenger {
  send: <T = object>(type: string | number, message: T) => void;
}
