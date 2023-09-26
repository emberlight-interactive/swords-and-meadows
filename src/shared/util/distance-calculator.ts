import { XYTransformable } from '../models/x-y-transformable';

export function distanceBetweenTwoPoints(
  pointOne: XYTransformable,
  pointTwo: XYTransformable
) {
  const dx = pointTwo.x - pointOne.x;
  const dy = pointTwo.y - pointOne.y;
  return Math.sqrt(dx * dx + dy * dy);
}
