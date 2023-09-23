import { Scene } from 'phaser';
import { XYTransformable } from '~/shared/models/x-y-transformable';
import { Destroyable } from '~/shared/models/destroyable';
import greyWizard from '../../shared/assets/grey-wizard.png';

export class PlayerEntity implements XYTransformable, Destroyable {
  private player: Phaser.GameObjects.Sprite;
  private anchorOneOffset = { x: -13, y: 2 };

  public static preload(load: Phaser.Loader.LoaderPlugin) {
    load.image('player', greyWizard);
  }

  public get x() {
    return this.player.x;
  }

  public set x(value) {
    this.player.x = value;
    this.updateToolPosition();
  }

  public get y() {
    return this.player.y;
  }

  public set y(value) {
    this.player.y = value;
    this.updateToolPosition();
  }

  constructor(
    x: number,
    y: number,
    private tool: XYTransformable,
    private scene: Scene
  ) {
    this.player = this.scene.add.sprite(x, y, 'player');
    this.updateToolPosition();
  }

  private updateToolPosition() {
    this.tool.x = this.x + this.anchorOneOffset.x;
    this.tool.y = this.y + this.anchorOneOffset.y;
  }

  public destroy(): void {
    this.player.destroy();
  }
}
