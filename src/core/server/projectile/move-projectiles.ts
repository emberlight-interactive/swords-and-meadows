import { IProjectileState } from '../../../shared/network/projectile';
import { destinationCalculator } from '../../../shared/util/destination-calculator';

const projectileSpeed = 3.5;
export function moveProjectiles(
  projectileMap: Map<string, IProjectileState>,
  reachedDestination: (
    projectileKey: string,
    projectile: IProjectileState
  ) => void
) {
  for (const [key, projectile] of projectileMap.entries()) {
    const newPosOffset = destinationCalculator(
      0,
      0,
      projectile.angle,
      projectileSpeed
    );
    projectile.x += newPosOffset.x;
    projectile.y += newPosOffset.y;

    /** Passed point check assumes linear travel direction */
    if (
      (newPosOffset.x < 0 && projectile.desinationWorldX > projectile.x) ||
      (newPosOffset.x > 0 && projectile.desinationWorldX < projectile.x)
    ) {
      projectile.x = projectile.desinationWorldX;
      projectile.y = projectile.desinationWorldY;

      reachedDestination(key, projectile);
    }
  }
}
