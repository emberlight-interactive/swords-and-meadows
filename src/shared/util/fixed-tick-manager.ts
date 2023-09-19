import { env } from '../env/env';

export class FixedTickManager {
  private elapsedTime = 0;
  private fixedTimeStep = 1000 / env.clientTicksPerSecond;

  private currentTick: number = 0;
  public getTick(): number {
    return this.currentTick;
  }

  public runTick(delta: number, callback: Function) {
    this.elapsedTime += delta;
    while (this.elapsedTime >= this.fixedTimeStep) {
      this.currentTick++;
      this.elapsedTime -= this.fixedTimeStep;
      callback();
    }
  }
}
