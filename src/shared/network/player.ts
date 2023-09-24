import { HealthTrackable } from '../models/health-trackable';
import { PointerTrackable } from '../models/pointer-trackable';
import { XYTransformable } from '../models/x-y-transformable';
import { InputAndStateSync } from './input-and-state-sync';

export interface IPlayerInput extends InputAndStateSync {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  relativeMouseAngle: number;
}

export interface IPlayerState
  extends InputAndStateSync,
    XYTransformable,
    PointerTrackable,
    HealthTrackable {}

export const playerInputKey = 0 as const;

const velocity = 2;
export const wandPivotOffset = { x: -13, y: 2 };
export const wandStandardLength = 32;
export const playerProjectileColliderDimensions = { w: 24, h: 40 };
export const playerDefaultHealth = 100;
export const playerStateModification = (
  input: IPlayerInput,
  state: InputAndStateSync & XYTransformable & PointerTrackable
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
