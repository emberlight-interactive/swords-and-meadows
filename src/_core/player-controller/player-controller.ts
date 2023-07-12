import { Scene } from 'phaser';
import { Preloadable } from '../../_shared/preloadable';

export class PlayerController extends Preloadable {
  private player: Phaser.Types.Physics.Arcade.ImageWithDynamicBody;
  private keyW?: Phaser.Input.Keyboard.Key;
  private keyA?: Phaser.Input.Keyboard.Key;
  private keyS?: Phaser.Input.Keyboard.Key;
  private keyD?: Phaser.Input.Keyboard.Key;

  protected static assetsPreloaded = false;
  protected static preload = (load: Phaser.Loader.LoaderPlugin) => {
    load.image('player', 'assets/grey-wizard.png');
  };

  constructor(
    x: number,
    y: number,
    private scene: Scene
  ) {
    super();
    this.keyW = this.scene.input?.keyboard?.addKey('W');
    this.keyA = this.scene.input?.keyboard?.addKey('A');
    this.keyS = this.scene.input?.keyboard?.addKey('S');
    this.keyD = this.scene.input?.keyboard?.addKey('D');
    this.player = this.scene.physics.add.image(x, y, 'player');
  }

  update() {
    this.player.body.setVelocity(0);
    if (this.keyW?.isDown) {
      this.player.body.velocity.y = -210;
    }
    if (this.keyA?.isDown) {
      this.player.body.velocity.x = -210;
    }
    if (this.keyS?.isDown) {
      this.player.body.velocity.y = 210;
    }
    if (this.keyD?.isDown) {
      this.player.body.velocity.x = 210;
    }
  }

  getImageWithDynamicBody(): Phaser.Types.Physics.Arcade.ImageWithDynamicBody {
    return this.player;
  }
}
