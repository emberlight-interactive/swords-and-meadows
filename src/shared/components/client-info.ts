import { Type, component, field } from '@lastolivegames/becsy';

@component
export class ClientInfo {
  @field({ type: Type.dynamicString(10) })
  public declare clientId: string;
}
