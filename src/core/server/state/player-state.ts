import { Schema, type } from '@colyseus/schema';
import { IPlayerState } from '../../../shared/network/player';

export class PlayerState extends Schema implements IPlayerState {
  @type('number') public x: number = 0;
  @type('number') public y: number = 0;
  @type('number') public relativeMouseAngle: number = 0;
  @type('number') public clientTick: number = 0;
}
