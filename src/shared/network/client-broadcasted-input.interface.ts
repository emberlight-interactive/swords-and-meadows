export interface ClientBroadcastedInput {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  mouseWorldX: number;
  mouseWorldY: number;
  rmb: boolean;
  // lmb: boolean;
  /** Use for sync, NOT AUTHENTICATION */
  clientTick: number;
}
