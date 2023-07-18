import { Destroyable } from '~/shared/entities/destroyable';
import { XYTransformable } from '~/shared/entities/x-y-transformable';
import { env } from '../../shared/env/env';
import { NetworkRecieverEntity } from '~/shared/network/client-network-manager';
import { IPlayerState } from '~/shared/network/networked-state/player-networked-state';

export class PlayerRecieverEntity
  implements NetworkRecieverEntity<IPlayerState>
{
  private stateRef!: IPlayerState;
  public setState(stateRef: IPlayerState) {
    this.stateRef = stateRef;
  }

  constructor(private playerEntity: XYTransformable & Destroyable) {}

  public tick() {
    this.playerEntity.x = Phaser.Math.Linear(
      this.playerEntity.x,
      this.stateRef.x,
      env.interpolationFactor
    );

    this.playerEntity.y = Phaser.Math.Linear(
      this.playerEntity.y,
      this.stateRef.y,
      env.interpolationFactor
    );
  }

  public destroy() {
    this.playerEntity.destroy();
  }
}
