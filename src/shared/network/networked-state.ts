import { Schema, type, MapSchema } from '@colyseus/schema';
import { XYTransformState } from './networked-xy-transform-state';

export class NetworkedState extends Schema {
  @type({ map: XYTransformState }) public xyTransforms =
    new MapSchema<XYTransformState>();
}
