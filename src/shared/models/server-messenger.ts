/** @todo: type the input key and input */
export interface ServerMessenger {
  send: (type: string | number, message: object) => void;
}
