import { component, field, Type } from '@lastolivegames/becsy';

@component
export class Tick {
  @field({ type: Type.uint32 })
  public declare tick: number;
}
