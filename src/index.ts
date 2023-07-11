import { Scene } from 'phaser';

export default class Demo extends Scene
{
    constructor () {
        super('demo');
    }

    preload () {
        this.load.image('logo', 'assets/sprite.png');
    }

    create () {
        const logo = this.add.image(400, 70, 'logo');

        this.tweens.add({
            targets: logo,
            y: 350,
            duration: 1500,
            ease: 'Sine.inOut',
            yoyo: true,
            repeat: -1
        })
    }
}

const config = {
  width: 1920,
  height: 1080,
  type: Phaser.WEBGL,
  backgroundColor: "#2f2f2f",
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
  scale: {
    mode: Phaser.Scale.ScaleModes.FIT,
    autoCenter: Phaser.Scale.Center.CENTER_BOTH
  },
    scene: Demo
};
alert("Meow5");
const game = new Phaser.Game(config);
