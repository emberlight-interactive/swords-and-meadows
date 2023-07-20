import { Scene } from 'phaser';
import { PlayerEntity } from '../../core/player-entity/player-entity';
import { gameConfig } from '../../shared/game-config';
import { WandEntity } from '../../core/wand-entity/wand-entity';
import {
  PlayerBroadcasterEntity,
  PlayerInputHandler,
} from '../../core/player/player-broadcaster-entity';
import { FixedTickManager } from '../../shared/util/fixed-tick-manager';

export default class WizardTest extends Scene {
  private player!: PlayerBroadcasterEntity;

  constructor(private fixedTickManager = new FixedTickManager()) {
    super('WizardTest');
  }

  public preload() {
    PlayerEntity.preload(this.load);
    WandEntity.preload(this.load);
  }

  public async create() {
    const playerWand = new WandEntity(0, 0, this);
    this.player = new PlayerBroadcasterEntity(
      this,
      new PlayerEntity(400, 400, playerWand, this),
      playerWand,
      new PlayerInputHandler(this, playerWand, false)
    );
  }

  public update(time: number, delta: number): void {
    this.fixedTickManager.runTick(delta, this.fixedTick);
  }

  private fixedTick = () => {
    this.player.getCurrentInput(this.fixedTickManager.getTick());
    this.player.tick();
  };
}

new Phaser.Game({
  ...gameConfig,
  scene: WizardTest,
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
    },
  },
});
