import { InputAndStateSync } from './input-and-state-sync';

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

export const playerInputKey = 0 as const;

const velocity = 2;
export const wandPivotOffset = { x: -13, y: 2 };
export const wandStandardLength = 32;
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
