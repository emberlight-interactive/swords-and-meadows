import { Type, component, field } from '@lastolivegames/becsy';

@component
export class TickSingleton {
  @field({ type: Type.uint32 }) public declare tick: number;
}
