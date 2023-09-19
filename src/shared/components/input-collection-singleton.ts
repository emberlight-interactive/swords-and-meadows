import { component, field, Type } from '@lastolivegames/becsy';
import { ClientInput } from './client-input-singleton';

export interface RecievedClientInput {
  input: ClientInput;
  client: string;
}

@component
export class InputCollectionSingleton {
  @field({ type: Type.object })
  public declare value: Map<string, ClientInput>;
}
