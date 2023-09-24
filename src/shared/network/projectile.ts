import { OwnershipTrackable } from '../models/ownership-trackable';
import { Rotatable } from '../models/rotatable';
import { XYTransformable } from '../models/x-y-transformable';
import { InputAndStateSync } from './input-and-state-sync';

export interface IProjectileSpawnInput extends InputAndStateSync {
  spawn: true;
}

export interface IProjectileState
  extends XYTransformable,
    Rotatable,
    OwnershipTrackable {}

export const projectileInputKey = 1 as const;
export const wandPivotOffset = { x: -13, y: 2 };
export const wandEffectiveLength = 32;
export const projectileRadius = 7.5;
