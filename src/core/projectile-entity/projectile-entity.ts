import { Scene } from 'phaser';
import { Rotatable } from '../../shared/models/rotatable';
import { XYTransformable } from '../../shared/models/x-y-transformable';
import { Destroyable } from '../../shared/models/destroyable';
import forceProjectile from '../../shared/assets/force-projectile.png';
import forceProjectileAtlas from '../../shared/assets/force-projectile.json';
import fireProjectileExplosiveOne from '../../shared/assets/fire-projectile-explosive-1.png';
import fireProjectileExplosiveOneAtlas from '../../shared/assets/fire-projectile-explosive-1.json';

export class ProjectileEntity
  implements XYTransformable, Rotatable, Destroyable
{
  public static preload(load: Phaser.Loader.LoaderPlugin) {
    load.atlas('force-projectile', forceProjectile, forceProjectileAtlas);

    load.atlas(
      'fire-projectile-explosive-1',
      fireProjectileExplosiveOne,
      fireProjectileExplosiveOneAtlas
    );
  }

  public static init(scene: Scene) {
    scene.anims.create({
      key: 'force-projectile',
      frames: 'force-projectile',
      frameRate: 14,
      repeat: -1,
    });

    scene.anims.create({
      key: 'fire-projectile-explosive-1',
      frames: 'fire-projectile-explosive-1',
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
    this.sprite = this.scene.add.sprite(x, y, 'fire-projectile-explosive-1');
    this.sprite.setOrigin(0.75, 0.5);
    this.sprite.play('fire-projectile-explosive-1');
    this.angle = angle;
  }

  public destroy() {
    this.sprite.destroy();
  }
}
