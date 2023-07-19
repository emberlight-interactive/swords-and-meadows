import { XYTransformable } from '../entities/x-y-transformable';

export const followTarget = (
  follower: XYTransformable,
  target: XYTransformable,
  offsetX: number,
  offsetY: number
) => {
  follower.x = target.x + offsetX;
  follower.y = target.y + offsetY;
};
