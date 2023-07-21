import { Scene } from 'phaser';

export class FireballProjectile {
  public static preload(load: Phaser.Loader.LoaderPlugin) {
    load.atlas('fireball', 'assets/fireball.png', 'assets/fireball-atlas.json');
  }

  constructor(x: number, y: number, private scene: Scene) {
    this.scene.physics.add.sprite(x, y, 'fireball')
  }
}
