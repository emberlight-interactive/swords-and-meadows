import { Math } from 'phaser';
import { Destroyable } from '../../shared/models/destroyable';
import { XYTransformable } from '../../shared/models/x-y-transformable';
import { env } from '../../shared/env/env';
import {
  IPlayerState,
  PlayerLerpCalculator,
} from '../../shared/network/player';
import { Rotatable } from '../../shared/models/rotatable';

export class PlayerRecieverEntity implements Readonly<XYTransformable> {
  private stateRef!: IPlayerState;
  public setState(stateRef: IPlayerState) {
    this.stateRef = stateRef;
  }

  private playerLerpCalculator: PlayerLerpCalculator;

  public get x() {
    return this.playerEntity.x;
  }

  public get y() {
    return this.playerEntity.y;
  }

  constructor(
    private playerEntity: XYTransformable & Destroyable,
    private playerWand: Rotatable & Destroyable
  ) {
    this.playerLerpCalculator = new PlayerLerpCalculator(
      this.playerEntity.x,
      this.playerEntity.y
    );
  }

  public tick() {
    this.playerLerpCalculator.addPosition(this.stateRef);

    this.playerEntity.x -= this.playerLerpCalculator.getNextXDelta();
    this.playerEntity.y -= this.playerLerpCalculator.getNextYDelta();

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
