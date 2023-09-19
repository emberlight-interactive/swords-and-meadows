export interface SendServerMessage {
  send: (type: string | number, message: object) => void;
}
