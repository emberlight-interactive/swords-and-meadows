import { Scene } from 'phaser';
import { PlayerEntity } from './core/player-entity/player-entity';
import { gameConfig } from './shared/game-config';
import { WandEntity } from './core/wand-entity/wand-entity';
import { World } from '@lastolivegames/becsy';
import { XYTransform } from './shared/components/xy-transform';
import { Sprite } from './shared/components/sprite';
import { MoveClientPlayers } from './core/systems/move-players/move-client-players';
import { InputManager } from './core/systems/input-manager/input-manager';
import { ClientOwned } from './shared/components/client-owned';
import { XYDeltas } from './shared/components/xy-deltas';
import { MoveOtherPlayers } from './core/systems/move-players/move-other-players';
import { BroadcastClientInput } from './core/systems/input-manager/broadcast-client-input';
import { RecieveMutatedState } from './core/systems/network-state-sync/recieve-mutated-state';
import { Client, Room } from 'colyseus.js';
import type { NetworkedState } from './shared/network/networked-state';
import { env } from './shared/env/env';
import { FixedTickManager } from './shared/util/fixed-tick-manager';

export default class Index extends Scene {
  private room!: Room<NetworkedState>;
  private debugFPS!: Phaser.GameObjects.Text;
  private ecsWorld!: World;
  private fixedTickManager = new FixedTickManager();
  private ready = false;

  constructor() {
    super('Index');
  }

  public preload() {
    PlayerEntity.preload(this.load);
    WandEntity.preload(this.load);
  }

  public async create() {
    this.debugFPS = this.add.text(4, 4, '', { color: '#ff0000' });

    console.log('Trying to connect with the server...');
    const client = new Client({
      secure: env.serverSSL,
      hostname: env.serverHostname,
      port: env.serverPort,
    });

    try {
      this.room = await client.joinOrCreate(env.serverRoomName, {});
    } catch (e) {
      console.error('Failed to connect');
    }

    this.ecsWorld = await World.create({
      defs: [
        InputManager,
        {
          keys: {
            W: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.W),
            A: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
            S: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
            D: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
          },
          pointer: this.game.input.activePointer,
        },
        MoveClientPlayers,
        MoveOtherPlayers,
        BroadcastClientInput,
        {
          serverBroadcaster: this.room,
        },
        RecieveMutatedState,
        {
          networkedXYTransformMap: this.room.state.xyTransforms,
        },
      ],
    });
  }

  public update(time: number, delta: number): void {
    this.debugFPS.text = `Frame rate: ${this.game.loop.actualFps}`;

    if (this.room && this.ecsWorld) {
      this.fixedTickManager.runTick(delta, () => this.ecsWorld.execute());
    }
  }
}

new Phaser.Game({ ...gameConfig, scene: Index });
