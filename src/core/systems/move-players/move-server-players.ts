import { System, system } from '@lastolivegames/becsy';
import { XYTransform } from '../../../shared/components/xy-transform';
import { movePlayerRules } from './move-player-rules';
import { InputCollectionSingleton } from '../../../shared/components/input-collection-singleton';
import { ClientInfo } from '../../../shared/components/client-info';
import { env } from '../../../shared/env/env';
import { HandleServerDisconnections } from '../network-state-sync/handle-server-disconnections';

@system(s => s.before(HandleServerDisconnections))
export class MoveServerPlayers extends System {
  private clientTicksPerServerTick =
    env.clientTicksPerSecond / env.serverTicksPerSecond;
  private inputCollection = this.singleton.read(InputCollectionSingleton);
  private playerEntities = this.query(
    q => q.current.with(ClientInfo).and.with(XYTransform).write
  );

  public execute(): void {
    for (const entity of this.playerEntities.current) {
      // add input process limit
      const pos = entity.write(XYTransform);
      const info = entity.read(ClientInfo);
      const clientInput = this.inputCollection.value.get(info.clientId);
      if (clientInput) movePlayerRules(clientInput, pos);
    }
  }
}
