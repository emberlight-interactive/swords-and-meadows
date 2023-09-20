import { Schema, type } from '@colyseus/schema';
import {
  InputAndStateSync,
  NetworkCommKey,
  NetworkedStateBundle,
} from './networked-state';

export interface IPlayerInput extends InputAndStateSync {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  relativeMouseAngle: number;
}

export interface IPlayerState extends InputAndStateSync {
  x: number;
  y: number;
  relativeMouseAngle: number;
}

export class PlayerState extends Schema implements IPlayerState {
  @type('number') public x: number = 0;
  @type('number') public y: number = 0;
  @type('number') public relativeMouseAngle: number = 0;
  @type('number') public clientTick: number = 0;
}

const velocity = 2;
export const wandPivotOffset = { x: -13, y: 2 };
export const wandEffectiveLength = 32;
export const playerStateModification = (
  input: IPlayerInput,
  state: IPlayerState
) => {
  if (input.left) {
    state.x -= velocity;
  } else if (input.right) {
    state.x += velocity;
  }

  if (input.up) {
    state.y -= velocity;
  } else if (input.down) {
    state.y += velocity;
  }

  state.relativeMouseAngle = input.relativeMouseAngle;
  state.clientTick = input.clientTick;
};

export type PlayerNetworkedStateBundle = NetworkedStateBundle<
  IPlayerInput,
  NetworkCommKey.PlayerState,
  IPlayerState
>;
