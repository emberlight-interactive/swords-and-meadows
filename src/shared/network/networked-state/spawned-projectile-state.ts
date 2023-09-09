import { Schema, type } from '@colyseus/schema';
import {
  InputAndStateSync,
  NetworkCommKey,
  NetworkedStateBundle,
} from './networked-state';

enum ProjectileType {
  Standard,
}

enum ProjectileShape {
  Circle,
}

const projectileProperties: {
  [key in ProjectileType]: {
    speed: number;
    shape: ProjectileShape;
    size: number;
  };
} = {
  [ProjectileType.Standard]: {
    speed: 1,
    shape: ProjectileShape.Circle,
    size: 1,
  },
} as const;

export interface ISpawnProjectileInput extends InputAndStateSync {
  spawn: true;
}

export interface ISpawnedProjectileState extends InputAndStateSync {
  x: number;
  y: number;
  angle: number;
  projectileType: ProjectileType;
}

export class SpawnedProjectileState
  extends Schema
  implements ISpawnedProjectileState
{
  @type('number') public x: number = 0;
  @type('number') public y: number = 0;
  @type('number') public angle: number = 0;
  @type('number') public projectileType: ProjectileType =
    ProjectileType.Standard;
  @type('number') public tick: number = 0;
}

const velocity = 2;
export const spawnedProjectileStateModification = (
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
  state.tick = input.tick;
};

export type PlayerNetworkedStateBundle = NetworkedStateBundle<
  IPlayerInput,
  NetworkCommKey.PlayerState,
  IPlayerState
>;
