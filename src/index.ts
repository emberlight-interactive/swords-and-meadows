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

export default class Index extends Scene {
  private clientNetworkManager!: ClientNetworkManager<GameState>;
  private debugFPS!: Phaser.GameObjects.Text;

  constructor() {
    super('Index');
  }

  public preload() {
    this.load.image('monster', 'assets/sprite.png');
    PlayerEntity.preloadWithLoader(this.load);
  }

  public async create() {
    this.debugFPS = this.add.text(4, 4, '', { color: '#ff0000' });

    this.clientNetworkManager = new ClientNetworkManager<GameState>();
    await this.clientNetworkManager.connect();

    this.clientNetworkManager.registerEntity<PlayerState>(
      this.clientNetworkManager.room.state.players,
      (stateRef: IPlayerState) =>
        new PlayerBroadcasterEntity(
          this,
          new PlayerEntity(stateRef.x, stateRef.y, this)
        ),
      (stateRef: IPlayerState) =>
        new PlayerRecieverEntity(
          new PlayerEntity(stateRef.x, stateRef.y, this)
        ),
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
