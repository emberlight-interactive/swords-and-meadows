import { HealthTrackable } from '../../../shared/models/health-trackable';
import { OwnershipTrackable } from '../../../shared/models/ownership-trackable';
import { XYTransformable } from '../../../shared/models/x-y-transformable';
import {
  ExplosionTypeTrackable,
  explosionDimensions,
} from '../../../shared/network/explosion';
import { playerProjectileColliderDimensions } from '../../../shared/network/player';
import { rectRectCollision } from '../../../shared/util/collision-detection';
import { Queue } from '../../../shared/util/queue';

type Explosion = XYTransformable & ExplosionTypeTrackable & OwnershipTrackable;

export class ExplosionManager {
  private explosionsToProcess = new Queue<Explosion>();

  constructor(
    private playerMap: Map<string, XYTransformable & HealthTrackable>
  ) {}

  public addExplosion(explosion: Explosion) {
    this.explosionsToProcess.push(explosion);
  }

  /** @todo - another O(n^2) */
  public processAddedExplosions() {
    let explosionToProcess: Explosion | undefined;

    while ((explosionToProcess = this.explosionsToProcess.shift())) {
      const explosion = {
        x: explosionToProcess.x,
        y: explosionToProcess.y,
        width: explosionDimensions[explosionToProcess.explosionType].width,
        height: explosionDimensions[explosionToProcess.explosionType].height,
      };

      for (const [playerKey, player] of this.playerMap.entries()) {
        if (
          playerKey !== explosionToProcess.owner &&
          rectRectCollision(explosion, {
            x: player.x,
            y: player.y,
            width: playerProjectileColliderDimensions.w,
            height: playerProjectileColliderDimensions.h,
          })
        ) {
          player.health -= 10;
        }
      }
    }
  }
}
