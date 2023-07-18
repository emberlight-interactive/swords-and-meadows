import { Queue } from './queue';

export class ObjectCollectionBuffer<T extends object> {
  private recycleableObjects: T[] = [];
  private bufferQueue: Queue<T> = new Queue();

  /** Pass reference to reused object to avoid garbage generation */
  public add(objRef: T) {
    const objectInstance = this.recycleableObjects.pop() || ({} as T);

    Object.assign(objectInstance, objRef);
    this.bufferQueue.push(objectInstance);
  }

  /** References to objects returned from this function are recycled, clone objects if permanent use of return result is desired */
  public shift(): T | undefined {
    const obj = this.bufferQueue.shift();
    if (obj) this.recycleableObjects.push(obj);
    return obj;
  }

  public *iterable() {
    for (let i = 0; i < this.bufferQueue.length(); i++) {
      yield this.bufferQueue.getAtIndex(i);
    }
  }
}
