import { IProjectileState } from '../../shared/network/projectile';
import { NetworkedMap } from '../../shared/models/networked-map';
import { Destroyable } from '../../shared/models/destroyable';
import { ProjectileReciever } from './projectile-reciever';
import { Synced } from '../../shared/models/synced';
import { XYTransformable } from '../../shared/models/x-y-transformable';
import { Rotatable } from '../../shared/models/rotatable';

export class ProjectileManager {
  private projectiles = new Map<string, Synced & Destroyable>();

  constructor(
    projectileMap: NetworkedMap<IProjectileState>,
    /** @todo: add param for projectile type */
    projectileEntityFactory: (
      x: number,
      y: number,
      angle: number
    ) => XYTransformable & Rotatable & Destroyable
  ) {
    projectileMap.onAdd((state, key) => {
      this.projectiles.set(
        key,
        new ProjectileReciever(
          state,
          projectileEntityFactory(state.x, state.y, state.angle)
        )
      );
    });

    projectileMap.onRemove((_, key) => {
      const projectile = this.projectiles.get(key);
      projectile?.destroy();
      this.projectiles.delete(key);
    });
  }

  public tick() {
    for (const projectile of this.projectiles.values()) {
      projectile.tick();
    }
  }
}
