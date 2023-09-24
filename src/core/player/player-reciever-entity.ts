import { Math } from 'phaser';
import { Destroyable } from '~/shared/models/destroyable';
import { XYTransformable } from '~/shared/models/x-y-transformable';
import { env } from '../../shared/env/env';
import { IPlayerState } from '~/shared/network/player';
import { Rotatable } from '~/shared/models/rotatable';
import { IntegerDeltaCalculator } from '../../shared/util/integer-delta-calculator';
import { HealthTrackable } from '../../shared/models/health-trackable';

export class PlayerRecieverEntity {
  private stateRef!: IPlayerState;
  public setState(stateRef: IPlayerState) {
    this.stateRef = stateRef;
  }

  private clientTicksPerServerTick =
    env.clientTicksPerSecond / env.serverTicksPerSecond;

  private yDeltas: IntegerDeltaCalculator;
  private xDeltas: IntegerDeltaCalculator;

  constructor(
    private playerEntity: XYTransformable & Destroyable & HealthTrackable,
    private playerWand: Rotatable & Destroyable
  ) {
    this.xDeltas = new IntegerDeltaCalculator(this.playerEntity.x);
    this.yDeltas = new IntegerDeltaCalculator(this.playerEntity.y);
  }

  public tick() {
    this.xDeltas.updateDeltas(this.stateRef.x, this.clientTicksPerServerTick);
    this.yDeltas.updateDeltas(this.stateRef.y, this.clientTicksPerServerTick);

    this.playerEntity.x -= this.xDeltas.deltaQueue.shift() || 0;
    this.playerEntity.y -= this.yDeltas.deltaQueue.shift() || 0;
    this.playerEntity.health = this.stateRef.health;

    this.playerWand.angle = Math.RadToDeg(
      Phaser.Math.Angle.RotateTo(
        Math.DegToRad(this.playerWand.angle),
        Math.DegToRad(this.stateRef.relativeMouseAngle),
        3.1412 * env.interpolationFactor * 0.8
      )
    );
  }

  public destroy() {
    this.playerEntity.destroy();
    this.playerWand.destroy();
  }
}
