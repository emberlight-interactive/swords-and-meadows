export const gameConfig: Phaser.Types.Core.GameConfig = {
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
  antialias: false,
};
