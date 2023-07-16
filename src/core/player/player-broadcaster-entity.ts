import { Scene } from 'phaser';
import { XYTransformable } from '../../shared/entities/x-y-transformable';
import { NetworkBroadcastEntity } from '../../shared/network/client-network-manager';
import { InputKey } from '../../shared/network/networked-state/networked-state';
import {
  IPlayerInput,
  PlayerNetworkedStateBundle,
  IPlayerState,
  playerStateModification,
} from '../../shared/network/networked-state/player-networked-state';
import { Destroyable } from '~/shared/entities/destroyable';

export class PlayerBroadcasterEntity
  implements NetworkBroadcastEntity<PlayerNetworkedStateBundle>
{
  public readonly inputKey = InputKey.PlayerState;

  private cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

  private playerInput: IPlayerInput = {
    left: false,
    right: false,
    up: false,
    down: false,
    tick: 0,
  };

  private state: IPlayerState = ((parentThis: PlayerBroadcasterEntity) => {
    return new (class {
      public get x() {
        return parentThis.playerEntity.x;
      }
      public set x(value) {
        parentThis.playerEntity.x = value;
      }
      public get y() {
        return parentThis.playerEntity.y;
      }
      public set y(value) {
        parentThis.playerEntity.y = value;
      }
      public tick = 0;
    })();
  })(this);

  constructor(
    private scene: Scene,
    private playerEntity: XYTransformable & Destroyable
  ) {
    this.cursorKeys = this.scene.input.keyboard?.createCursorKeys();
  }

  public getCurrentInput(currentTick: number): IPlayerInput {
    this.playerInput.left = this.cursorKeys?.left.isDown || false;
    this.playerInput.right = this.cursorKeys?.right.isDown || false;
    this.playerInput.up = this.cursorKeys?.up.isDown || false;
    this.playerInput.down = this.cursorKeys?.down.isDown || false;
    this.playerInput.tick = currentTick;

    return this.playerInput;
  }

  public destroy() {
    this.playerEntity.destroy();
  }

  public reconcileState(stateRef: IPlayerState) {
    void stateRef;
  }

  public update() {
    playerStateModification(this.playerInput, this.state);
  }
}
