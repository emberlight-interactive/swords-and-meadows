import { Scene } from 'phaser';
import { PlayerController } from './_core/player-controller/player-controller';

export default class Index extends Scene {
  private player!: PlayerController;

  constructor() {
    super('Index');
  }

  preload() {
    this.load.image('monster', 'assets/sprite.png');
    PlayerController.preloadWithLoader(this.load);
  }

  create() {
    const monster = this.physics.add.image(200, 70, 'monster');
    monster.body.setCollideWorldBounds(true);
    this.player = new PlayerController(400, 70, this);
    this.physics.collide(this.player.getImageWithDynamicBody(), monster);
    this.cameras.main.startFollow(this.player.getImageWithDynamicBody());
  }

  update() {
    this.player.update();
  }
}

new Phaser.Game({
  width: 1024,
  height: 576,
  type: Phaser.WEBGL,
  backgroundColor: '#2f2f2f',
  physics: {
    default: 'arcade',
    arcade: {
      debug: process.env.NODE_ENV === 'development',
    },
  },
  scale: {
    mode: Phaser.Scale.ScaleModes.FIT,
    autoCenter: Phaser.Scale.Center.CENTER_BOTH,
  },
  scene: Index,
  antialias: false,
});
