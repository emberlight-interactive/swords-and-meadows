import {
  IProjectileHitInput,
  IProjectileState,
  projectileHitInputKey,
  projectileRadius,
} from '../../shared/network/projectile';
import { ContextSynced } from '../../shared/models/synced';
import { XYTransformable } from '../../shared/models/x-y-transformable';
import { Rotatable } from '../../shared/models/rotatable';
import { Destroyable } from '../../shared/models/destroyable';
import { IntegerDeltaCalculator } from '../../shared/util/integer-delta-calculator';
import { env } from '../../shared/env/env';
import { playerProjectileColliderDimensions } from '../../shared/network/player';
import { circleRectCollision } from '../../shared/util/collision-detection';
import { ServerMessenger } from '../../shared/models/server-messenger';

export class ProjectileReciever implements ContextSynced {
  private clientTicksPerServerTick =
    env.clientTicksPerSecond / env.serverTicksPerSecond;

  private yDeltas: IntegerDeltaCalculator;
  private xDeltas: IntegerDeltaCalculator;

  constructor(
    private projectileState: IProjectileState,
    private projectileKey: string,
    private projectileEntity: XYTransformable & Rotatable & Destroyable,
    private playerEntityMap: Map<string, XYTransformable>,
    private serverMessenger: ServerMessenger
  ) {
    this.xDeltas = new IntegerDeltaCalculator(this.projectileEntity.x);
    this.yDeltas = new IntegerDeltaCalculator(this.projectileEntity.y);
  }

  public tick(currTick: number) {
    this.xDeltas.updateDeltas(
      this.projectileState.x,
      this.clientTicksPerServerTick
    );
    this.yDeltas.updateDeltas(
      this.projectileState.y,
      this.clientTicksPerServerTick
    );

    this.projectileEntity.x -= this.xDeltas.deltaQueue.shift() || 0;
    this.projectileEntity.y -= this.yDeltas.deltaQueue.shift() || 0;

    this.playerEntityMap.forEach((player, key) => {
      if (
        this.projectileState.owner !== key &&
        /** @todo: maybe instead of advanced matamatics we just >x >y ness */
        circleRectCollision(
          {
            x: this.projectileEntity.x,
            y: this.projectileEntity.y,
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
        this.serverMessenger.send(projectileHitInputKey, <IProjectileHitInput>{
          clientTick: currTick,
          otherPlayerKey: key,
          otherPlayerX: player.x,
          otherPlayerY: player.y,
          projectileKey: this.projectileKey,
          projectileX: this.projectileEntity.x,
          projectileY: this.projectileEntity.y,
        });

        console.log('rekt');
      }
    });
  }

  public destroy() {
    this.projectileEntity.destroy();
  }
}
