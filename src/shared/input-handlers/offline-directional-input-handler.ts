import { Scene } from 'phaser';
import { InputHandler } from '../entities/input-handler';
import { IPlayerInput } from '../network/networked-state/player-networked-state';
import { ObjectCollectionBuffer } from '../util/object-collection-buffer';

export class OfflineDirectionalInputHandler
  implements InputHandler<IPlayerInput>
{
  private cursorKeys!: Phaser.Types.Input.Keyboard.CursorKeys | undefined;

  private playerInput: IPlayerInput = {
    left: false,
    right: false,
    up: false,
    down: false,
    tick: 0,
  };

  private playerInputBuffer = new ObjectCollectionBuffer<IPlayerInput>();

  constructor(private scene: Scene) {
    this.cursorKeys = this.scene.input.keyboard?.createCursorKeys();
  }

  public getBuffer() {
    return this.playerInputBuffer;
  }

  public updateCurrentInput(currentTick: number): IPlayerInput {
    this.playerInput.left = this.cursorKeys?.left.isDown || false;
    this.playerInput.right = this.cursorKeys?.right.isDown || false;
    this.playerInput.up = this.cursorKeys?.up.isDown || false;
    this.playerInput.down = this.cursorKeys?.down.isDown || false;
    this.playerInput.tick = currentTick;

    return this.playerInput;
  }

  public getCurrentInput(): IPlayerInput {
    return this.playerInput;
  }
}
