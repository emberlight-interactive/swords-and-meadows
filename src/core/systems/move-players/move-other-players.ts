import { System, system } from '@lastolivegames/becsy';
import { XYTransform } from '../../../shared/components/xy-transform';
import { Sprite } from '../../../shared/components/sprite';
import { env } from '../../../shared/env/env';
import { XYDeltas } from '../../../shared/components/xy-deltas';
import { RecieveMutatedState } from '../network-state-sync/recieve-mutated-state';

@system(s => s.before(RecieveMutatedState))
export class MoveOtherPlayers extends System {
  private otherPlayers = this.query(
    q =>
      q.current.with(XYTransform).write.and.with(Sprite).write.with(XYDeltas)
        .write
  );

  private clientTicksPerServerTicks =
    env.clientTicksPerSecond / env.serverTicksPerSecond;

  private updateSprite(sprite: Sprite, x: number, y: number) {
    sprite.worldPosition.x = x;
    sprite.worldPosition.y = y;
  }

  public execute(): void {
    for (const entity of this.otherPlayers.current) {
      const pos = entity.write(XYTransform);
      const deltas = entity.write(XYDeltas);

      // wtf did I just write lol
      if (deltas.appliedDeltas === this.clientTicksPerServerTicks) {
        if (pos.x !== deltas.previousX) {
          deltas.deltaX =
            (deltas.previousX - pos.x) / this.clientTicksPerServerTicks;
          deltas.previousX = pos.x;
          deltas.appliedDeltas = 0;
        }

        if (pos.y !== deltas.previousY) {
          deltas.deltaY =
            (deltas.previousY - pos.y) / this.clientTicksPerServerTicks;
          deltas.previousY = pos.y;
          deltas.appliedDeltas = 0;
        }
      } else if (
        deltas.appliedDeltas !== this.clientTicksPerServerTicks &&
        (deltas.deltaX !== 0 || deltas.deltaY !== 0)
      ) {
        pos.x -= deltas.deltaX;
        pos.y -= deltas.deltaY;
      }

      this.updateSprite(entity.write(Sprite), pos.x, pos.y);
    }
  }
}
