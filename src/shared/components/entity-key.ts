import { Type, component, field } from '@lastolivegames/becsy';

@component
export class EntityKey {
  @field({ type: Type.dynamicString(16) })
  public declare value: string;
}
