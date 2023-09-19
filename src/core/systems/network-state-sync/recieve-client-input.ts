import { System, system } from '@lastolivegames/becsy';
import { ClientInput } from '../../../shared/components/client-input-singleton';
import { InputCollectionSingleton } from '../../../shared/components/input-collection-singleton';

const clientInputMap = new Map<string, ClientInput>();

@system
export class RecieveClientInput extends System {
  private sharedInputCollection = this.singleton.write(
    InputCollectionSingleton,
    { value: clientInputMap }
  );
  private inputCollection = new Map<string, ClientInput>();
  private room!: {
    onMessage: (
      key: number,
      callback: (client: { sessionId: string }, input: ClientInput) => void
    ) => void;
  };

  public execute() {
    this.sharedInputCollection.value.clear();
    this.inputCollection.forEach((input, clientId) => {
      this.sharedInputCollection.value.set(clientId, input);
    });
    this.inputCollection.clear();
  }

  public initialize(): void {
    this.room.onMessage(0, (client, input) => {
      this.inputCollection.set(client.sessionId, input);
    });
  }
}
