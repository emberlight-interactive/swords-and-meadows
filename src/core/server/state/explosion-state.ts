import { Schema, type } from '@colyseus/schema';
import { IExplosionState } from '../../../shared/network/explosion';

export class ExplosionState extends Schema implements IExplosionState {
  @type('number') public x: number = 0;
  @type('number') public y: number = 0;
  @type('number') public explosionType: number = 0;
  @type('string') public owner: string = '';
}
