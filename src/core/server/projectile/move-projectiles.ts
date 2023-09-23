import { Rotatable } from '../../../shared/models/rotatable';
import { XYTransformable } from '../../../shared/models/x-y-transformable';
import { IProjectileState } from '../../../shared/network/projectile';

const projectileSpeed = 3.5;
export function moveProjectiles(
  projectileMap: Map<string, IProjectileState>,
  reverse = false
) {
  for (const projectile of projectileMap.values()) {
    moveProjectile(projectile, reverse);
  }
}

export function moveProjectile(
  projectile: XYTransformable & Rotatable,
  reverse = false
) {
  const x =
    Math.cos((Math.PI * 2 * ((projectile.angle + 360) % 360)) / 360) *
    1 *
    projectileSpeed;

  const y =
    Math.sin((Math.PI * 2 * ((projectile.angle + 360) % 360)) / 360) *
    1 *
    projectileSpeed;

  projectile.x += (reverse ? -1 : 1) * x;
  projectile.y += (reverse ? -1 : 1) * y;
}
