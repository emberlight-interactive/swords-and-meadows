import { System, system } from '@lastolivegames/becsy';
import { ClientInputSingleton } from '../../../shared/components/client-input-singleton';
import { Pressable } from '../../../shared/models/pressable';
import { XYTransformable } from '../../../shared/models/x-y-transformable';

@system
export class InputManager extends System {
  private inputState = this.singleton.write(ClientInputSingleton);
  private keys!: { W: Pressable; A: Pressable; S: Pressable; D: Pressable };
  private pointer!: XYTransformable;

  public execute(): void {
    this.inputState.left = this.keys.A.isDown;
    this.inputState.right = this.keys.D.isDown;
    this.inputState.up = this.keys.W.isDown;
    this.inputState.down = this.keys.S.isDown;
    this.inputState.mouseWorldX = this.pointer.x;
    this.inputState.mouseWorldY = this.pointer.y;

    // const dx = this.pointer.x - this.relativeMouseTarget.x;
    // const dy = this.pointer.y - this.relativeMouseTarget.y;

    // this.inputState.relativeMouseAngle =
    //   (360 / (2 * Math.PI)) * Math.atan2(dy, dx);

    // this.inputState.tick = currentTick;

    // if (this.keepInputHistory) this.playerInputBuffer.add(this.playerInput);

    // return this.playerInput;
  }
}
