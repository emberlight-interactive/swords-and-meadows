import { NetworkedMap } from '../../shared/models/networked-map';
import { PositionQueryable } from '../../shared/models/position-queryable';
import { IPlayerState } from '../../shared/network/player';
import { kdTree } from 'kd-tree-javascript';

/** @deprecated Is not a dynamic index, kdtree does not support rebuilding */
export class PlayerPositionIndex implements PositionQueryable<IPlayerState> {
  private kdTree = new kdTree<IPlayerState>(
    [],
    (a, b) => {
      return Math.pow(a.x - b.x, 2) + Math.pow(a.y - b.y, 2);
    },
    ['x', 'y']
  );

  constructor(players: NetworkedMap<IPlayerState>) {
    players.onAdd(state => {
      this.kdTree.insert(state);
    });

    players.onRemove(state => {
      this.kdTree.remove(state);
    });
  }

  public getNearby(
    point: { x: number; y: number },
    count: number,
    maxDistance: number
  ): [IPlayerState, number][] {
    return this.kdTree.nearest(<IPlayerState>point, count, maxDistance);
  }
}
