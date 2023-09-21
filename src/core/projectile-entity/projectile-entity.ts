import { Scene } from 'phaser';
import { Rotatable } from '../../shared/models/rotatable';
import { XYTransformable } from '../../shared/models/x-y-transformable';
import forceProjectile from '../../shared/assets/force-projectile.png';
import forceProjectileAtlas from '../../shared/assets/force-projectile.json';
import { Destroyable } from '../../shared/models/destroyable';

export class ProjectileEntity
  implements XYTransformable, Rotatable, Destroyable
{
  public static preload(load: Phaser.Loader.LoaderPlugin) {
    load.atlas('force-projectile', forceProjectile, forceProjectileAtlas);
  }

  public static init(scene: Scene) {
    scene.anims.create({
      key: 'force-projectile',
      frames: 'force-projectile',
      frameRate: 14,
      repeat: -1,
    });
  }

  private sprite: Phaser.GameObjects.Sprite;

  public get x() {
    return this.sprite.x;
  }

  public set x(value) {
    this.sprite.x = value;
  }

  public get y() {
    return this.sprite.y;
  }

  public set y(value) {
    this.sprite.y = value;
  }

  public set angle(value) {
    this.sprite.angle = value;
  }

  public get angle() {
    return this.sprite.angle;
  }

  constructor(
    x: number,
    y: number,
    angle: number,
    private scene: Scene
  ) {
    this.sprite = this.scene.add.sprite(x, y, 'force-projectile');
    this.sprite.play('force-projectile');
    this.angle = angle;
  }

  public destroy() {
    this.sprite.destroy();
  }
}
