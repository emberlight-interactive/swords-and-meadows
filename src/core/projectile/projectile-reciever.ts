import { IProjectileState } from '../../shared/network/networked-state/projectile-networked-state';
import { Synced } from '../../shared/models/synced';
import { XYTransformable } from '../../shared/models/x-y-transformable';
import { Rotatable } from '../../shared/models/rotatable';
import { Destroyable } from '../../shared/models/destroyable';
import { IntegerDeltaCalculator } from '../../shared/util/integer-delta-calculator';
import { env } from '../../shared/env/env';

export class ProjectileReciever implements Synced {
  private clientTicksPerServerTick =
    env.clientTicksPerSecond / env.serverTicksPerSecond;

  private yDeltas: IntegerDeltaCalculator;
  private xDeltas: IntegerDeltaCalculator;

  constructor(
    private projectileState: IProjectileState,
    private projectileEntity: XYTransformable & Rotatable & Destroyable
  ) {
    this.xDeltas = new IntegerDeltaCalculator(this.projectileEntity.x);
    this.yDeltas = new IntegerDeltaCalculator(this.projectileEntity.y);
  }

  public tick() {
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
  }

  public destroy() {
    this.projectileEntity.destroy();
  }
}
