import { Scene } from 'phaser';
import {
  IProjectileSpawnInput,
  ProjectileType,
} from '../../shared/network/projectile';
import { ServerMessenger } from '../../shared/models/server-messenger';

export class ProjectileSpawnerBroadcaster {
  private clickEvent: 'left' | 'right' | 'none' = 'none';
  private mouseWorldX = 0;
  private mouseWorldY = 0;

  constructor(
    private scene: Scene,
    private serverMessenger: ServerMessenger
  ) {
    this.scene.input.on('pointerdown', (pointer: Phaser.Input.Pointer) => {
      if (pointer.leftButtonDown()) {
        this.clickEvent = 'left';
      } else if (pointer.rightButtonDown()) {
        this.clickEvent = 'right';
        this.mouseWorldX = this.scene.game.input.activePointer.worldX;
        this.mouseWorldY = this.scene.game.input.activePointer.worldY;
      }
    });
  }

  public tick(currTick: number) {
    if (this.clickEvent === 'left') {
      this.serverMessenger.send<IProjectileSpawnInput>(1, {
        type: ProjectileType.Direct,
        clientTick: currTick,
      });
    } else if (this.clickEvent === 'right') {
      this.serverMessenger.send<IProjectileSpawnInput>(1, {
        type: ProjectileType.Radius,
        desinationWorldX: this.mouseWorldX,
        desinationWorldY: this.mouseWorldY,
        clientTick: currTick,
      });
    }

    this.clickEvent = 'none';
  }
}
