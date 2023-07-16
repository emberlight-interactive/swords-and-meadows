import { Schema, type } from '@colyseus/schema';
import { InputKey, NetworkedStateBundle } from './networked-state';

export interface IPlayerInput {
  left: boolean;
  right: boolean;
  up: boolean;
  down: boolean;
  tick: number;
}

export interface IPlayerState /* extends NetworkedState<IPlayerInput>*/ {
  x: number;
  y: number;
  tick: number;
}

export class PlayerState extends Schema implements IPlayerState {
  @type('number') public x: number = 0;
  @type('number') public y: number = 0;
  @type('number') public tick: number = 0;

  public inputQueue: IPlayerInput[] = []; // @todo no bueno
}

const velocity = 2;
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

  state.tick = input.tick;
};

export type PlayerNetworkedStateBundle = NetworkedStateBundle<
  IPlayerInput,
  InputKey.PlayerState,
  IPlayerState
>;
