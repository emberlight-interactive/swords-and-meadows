import { DestinationTrackable } from '../models/destination-trackable';
import { OwnershipTrackable } from '../models/ownership-trackable';
import { Rotatable } from '../models/rotatable';
import { XYTransformable } from '../models/x-y-transformable';
import { InputAndStateSync } from './input-and-state-sync';

export type IProjectileSpawnInput = (
  | { type: ProjectileType.Direct }
  | ({ type: ProjectileType.Radius } & DestinationTrackable)
) &
  InputAndStateSync;

export interface IProjectileState
  extends XYTransformable,
    Rotatable,
    OwnershipTrackable,
    DestinationTrackable,
    ProjectileTypeTrackable {}

export const projectileInputKey = 1 as const;
export const wandPivotOffset = { x: -13, y: 2 };
export const wandEffectiveLength = 32;
export const projectileRadius = 7.5;
export const projectileMaxTravelDistance = 1200;

export enum ProjectileType {
  Direct,
  Radius,
}

export interface ProjectileTypeTrackable {
  type: ProjectileType;
}
