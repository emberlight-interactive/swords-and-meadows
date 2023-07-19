import { env } from '../env/env';

export class FixedTickManager {
  private elapsedTime = 0;
  private fixedTimeStep = env.clientFixedTimeStep;

  private currentTick: number = 0;
  public getTick(): number {
    return this.currentTick;
  }

  public runTick(delta: number, callback: Function) {
    this.currentTick++;
    this.elapsedTime += delta;
    while (this.elapsedTime >= this.fixedTimeStep) {
      this.elapsedTime -= this.fixedTimeStep;
      callback();
    }
  }
}
