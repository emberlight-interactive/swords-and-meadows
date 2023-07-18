import { Scene } from 'phaser';
import { PlayerEntity } from '../../core/player-entity/player-entity';
import { gameConfig } from '../../shared/game-config';

export default class WizardTest extends Scene {
  constructor() {
    super('WizardTest');
  }

  public preload() {
    PlayerEntity.preload(this.load);
  }

  public async create() {
    new PlayerEntity(400, 400, this);
  }
}

new Phaser.Game({ ...gameConfig, scene: WizardTest });
