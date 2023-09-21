import { Scene } from 'phaser';
import { IProjectileSpawnInput } from '../../shared/network/projectile';
import { ServerMessenger } from '../../shared/models/server-messenger';

export class ProjectileSpawnerBroadcaster {
  private clickEvent = false;

  constructor(
    private scene: Scene,
    private serverMessenger: ServerMessenger
  ) {
    this.scene.input.on('pointerdown', () => (this.clickEvent = true));
  }

  public tick(currTick: number) {
    if (this.clickEvent) {
      this.serverMessenger.send(1, <IProjectileSpawnInput>{
        spawn: true,
        clientTick: currTick,
      });
    }

    this.clickEvent = false;
  }
}
