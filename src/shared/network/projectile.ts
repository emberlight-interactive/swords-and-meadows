import { InputAndStateSync } from './input-and-state-sync';

export interface IProjectileSpawnInput extends InputAndStateSync {
  spawn: true;
  clientTick: number;
}

export interface IProjectileState {
  x: number;
  y: number;
  angle: number;
}

export const projectileInputKey = 1 as const;
export const wandPivotOffset = { x: -13, y: 2 };
export const wandEffectiveLength = 32;
