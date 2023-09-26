import { OwnershipTrackable } from '../models/ownership-trackable';
import { XYTransformable } from '../models/x-y-transformable';

export interface IExplosionState
  extends XYTransformable,
    ExplosionTypeTrackable,
    OwnershipTrackable {}

export enum ExplosionType {
  FireExplosionOne,
}

export interface ExplosionTypeTrackable {
  explosionType: ExplosionType;
}

export const explosionDimensions = {
  [ExplosionType.FireExplosionOne]: { width: 120, height: 73 },
};
