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
