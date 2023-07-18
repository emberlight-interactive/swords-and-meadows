import { Scene } from 'phaser';
import { XYTransformable } from '~/shared/entities/x-y-transformable';
import { Destroyable } from '~/shared/entities/destroyable';

export class PlayerEntity implements XYTransformable, Destroyable {
  private player: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

  public static preload(load: Phaser.Loader.LoaderPlugin) {
    load.image('player', 'assets/grey-wizard.png');
  }

  public get x() {
    return this.player.x;
  }

  public set x(value) {
    this.player.x = value;
  }

  public get y() {
    return this.player.y;
  }

  public set y(value) {
    this.player.y = value;
  }

  constructor(
    x: number,
    y: number,
    private scene: Scene
  ) {
    this.player = this.scene.physics.add.image(x, y, 'player');
  }

  public destroy(): void {
    this.player.destroy();
  }
}
