import { InputQueue } from './input-queue';

describe('input queue', () => {
  test('add and read from queue', () => {
    const queue = new InputQueue();

    // queue.addInput(
    //   { inputKey: 1, data: { clientTick: 1, spawn: true } },
    //   '123'
    // );

    // queue.addInput(
    //   { inputKey: 1, data: { clientTick: 1, spawn: true } },
    //   '124'
    // );

    // queue.addInput(
    //   { inputKey: 1, data: { clientTick: 1, spawn: true } },
    //   '123'
    // );

    for (const input of queue.getNextInput(1)) {
      console.log(input);
    }

    console.log('next to stage please');

    for (const input of queue.getNextInput(1)) {
      console.log(input);
    }
  });
});
