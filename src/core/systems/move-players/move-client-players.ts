import { System, system } from '@lastolivegames/becsy';
import { XYTransform } from '../../../shared/components/xy-transform';
import { Sprite } from '../../../shared/components/sprite';
import { ClientInputSingleton } from '../../../shared/components/client-input-singleton';
import { ClientOwned } from '../../../shared/components/client-owned';
import { movePlayerRules } from './move-player-rules';
import { MoveOtherPlayers } from './move-other-players';
import { RecieveMutatedState } from '../network-state-sync/recieve-mutated-state';

@system(s => s.before(MoveOtherPlayers).before(RecieveMutatedState))
export class MoveClientPlayers extends System {
  private inputState = this.singleton.read(ClientInputSingleton);
  private clientPlayers = this.query(
    q =>
      q.current.with(ClientOwned).with(XYTransform).write.and.with(Sprite).write
  );

  private updateSprite(sprite: Sprite, x: number, y: number) {
    sprite.worldPosition.x = x;
    sprite.worldPosition.y = y;
  }

  public execute(): void {
    for (const entity of this.clientPlayers.current) {
      const pos = entity.write(XYTransform);
      movePlayerRules(this.inputState, pos);
      this.updateSprite(entity.write(Sprite), pos.x, pos.y);
    }
  }
}
