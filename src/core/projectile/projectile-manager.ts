import { IProjectileState } from '../../shared/network/projectile';
import { NetworkedMap } from '../../shared/models/networked-map';
import { Destroyable } from '../../shared/models/destroyable';
import { ProjectileReciever } from './projectile-reciever';
import { ContextSynced } from '../../shared/models/synced';
import { XYTransformable } from '../../shared/models/x-y-transformable';
import { Rotatable } from '../../shared/models/rotatable';
import { ServerMessenger } from '../../shared/models/server-messenger';

export class ProjectileManager {
  private projectiles = new Map<string, ContextSynced & Destroyable>();

  constructor(
    projectileMap: NetworkedMap<IProjectileState>,
    /** @todo: add param for projectile type */
    projectileEntityFactory: (
      x: number,
      y: number,
      angle: number
    ) => XYTransformable & Rotatable & Destroyable,
    playerEntityMap: Map<string, XYTransformable>,
    serverMessenger: ServerMessenger
  ) {
    projectileMap.onAdd((state, key) => {
      this.projectiles.set(
        key,
        new ProjectileReciever(
          state,
          key,
          projectileEntityFactory(state.x, state.y, state.angle),
          playerEntityMap,
          serverMessenger
        )
      );
    });

    projectileMap.onRemove((_, key) => {
      const projectile = this.projectiles.get(key);
      projectile?.destroy();
      this.projectiles.delete(key);
    });
  }

  public tick(currTick: number) {
    for (const projectile of this.projectiles.values()) {
      projectile.tick(currTick);
    }
  }
}
