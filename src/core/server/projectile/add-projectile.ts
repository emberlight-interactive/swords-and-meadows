import crypto from 'crypto';
import {
  IPlayerState,
  wandStandardLength,
  wandPivotOffset,
} from '../../../shared/network/player';
import {
  IProjectileSpawnInput,
  IProjectileState,
  ProjectileType,
  projectileMaxTravelDistance,
} from '../../../shared/network/projectile';
import { ProjectileState } from '../state/projectile-state';
import { destinationCalculator } from '../../../shared/util/destination-calculator';
import { distanceBetweenTwoPoints } from '../../../shared/util/distance-calculator';

export function addProjectile(
  projectileInput: IProjectileSpawnInput,
  projectileMap: Map<string, IProjectileState>,
  playerState: IPlayerState,
  playerKey: string
) {
  const projectile = new ProjectileState();
  projectile.angle = playerState.relativeMouseAngle;
  const spawnPosition = destinationCalculator(
    playerState.x + wandPivotOffset.x,
    playerState.y + wandPivotOffset.y,
    playerState.relativeMouseAngle,
    wandStandardLength / 2
  );

  projectile.x = spawnPosition.x;
  projectile.y = spawnPosition.y;
  projectile.owner = playerKey;

  if (
    projectileInput.type === ProjectileType.Radius &&
    distanceBetweenTwoPoints(spawnPosition, {
      x: projectileInput.desinationWorldX,
      y: projectileInput.desinationWorldY,
    }) < projectileMaxTravelDistance
  ) {
    projectile.desinationWorldX = projectileInput.desinationWorldX;
    projectile.desinationWorldY = projectileInput.desinationWorldY;
  } else {
    const maxDestination = destinationCalculator(
      spawnPosition.x,
      spawnPosition.y,
      playerState.relativeMouseAngle,
      projectileMaxTravelDistance
    );

    projectile.desinationWorldX = maxDestination.x;
    projectile.desinationWorldY = maxDestination.y;
  }

  projectile.type = projectileInput.type;

  projectileMap.set(crypto.randomBytes(5).toString('hex'), projectile);
}
