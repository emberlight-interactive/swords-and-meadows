import { Queue } from './queue';

export class IntegerDeltaCalculator {
  private _deltaQueue = new Queue<number>();
  public get deltaQueue() {
    return this._deltaQueue;
  }

  constructor(private lastState: number) {}
  public updateDeltas(newState: number, numberOfDeltas: number) {
    const diff = this.lastState - newState;
    if (diff) {
      const deltas = diff / numberOfDeltas;
      for (let i = 0; i < numberOfDeltas; i++) {
        this._deltaQueue.push(deltas);
      }
    }

    this.lastState = newState;
  }
}
