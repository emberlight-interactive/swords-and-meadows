import { Scene } from 'phaser';
import fireExplosionOneBase from '../../shared/assets/fire-explosion-1-base.png';
import fireExplosionOneBaseAtlas from '../../shared/assets/fire-explosion-1-base.json';
import fireExplosionOneTop from '../../shared/assets/fire-explosion-1-top.png';
import fireExplosionOneTopAtlas from '../../shared/assets/fire-explosion-1-top.json';
import { DefferedDestroyable } from '../../shared/models/destroyable';
import { ExplosionType } from '../../shared/network/explosion';

export class ExplosionEntity implements DefferedDestroyable {
  public static preload(load: Phaser.Loader.LoaderPlugin) {
    load.atlas(
      'fire-explosion-1-base',
      fireExplosionOneBase,
      fireExplosionOneBaseAtlas
    );

    load.atlas(
      'fire-explosion-1-top',
      fireExplosionOneTop,
      fireExplosionOneTopAtlas
    );
  }

  public static init(scene: Scene) {
    scene.anims.create({
      key: 'fire-explosion-1-base',
      frames: 'fire-explosion-1-base',
      frameRate: 18,
      repeat: 0,
    });

    scene.anims.create({
      key: 'fire-explosion-1-top',
      frames: 'fire-explosion-1-top',
      frameRate: 18,
      repeat: 0,
    });
  }

  private explosionComponents: Phaser.GameObjects.Sprite[] = [];

  constructor(
    private x: number,
    private y: number,
    explosionType: ExplosionType,
    private scene: Scene
  ) {
    if (explosionType === ExplosionType.FireExplosionOne) {
      this.playFireExplosionOne();
    }
  }

  public playFireExplosionOne() {
    const explosionBase = this.scene.add.sprite(
      this.x,
      this.y,
      'fire-explosion-1-base'
    );
    explosionBase.play('fire-explosion-1-base');
    this.explosionComponents.push(explosionBase);

    const explosionTop = this.scene.add.sprite(
      this.x,
      this.y - 50,
      'fire-explosion-1-top'
    );
    explosionTop.play('fire-explosion-1-top');
    this.explosionComponents.push(explosionTop);
  }

  private getLongestAnimationMilliseconds(): number {
    let longestDuration = 0;
    this.explosionComponents.forEach(sprite => {
      longestDuration =
        sprite.anims.duration > longestDuration
          ? sprite.anims.duration
          : longestDuration;
    });
    return longestDuration;
  }

  public deferDestroy() {
    setTimeout(() => {
      this.explosionComponents.forEach(sprite => sprite.destroy());
    }, this.getLongestAnimationMilliseconds());
  }
}
