import { ObjectQueue } from '../util/object-collection-buffer';

export interface InputHandler<T extends object> {
  getBuffer(): ObjectQueue<T>;
  updateCurrentInput(currentTick: number): T;
  getCurrentInput(): T;
}
