import crypto from 'crypto';
import {
  IPlayerState,
  wandStandardLength,
  wandPivotOffset,
} from '../../../shared/network/player';
import { IProjectileState } from '../../../shared/network/projectile';
import { ProjectileState } from '../state/projectile-state';

export function addProjectile(
  projectileMap: Map<string, IProjectileState>,
  playerState: IPlayerState
) {
  const projectile = new ProjectileState();
  projectile.angle = playerState.relativeMouseAngle;
  projectile.x =
    (wandStandardLength / 2) *
      Math.cos(
        (Math.PI * 2 * ((playerState.relativeMouseAngle + 360) % 360)) / 360
      ) +
    playerState.x +
    wandPivotOffset.x;

  projectile.y =
    (wandStandardLength / 2) *
      Math.sin(
        (Math.PI * 2 * ((playerState.relativeMouseAngle + 360) % 360)) / 360
      ) +
    playerState.y +
    wandPivotOffset.y;

  projectileMap.set(crypto.randomBytes(5).toString('hex'), projectile);
}
