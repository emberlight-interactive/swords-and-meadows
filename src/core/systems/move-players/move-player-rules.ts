import { ClientMovementInput } from '../../../shared/components/client-input-singleton';
import { XYTransformable } from '../../../shared/models/x-y-transformable';

const velocity = 2;
export const movePlayerRules = (
  input: ClientMovementInput,
  xyState: XYTransformable
) => {
  if (input.left) {
    xyState.x -= velocity;
  } else if (input.right) {
    xyState.x += velocity;
  }

  if (input.up) {
    xyState.y -= velocity;
  } else if (input.down) {
    xyState.y += velocity;
  }
};
