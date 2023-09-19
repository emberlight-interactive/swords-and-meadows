import { Math } from 'phaser';
import { Destroyable } from '~/shared/models/destroyable';
import { XYTransformable } from '~/shared/models/x-y-transformable';
import { env } from '../../shared/env/env';
import { NetworkRecieverEntity } from '~/shared/network/client-network-manager';
import { IPlayerState } from '~/shared/network/networked-state/player-networked-state';
import { Rotatable } from '~/shared/models/rotatable';
import { Queue } from '../../shared/util/queue';

export class PlayerRecieverEntity
  implements NetworkRecieverEntity<IPlayerState>
{
  private stateRef!: IPlayerState;
  public setState(stateRef: IPlayerState) {
    this.stateRef = stateRef;
  }

  private clientTicksPerServerTick =
    env.clientTicksPerSecond / env.serverTicksPerSecond;

  private yDeltas: IntegerDeltaCalculator;
  private xDeltas: IntegerDeltaCalculator;

  constructor(
    private playerEntity: XYTransformable & Destroyable,
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

class IntegerDeltaCalculator {
  private _deltaQueue = new Queue<number>();
  public get deltaQueue() {
    return this._deltaQueue;
  }

  constructor(private lastState: number) {}
  public updateDeltas(newState: number, numberOfDeltas: number) {
    const diff = this.lastState - newState;
    if (diff) {
      const deltas = diff / numberOfDeltas;
      for (let i = 0; i < numberOfDeltas; i++) {
        this._deltaQueue.push(deltas);
      }
    }

    this.lastState = newState;
  }
}
