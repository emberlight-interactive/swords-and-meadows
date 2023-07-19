import { ObjectCollectionBuffer } from '../util/object-collection-buffer';

export interface InputHandler<T extends object> {
  getBuffer(): ObjectCollectionBuffer<T>;
  updateCurrentInput(currentTick: number): T;
  getCurrentInput(): T;
}
