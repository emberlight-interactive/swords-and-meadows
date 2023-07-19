import { Scene } from 'phaser';
import { PlayerEntity } from '../../core/player-entity/player-entity';
import { gameConfig } from '../../shared/game-config';
import { WandEntity } from '../../core/wand-entity/wand-entity';
import { PlayerBroadcasterEntity } from '../../core/player/player-broadcaster-entity';
import { FixedTickManager } from '../../shared/util/fixed-tick-manager';
import { OfflineDirectionalInputHandler } from '../../shared/input-handlers/offline-directional-input-handler';

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
    this.player = new PlayerBroadcasterEntity(
      this,
      new PlayerEntity(400, 400, this),
      new WandEntity(0, 0, this),
      new OfflineDirectionalInputHandler(this)
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
