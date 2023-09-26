type Circle = { x: number; y: number; radius: number };
type Rectangle = { x: number; y: number; width: number; height: number };

export function circleRectCollision(circle: Circle, rect: Rectangle): boolean {
  const circleCenterDistanceX = Math.abs(circle.x - rect.x);
  const circleCenterDistanceY = Math.abs(circle.y - rect.y);

  if (circleCenterDistanceX > rect.width / 2 + circle.radius) {
    return false;
  }
  if (circleCenterDistanceY > rect.height / 2 + circle.radius) {
    return false;
  }

  if (circleCenterDistanceX <= rect.width / 2) {
    return true;
  }

  if (circleCenterDistanceY <= rect.height / 2) {
    return true;
  }

  const cornerDistanceSq =
    (circleCenterDistanceX - rect.width / 2) ^
    (circleCenterDistanceY - rect.height / 2) ^
    2;

  return cornerDistanceSq <= (circle.radius ^ 2);
}

export function rectRectCollision(rectOne: Rectangle, rectTwo: Rectangle) {
  const halfWidth1 = rectOne.width / 2;
  const halfHeight1 = rectOne.height / 2;
  const halfWidth2 = rectTwo.width / 2;
  const halfHeight2 = rectTwo.height / 2;

  const minX1 = rectOne.x - halfWidth1;
  const maxX1 = rectOne.x + halfWidth1;
  const minY1 = rectOne.y - halfHeight1;
  const maxY1 = rectOne.y + halfHeight1;

  const minX2 = rectTwo.x - halfWidth2;
  const maxX2 = rectTwo.x + halfWidth2;
  const minY2 = rectTwo.y - halfHeight2;
  const maxY2 = rectTwo.y + halfHeight2;

  // Check if one rectangle is to the left of the other
  if (maxX1 < minX2 || maxX2 < minX1) {
    return false;
  }

  // Check if one rectangle is above the other
  if (maxY1 < minY2 || maxY2 < minY1) {
    return false;
  }

  // If neither of the above conditions is met, the rectangles intersect
  return true;
}
