import { Scene } from 'phaser';
import { XYTransformable } from '~/shared/models/x-y-transformable';
import { Destroyable } from '~/shared/models/destroyable';
import greyWizard from '../../shared/assets/grey-wizard.png';
import { playerProjectileColliderDimensions } from '../../shared/network/player';

export class PlayerEntity implements XYTransformable, Destroyable {
  private player: Phaser.GameObjects.Sprite;
  private graphic: Phaser.GameObjects.Graphics;
  private anchorOneOffset = { x: -13, y: 2 };

  public static preload(load: Phaser.Loader.LoaderPlugin) {
    load.image('player', greyWizard);
  }

  public get x() {
    return this.player.x;
  }

  public set x(value) {
    this.player.x = value;
    this.graphic.x = value;
    this.updateToolPosition();
  }

  public get y() {
    return this.player.y;
  }

  public set y(value) {
    this.player.y = value;
    this.graphic.y = value;
    this.updateToolPosition();
  }

  constructor(
    x: number,
    y: number,
    private tool: XYTransformable,
    private scene: Scene
  ) {
    this.player = this.scene.add.sprite(x, y, 'player');
    this.graphic = this.scene.add.graphics({ fillStyle: { color: 0xff0000 } });
    const rectangle = new Phaser.Geom.Rectangle(
      -playerProjectileColliderDimensions.w / 2,
      -playerProjectileColliderDimensions.h / 2,
      playerProjectileColliderDimensions.w,
      playerProjectileColliderDimensions.h
    );
    this.graphic.fillRectShape(rectangle);
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
