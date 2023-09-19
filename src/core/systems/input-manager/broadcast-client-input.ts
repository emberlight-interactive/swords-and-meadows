import { System, system } from '@lastolivegames/becsy';
import {
  ClientInputSingleton,
  ClientInput,
} from '../../../shared/components/client-input-singleton';
import { TickSingleton } from '../../../shared/components/tick-singleton';
import { SendServerMessage } from '../../../shared/models/send-server-message';

export interface BroadcastableInput {
  input: ClientInput;
  tick: number;
}

@system
export class BroadcastClientInput extends System {
  private inputState = this.singleton.read(ClientInputSingleton);
  private tickState = this.singleton.read(TickSingleton);
  private serverBroadcaster!: SendServerMessage;
  private broadcastableInput: BroadcastableInput = {
    input: {
      down: false,
      up: false,
      left: false,
      right: false,
      mouseWorldX: 0,
      mouseWorldY: 0,
    },
    tick: 0,
  };

  public execute(): void {
    this.broadcastableInput.input = this.inputState;
    this.broadcastableInput.tick = this.tickState.tick;
    this.serverBroadcaster.send(0, this.broadcastableInput);
  }
}
