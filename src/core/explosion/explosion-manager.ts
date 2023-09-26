import { NetworkedMap } from '../../shared/models/networked-map';
import { DefferedDestroyable } from '../../shared/models/destroyable';
import { ExplosionType, IExplosionState } from '../../shared/network/explosion';

export class ExplosionManager {
  private explosions = new Map<string, DefferedDestroyable>();

  constructor(
    explosionMap: NetworkedMap<IExplosionState>,
    explosionEntityFactory: (
      x: number,
      y: number,
      explosionType: ExplosionType
    ) => DefferedDestroyable
  ) {
    explosionMap.onAdd((state, key) => {
      this.explosions.set(
        key,
        explosionEntityFactory(state.x, state.y, state.explosionType)
      );
    });

    explosionMap.onRemove((_, key) => {
      const explosion = this.explosions.get(key);
      explosion?.deferDestroy();
      this.explosions.delete(key);
    });
  }
}
