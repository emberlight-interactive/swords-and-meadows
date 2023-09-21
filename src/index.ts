import { Scene } from 'phaser';
import { PlayerEntity } from './core/player-entity/player-entity';
import { gameConfig } from './shared/game-config';
import { WandEntity } from './core/wand-entity/wand-entity';
import { Client, Room } from 'colyseus.js';
import { env } from './shared/env/env';
import { FixedTickManager } from './shared/util/fixed-tick-manager';
import { PlayerManager } from './core/player/player-manager';
import { XYTransformable } from './shared/models/x-y-transformable';
import { ProjectileSpawnerBroadcaster } from './core/projectile/projectile-spawner-broadcaster';
import { ProjectileManager } from './core/projectile/projectile-manager';
import { ProjectileEntity } from './core/projectile-entity/projectile-entity';
import { INetworkedState } from './shared/network/networked-state';

export default class Index extends Scene {
  private fixedTickCallback: Function;
  private connectionStatus: 'connected' | 'disconnected' | 'connecting' =
    'disconnected';

  private debugFPS!: Phaser.GameObjects.Text;

  private room?: Room<INetworkedState>;
  private playerManager!: PlayerManager;
  private projectileManager!: ProjectileManager;
  private projectileSpawnerBroadcaster!: ProjectileSpawnerBroadcaster;

  constructor(private fixedTickManager = new FixedTickManager()) {
    super('Index');
    this.fixedTickCallback = () => this.tick();
  }

  public preload() {
    PlayerEntity.preload(this.load);
    WandEntity.preload(this.load);
    ProjectileEntity.preload(this.load);
  }

  public async connect() {
    console.log('Trying to connect with the server...');
    this.connectionStatus = 'connecting';
    const client = new Client({
      secure: env.serverSSL,
      hostname: env.serverHostname,
      port: env.serverPort,
    });

    try {
      this.room = await client.joinOrCreate(env.serverRoomName, {});
      this.connectionStatus = 'connected';
    } catch (e) {
      console.error('Failed to connect');
      this.connectionStatus = 'disconnected';
    }
  }

  public async create() {
    this.debugFPS = this.add.text(4, 4, '', { color: '#ff0000' });
    await this.connect();

    if (this.room) {
      ProjectileEntity.init(this);

      this.playerManager = new PlayerManager(
        this,
        this.room.sessionId,
        this.room.state.players,
        this.room,
        () => new WandEntity(0, 0, this),
        (x: number, y: number, tool: XYTransformable) =>
          new PlayerEntity(x, y, tool, this)
      );

      this.projectileSpawnerBroadcaster = new ProjectileSpawnerBroadcaster(
        this,
        this.room
      );

      this.projectileManager = new ProjectileManager(
        this.room.state.projectiles,
        (x: number, y: number, angle: number) =>
          new ProjectileEntity(x, y, angle, this)
      );
    }
  }

  public update(time: number, delta: number): void {
    this.debugFPS.text = `Frame rate: ${this.game.loop.actualFps}`;
    if (this.connectionStatus !== 'connected') {
      return;
    }

    this.fixedTickManager.runTick(delta, this.fixedTickCallback);
  }

  private tick() {
    this.playerManager.tick(this.fixedTickManager.getTick());
    this.projectileSpawnerBroadcaster.tick(this.fixedTickManager.getTick());
    this.projectileManager.tick();
  }
}

new Phaser.Game({ ...gameConfig, scene: Index });
