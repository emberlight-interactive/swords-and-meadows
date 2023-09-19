import { Type, component, field } from '@lastolivegames/becsy';

@component
export class XYDeltas {
  @field({ type: Type.float64 }) public declare previousX: number;
  @field({ type: Type.float64 }) public declare previousY: number;
  @field({ type: Type.float64 }) public declare deltaY: number;
  @field({ type: Type.float64 }) public declare deltaX: number;
  @field({ type: Type.float64 }) public declare appliedDeltas: number;
}
