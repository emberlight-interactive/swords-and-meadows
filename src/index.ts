import { Scene } from 'phaser';
import { PlayerEntity } from './core/player-entity/player-entity';
import { GameState } from './shared/network/networked-state/networked-state';
import { ClientNetworkManager } from './shared/network/client-network-manager';
import { PlayerBroadcasterEntity } from './core/player/player-broadcaster-entity';
import { PlayerRecieverEntity } from './core/player/player-reciever-entity';
import {
  IPlayerState,
  PlayerState,
} from './shared/network/networked-state/player-networked-state';
import { gameConfig } from './shared/game-config';
import { WandEntity } from './core/wand-entity/wand-entity';

export default class Index extends Scene {
  private clientNetworkManager!: ClientNetworkManager<GameState>;
  private debugFPS!: Phaser.GameObjects.Text;

  constructor() {
    super('Index');
  }

  public preload() {
    PlayerEntity.preload(this.load);
    WandEntity.preload(this.load);
  }

  public async create() {
    this.debugFPS = this.add.text(4, 4, '', { color: '#ff0000' });

    this.clientNetworkManager = new ClientNetworkManager<GameState>();
    await this.clientNetworkManager.connect();

    this.clientNetworkManager.registerEntity<PlayerState>(
      this.clientNetworkManager.room.state.players,
      (stateRef: IPlayerState) => {
        const wand = new WandEntity(0, 0, this);
        return new PlayerBroadcasterEntity(
          this,
          new PlayerEntity(stateRef.x, stateRef.y, wand, this),
          wand
        );
      },
      (stateRef: IPlayerState) => {
        const wand = new WandEntity(0, 0, this);
        return new PlayerRecieverEntity(
          new PlayerEntity(stateRef.x, stateRef.y, wand, this),
          wand
        );
      },
      'player-entity'
    );
  }

  public update(time: number, delta: number): void {
    this.debugFPS.text = `Frame rate: ${this.game.loop.actualFps}`;
    if (this.clientNetworkManager.connectionStatus !== 'connected') {
      return;
    }

    this.clientNetworkManager.fixedTick(delta);
  }
}

new Phaser.Game({ ...gameConfig, scene: Index });
