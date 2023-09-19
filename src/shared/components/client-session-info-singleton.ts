import { component, field, Type } from '@lastolivegames/becsy';

@component
export class ClientSessionInfoSingleton {
  @field({ type: Type.dynamicString(10) })
  public declare clientId: string;
}
