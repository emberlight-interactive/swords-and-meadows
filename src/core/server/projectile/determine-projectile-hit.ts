import { env } from '../../../shared/env/env';
import { Rotatable } from '../../../shared/models/rotatable';
import { XYTransformable } from '../../../shared/models/x-y-transformable';
import {
  PlayerLerpCalculator,
  playerProjectileColliderDimensions,
} from '../../../shared/network/player';
import { projectileRadius } from '../../../shared/network/projectile';
import { circleRectCollision } from '../../../shared/util/collision-detection';
import { moveProjectile } from './move-projectiles';

export function didProjectileHit(
  player: XYTransformable,
  projectile: XYTransformable,
  /** Projectile position at last server tick */
  currProjectile: XYTransformable & Rotatable,
  /** Oldest to newest */
  playerPositionHistory: XYTransformable[]
): boolean {
  const clientTicksPerServerTick =
    env.clientTicksPerSecond / env.serverTicksPerSecond;
  const currPlayerPos = playerPositionHistory[playerPositionHistory.length - 1];
  const playerLerpCalculator = new PlayerLerpCalculator(
    currPlayerPos.x,
    currPlayerPos.y
  );

  const rewindablePlayer = { x: currPlayerPos.x, y: currPlayerPos.y };
  const rewindableProjectile = {
    x: currProjectile.x,
    y: currProjectile.y,
    angle: currProjectile.angle,
  };

  for (let i = playerPositionHistory.length - 1; i >= 0; i--) {
    playerLerpCalculator.addPosition(
      playerPositionHistory[i],
      clientTicksPerServerTick
    );

    for (let j = 0; j < clientTicksPerServerTick; j++) {
      rewindablePlayer.x -= playerLerpCalculator.getNextXDelta();
      rewindablePlayer.y -= playerLerpCalculator.getNextYDelta();

      /** @todo we are assuming the lerp and movement of projectiles are identical */
      moveProjectile(rewindableProjectile, true);

      if (
        (round(rewindableProjectile.x, 5) === round(projectile.x, 5) &&
          round(rewindableProjectile.y, 5) === round(projectile.y, 5) &&
          round(rewindablePlayer.x, 5) === round(player.x, 5),
        round(rewindablePlayer.y, 5) === round(player.y, 5))
      ) {
        return circleRectCollision(
          {
            x: rewindableProjectile.x,
            y: rewindableProjectile.y,
            radius: projectileRadius,
          },
          {
            x: rewindablePlayer.x,
            y: rewindablePlayer.y,
            width: playerProjectileColliderDimensions.w,
            height: playerProjectileColliderDimensions.h,
          }
        );
      }
    }
  }

  return false;
}

function round(value: number, precision: number) {
  const multiplier = Math.pow(10, precision || 0);
  return Math.round(value * multiplier) / multiplier;
}
