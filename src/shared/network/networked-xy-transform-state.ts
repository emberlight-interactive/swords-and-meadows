import { Schema, type } from '@colyseus/schema';
import { IXYTransform } from '../components/xy-transform';

export class XYTransformState extends Schema implements IXYTransform {
  @type('number') public x: number = 0;
  @type('number') public y: number = 0;
}
