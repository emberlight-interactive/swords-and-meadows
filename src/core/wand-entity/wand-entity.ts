import { Scene } from 'phaser';
import { XYTransformable } from '../../shared/entities/x-y-transformable';

export class WandEntity implements XYTransformable {
  private container: Phaser.GameObjects.Container;
  private staffSprite: Phaser.GameObjects.Sprite;

  public static preload(load: Phaser.Loader.LoaderPlugin) {
    load.image('staff', 'assets/staff.png');
  }

  public get x() {
    return this.container.x;
  }

  public set x(value) {
    this.container.x = value;
  }

  public get y() {
    return this.container.y;
  }

  public set y(value) {
    this.container.y = value;
  }

  constructor(
    x: number,
    y: number,
    private scene: Scene
  ) {
    this.staffSprite = this.scene.add.sprite(0, 0, 'staff');
    this.container = this.scene.add.container(0, 0, this.staffSprite);

    this.x = x;
    this.y = y;
  }
}
