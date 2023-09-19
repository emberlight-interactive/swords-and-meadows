import { System, system } from '@lastolivegames/becsy';
import { Queue } from '../../../shared/util/queue';
import { XYTransform } from '../../../shared/components/xy-transform';
import { ClientInfo } from '../../../shared/components/client-info';
import { MoveServerPlayers } from '../move-players/move-server-players';
import { HandleServerDisconnections } from './handle-server-disconnections';

@system(s => s.before(MoveServerPlayers).before(HandleServerDisconnections))
export class HandleServerConnections extends System {
  private newClientQueue!: Queue<{ sessionId: string }>;
  private entitlements = this.query(
    q => q.using(XYTransform).write.and.using(ClientInfo).write
  );

  public execute() {
    let newClient: { sessionId: string } | undefined;
    while ((newClient = this.newClientQueue.shift())) {
      this.createEntity(
        XYTransform,
        {
          x: Math.random() * 600,
          y: Math.random() * 600,
        },
        ClientInfo,
        {
          clientId: newClient.sessionId,
        }
      );
    }
  }
}
