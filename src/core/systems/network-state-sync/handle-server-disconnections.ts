import { System, system } from '@lastolivegames/becsy';
import { Queue } from '../../../shared/util/queue';
import { XYTransform } from '../../../shared/components/xy-transform';
import { ClientInfo } from '../../../shared/components/client-info';
import { EntityKey } from '../../../shared/components/entity-key';
import { BroadcastMutatedState } from './broadcast-mutated-state';

@system(s => s.before(BroadcastMutatedState))
export class HandleServerDisconnections extends System {
  private disconnectedClientQueue!: Queue<{ sessionId: string }>;
  private playerEntities = this.query(q => {
    q.with(XYTransform, ClientInfo).current.write;
    q.using(EntityKey).write;
  });

  public execute() {
    let disconnectedClient: { sessionId: string } | undefined;
    while ((disconnectedClient = this.disconnectedClientQueue.shift())) {
      /** @todo: optimize */
      for (const entity of this.playerEntities.current) {
        if (!entity.alive) continue;
        const clientInfo = entity.read(ClientInfo);
        if (clientInfo.clientId === disconnectedClient.sessionId) {
          entity.delete();
          break;
        }
      }
    }
  }
}
