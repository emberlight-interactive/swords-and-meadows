import { Schema, type, MapSchema } from '@colyseus/schema';
import { PlayerState } from './player-networked-state';
import { ProjectileState } from './projectile-networked-state';

export class GameState extends Schema {
  @type('number') public mapWidth: number = 0;
  @type('number') public mapHeight: number = 0;

  @type({ map: PlayerState }) public players = new MapSchema<PlayerState>();
  @type({ map: ProjectileState }) public projectiles =
    new MapSchema<ProjectileState>();
}

export interface InputAndStateSync {
  clientTick: number;
}

export enum NetworkCommKey {
  PlayerState,
  ProjectileState,
}

export type NetworkedStateBundle<
  TInput,
  TInputKey extends NetworkCommKey,
  TState,
> = {
  input: TInput;
  inputKey: TInputKey;
  state: TState;
};
