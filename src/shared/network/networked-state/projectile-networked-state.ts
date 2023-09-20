import { Schema, type } from '@colyseus/schema';
import {
  InputAndStateSync,
  NetworkCommKey,
  NetworkedStateBundle,
} from './networked-state';

export interface IProjectileSpawnInput extends InputAndStateSync {
  spawn: true;
  clientTick: number;
}

export interface IProjectileState {
  x: number;
  y: number;
  angle: number;
}

export class ProjectileState extends Schema implements IProjectileState {
  @type('number') public x: number = 0;
  @type('number') public y: number = 0;
  @type('number') public angle: number = 0;
}

export const wandPivotOffset = { x: -13, y: 2 };
export const wandEffectiveLength = 32;

export type ProjectileNetworkedStateBundle = NetworkedStateBundle<
  IProjectileSpawnInput,
  NetworkCommKey.ProjectileState,
  IProjectileState
>;
