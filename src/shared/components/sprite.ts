import { component, field, Type } from '@lastolivegames/becsy';
import { XYTransformable } from '../models/x-y-transformable';

@component
export class Sprite {
  @field({ type: Type.object })
  public declare worldPosition: XYTransformable;
}
