import { IProjectileState } from '../../../shared/network/networked-state/projectile-networked-state';

export function moveProjectiles(projectileMap: Map<string, IProjectileState>) {
  for (const projectile of projectileMap.values()) {
    projectile.x +=
      Math.cos((Math.PI * 2 * ((projectile.angle + 360) % 360)) / 360) *
      1 *
      2.5;

    projectile.y +=
      Math.sin((Math.PI * 2 * ((projectile.angle + 360) % 360)) / 360) *
      1 *
      2.5;
  }
}
