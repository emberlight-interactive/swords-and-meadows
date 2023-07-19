import { Schema, type, MapSchema } from '@colyseus/schema';
import { PlayerState } from './player-networked-state';

export class GameState extends Schema {
  @type('number') public mapWidth: number = 0;
  @type('number') public mapHeight: number = 0;

  @type({ map: PlayerState }) public players = new MapSchema<PlayerState>();
}

export interface InputAndStateSync {
  tick: number;
}

export enum NetworkCommKey {
  PlayerState,
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
