import { component, field, Type } from '@lastolivegames/becsy';

export interface IXYTransform {
  x: number;
  y: number;
}

@component
export class XYTransform implements IXYTransform {
  @field({ type: Type.float64 })
  public declare x: number;

  @field({ type: Type.float64 })
  public declare y: number;
}
