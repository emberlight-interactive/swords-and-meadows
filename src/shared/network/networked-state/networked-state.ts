import { Schema, type, MapSchema } from '@colyseus/schema';
import { PlayerState } from './player-networked-state';

export class GameState extends Schema {
  @type({ map: PlayerState }) public players = new MapSchema<PlayerState>();
}

export interface InputAndStateSync {
  tick: number; // use for syncronization, NOT authentication
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
