import { Queue } from './queue';

export class ObjectQueue<T extends object> {
  private recycleableObjects: T[] = [];
  private objectQueue: Queue<T> = new Queue();

  /** Pass reference to reused object to avoid garbage generation */
  public add(objRef: T) {
    const objectInstance = this.recycleableObjects.pop() || ({} as T);

    Object.assign(objectInstance, objRef);
    this.objectQueue.push(objectInstance);
  }

  /** References to objects returned from this function are recycled, clone objects if permanent use of return result is desired */
  public shift(): T | undefined {
    const obj = this.objectQueue.shift();
    if (obj) this.recycleableObjects.push(obj);
    return obj;
  }

  public peek(): T | undefined {
    return this.objectQueue.peek();
  }

  public *iterable() {
    for (let i = 0; i < this.objectQueue.length(); i++) {
      yield this.objectQueue.getAtIndex(i);
    }
  }
}
