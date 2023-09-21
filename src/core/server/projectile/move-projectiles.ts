import { IProjectileState } from '../../../shared/network/projectile';

const projectileSpeed = 3.5;
export function moveProjectiles(projectileMap: Map<string, IProjectileState>) {
  for (const projectile of projectileMap.values()) {
    projectile.x +=
      Math.cos((Math.PI * 2 * ((projectile.angle + 360) % 360)) / 360) *
      1 *
      projectileSpeed;

    projectile.y +=
      Math.sin((Math.PI * 2 * ((projectile.angle + 360) % 360)) / 360) *
      1 *
      projectileSpeed;
  }
}
