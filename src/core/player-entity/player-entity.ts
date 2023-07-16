import { Scene } from 'phaser';
import { Preloadable } from '../../shared/preloadable';
import { XYTransformable } from '~/shared/entities/x-y-transformable';
import { Destroyable } from '~/shared/entities/destroyable';

export class PlayerEntity
  extends Preloadable
  implements XYTransformable, Destroyable
{
  private player: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;

  protected static assetsPreloaded = false;
  protected static preload = (load: Phaser.Loader.LoaderPlugin) => {
    load.image('player', 'assets/grey-wizard.png');
  };

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
    super();
    this.player = this.scene.physics.add.image(x, y, 'player');
  }

  public destroy(): void {
    this.player.destroy();
  }
}
