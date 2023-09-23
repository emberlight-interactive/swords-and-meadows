import { env } from '../env/env';
import { XYTransformable } from '../models/x-y-transformable';
import { IntegerDeltaCalculator } from '../util/integer-delta-calculator';
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
export const playerProjectileColliderDimensions = { w: 24, h: 40 };
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

export class PlayerLerpCalculator {
  private clientTicksPerServerTick =
    env.clientTicksPerSecond / env.serverTicksPerSecond;

  private yDeltas: IntegerDeltaCalculator;
  private xDeltas: IntegerDeltaCalculator;

  public getNextYDelta() {
    return this.yDeltas.deltaQueue.shift() || 0;
  }

  public getNextXDelta() {
    return this.xDeltas.deltaQueue.shift() || 0;
  }

  constructor(x: number, y: number) {
    this.xDeltas = new IntegerDeltaCalculator(x);
    this.yDeltas = new IntegerDeltaCalculator(y);
  }

  public addPosition(
    pos: XYTransformable,
    deltas = this.clientTicksPerServerTick
  ) {
    this.xDeltas.updateDeltas(pos.x, deltas);
    this.yDeltas.updateDeltas(pos.y, deltas);
  }
}
