import { Schema, type } from '@colyseus/schema';
import { IProjectileState } from '../../../shared/network/projectile';

export class ProjectileState extends Schema implements IProjectileState {
  @type('number') public x: number = 0;
  @type('number') public y: number = 0;
  @type('number') public desinationWorldX: number = 0;
  @type('number') public desinationWorldY: number = 0;
  @type('number') public angle: number = 0;
  @type('string') public owner: string = '';
  @type('number') public type: number = 0;
}
