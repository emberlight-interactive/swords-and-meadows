import { ObjectQueue } from '../util/object-queue';

export interface InputHandler<T extends object> {
  getBuffer(): ObjectQueue<T>;
  updateCurrentInput(currentTick: number): T;
  getCurrentInput(): T;
}
