import { Scene } from 'phaser';
import { XYTransformable } from '../../shared/models/x-y-transformable';
import {
  IPlayerInput,
  IPlayerState,
  playerStateModification,
} from '../../shared/network/player';
import { Destroyable } from '../../shared/models/destroyable';
import { ObjectQueue } from '../../shared/util/object-queue';
import { InputHandler } from '../../shared/models/input-handler';
import { Rotatable } from '../../shared/models/rotatable';
import { HealthTrackable } from '../../shared/models/health-trackable';

type Key = Phaser.Input.Keyboard.Key;

export class PlayerInputHandler implements InputHandler<IPlayerInput> {
  private keys!: { W: Key; A: Key; S: Key; D: Key };

  private playerInput: IPlayerInput = {
    left: false,
    right: false,
    up: false,
    down: false,
    clientTick: 0,
    relativeMouseAngle: 0,
  };

  private playerInputBuffer = new ObjectQueue<IPlayerInput>();

  constructor(
    private scene: Scene,
    private relativeMouseTarget: XYTransformable,
    private keepInputHistory = true
  ) {
    this.keys = {
      W: this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
      A: this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      S: this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      D: this.scene.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
    };
  }

  public getBuffer() {
    return this.playerInputBuffer;
  }

  public updateCurrentInput(currentTick: number): IPlayerInput {
    this.playerInput.left = this.keys.A.isDown;
    this.playerInput.right = this.keys.D.isDown;
    this.playerInput.up = this.keys.W.isDown;
    this.playerInput.down = this.keys.S.isDown;

    const dx =
      this.scene.game.input.activePointer.worldX - this.relativeMouseTarget.x;
    const dy =
      this.scene.game.input.activePointer.worldY - this.relativeMouseTarget.y;

    this.playerInput.relativeMouseAngle =
      (360 / (2 * Math.PI)) * Math.atan2(dy, dx);

    this.playerInput.clientTick = currentTick;

    if (this.keepInputHistory) this.playerInputBuffer.add(this.playerInput);

    return this.playerInput;
  }

  public getCurrentInput(): IPlayerInput {
    return this.playerInput;
  }
}

export class PlayerBroadcasterEntity {
  private playerInputHandler: InputHandler<IPlayerInput>;

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
      public set health(value) {
        parentThis.playerEntity.health = value;
      }
      public get health() {
        return parentThis.playerEntity.health;
      }
      public clientTick = 0;
      public _relativeMouseAngle = 0;
      public set relativeMouseAngle(value: number) {
        this._relativeMouseAngle = value;
        parentThis.playerWand.angle = value;
      }
      public get relativeMouseAngle() {
        return this._relativeMouseAngle;
      }
    })();
  })(this);

  constructor(
    private scene: Scene,
    private playerEntity: XYTransformable & Destroyable & HealthTrackable,
    private playerWand: XYTransformable & Rotatable & Destroyable,
    playerInputHandler?: InputHandler<IPlayerInput>
  ) {
    this.playerInputHandler =
      playerInputHandler || new PlayerInputHandler(this.scene, this.playerWand);
  }

  public getCurrentInput(currentTick: number): IPlayerInput {
    this.playerInputHandler.updateCurrentInput(currentTick);
    return this.playerInputHandler.getCurrentInput();
  }

  public destroy() {
    this.playerEntity.destroy();
    this.playerWand.destroy();
  }

  public reconcileState(stateRef: IPlayerState) {
    let historicalInput: IPlayerInput | undefined;

    this.state.health = stateRef.health;

    while ((historicalInput = this.playerInputHandler.getBuffer().shift())) {
      if (stateRef.clientTick === historicalInput.clientTick) {
        Object.assign(this.state, stateRef);
        for (const v of this.playerInputHandler.getBuffer().iterable()) {
          playerStateModification(v, this.state);
        }
        break;
      }
    }
  }

  public tick() {
    playerStateModification(
      this.playerInputHandler.getCurrentInput(),
      this.state
    );
  }
}
