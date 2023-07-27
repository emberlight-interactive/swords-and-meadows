import { Scene } from 'phaser';
import { XYTransformable } from '../../shared/entities/x-y-transformable';
import { Rotatable } from '../../shared/entities/rotatable';
import { Destroyable } from '../../shared/entities/destroyable';
import staff from '../../shared/assets/staff.png';

export class WandEntity implements XYTransformable, Rotatable, Destroyable {
  private container: Phaser.GameObjects.Container;
  private staffSprite: Phaser.GameObjects.Sprite;

  public static preload(load: Phaser.Loader.LoaderPlugin) {
    load.image('staff', staff);
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

  public set angle(value) {
    this.staffSprite.setAngle(value + 90);
  }

  public get angle(): number {
    return this.staffSprite.angle - 90;
  }

  constructor(
    x: number,
    y: number,
    private scene: Scene
  ) {
    this.staffSprite = this.scene.add.sprite(0, 0, 'staff');
    this.container = this.scene.add.container(0, 0, this.staffSprite);
    this.container.depth = 10;

    this.x = x;
    this.y = y;
  }

  public destroy(): void {
    this.container.destroy();
  }
}
