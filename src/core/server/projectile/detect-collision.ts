import { OwnershipTrackable } from '../../../shared/models/ownership-trackable';
import { XYTransformable } from '../../../shared/models/x-y-transformable';
import { playerProjectileColliderDimensions } from '../../../shared/network/player';
import { projectileRadius } from '../../../shared/network/projectile';
import { circleRectCollision } from '../../../shared/util/collision-detection';

/** @todo: O(n^2) CRINGE, I WANT TO DIE AND SO WILL THE SERVER */
export function detectProjectileCollision(
  projectileMap: Map<string, XYTransformable & OwnershipTrackable>,
  playerMap: Map<string, XYTransformable>,
  callback: (projectileKey: string, playerKey: string) => void
) {
  projectileMap.forEach((projectile, projectileKey) => {
    playerMap.forEach((player, playerKey) => {
      if (
        projectile.owner !== playerKey &&
        /** @todo: maybe instead of advanced matamatics we just >x >y ness */
        circleRectCollision(
          {
            x: projectile.x,
            y: projectile.y,
            radius: projectileRadius,
          },
          {
            x: player.x,
            y: player.y,
            width: playerProjectileColliderDimensions.w,
            height: playerProjectileColliderDimensions.h,
          }
        )
      ) {
        callback(projectileKey, playerKey);
      }
    });
  });
}
