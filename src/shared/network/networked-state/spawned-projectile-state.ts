// import { Schema, type } from '@colyseus/schema';
// import {
//   GameState,
//   InputAndStateSync,
//   NetworkCommKey,
//   NetworkedStateBundle,
// } from './networked-state';
// import { IPlayerState, wandPivotOffset } from './player-networked-state';
// import { ObjectQueue } from '~/shared/util/object-queue';

// enum ProjectileType {
//   Standard,
// }

// enum ProjectileShape {
//   Circle,
// }

// const projectileProperties: {
//   [key in ProjectileType]: {
//     speed: number;
//     shape: ProjectileShape;
//     size: number;
//   };
// } = {
//   [ProjectileType.Standard]: {
//     speed: 1,
//     shape: ProjectileShape.Circle,
//     size: 1,
//   },
// } as const;

// export interface ISpawnProjectileInput extends InputAndStateSync {
//   spawn: true;
// }

// export interface ISpawnedProjectileState extends InputAndStateSync {
//   x: number;
//   y: number;
//   angle: number;
//   projectileType: ProjectileType;
// }

// export class SpawnedProjectileState
//   extends Schema
//   implements ISpawnedProjectileState
// {
//   @type('number') public x: number = 0;
//   @type('number') public y: number = 0;
//   @type('number') public angle: number = 0;
//   @type('number') public projectileType: ProjectileType =
//     ProjectileType.Standard;
//   @type('number') public tick: number = 0;

// }

// class SpawnedProjectileStateModifer {
//   private headIndex = 0;
//   private tailIndex = 0;

//   private projectiles = new ObjectQueue<ISpawnedProjectileState>();

//   constructor(
//     private spawnedProjectileMap: Map<number, ISpawnedProjectileState>
//   ) {}

//   public addProjectileState(
//     input: ISpawnProjectileInput,
//     gameState: GameState,
//     playerState: IPlayerState
//   ) {
//     // Check if projectile type can be fired (cost / time of last player owned projectile)

//     const spawnedProjectileState = new SpawnedProjectileState();
//     spawnedProjectileState.x = this.getWandProjectilePointX(playerState);
//     spawnedProjectileState.y = this.getWandProjectilePointY(playerState);
//     spawnedProjectileState.angle = playerState.relativeMouseAngle;
//     spawnedProjectileState.tick =
//       input.tick <= gameState.tick ? input.tick : gameState.tick;
//     this.projectiles.add(spawnedProjectileState);
//     this.spawnedProjectileMap.set(this.headIndex, spawnedProjectileState);

//     // Assume no more than 2500 active projectiles at once
//     if (this.headIndex - this.tailIndex > 2500) {
//       const projectile = this.projectiles.shift();
//     }
//   }

//   private getWandProjectilePointX(playerState: IPlayerState) {
//     return (
//       16 *
//         Math.cos(
//           (Math.PI * 2 * ((playerState.relativeMouseAngle + 360) % 360)) / 360
//         ) +
//       playerState.x +
//       wandPivotOffset.x
//     );
//   }

//   private getWandProjectilePointY(playerState: IPlayerState) {
//     return (
//       16 *
//         Math.sin(
//           (Math.PI * 2 * ((playerState.relativeMouseAngle + 360) % 360)) / 360
//         ) +
//       playerState.y +
//       wandPivotOffset.y
//     );
//   }
// }

// const velocity = 2;
// export const spawnedProjectileStateModification = (
//   input: ISpawnProjectileInput,
//   playerState: IPlayerState,
//   state: ISpawnedProjectileState,
// ) => {



//   state.relativeMouseAngle = input.relativeMouseAngle;
//   state.tick = input.tick;
// };

// export type PlayerNetworkedStateBundle = NetworkedStateBundle<
//   IPlayerInput,
//   NetworkCommKey.PlayerState,
//   IPlayerState
// >;
