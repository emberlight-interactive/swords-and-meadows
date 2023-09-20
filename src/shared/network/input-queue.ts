import { IPlayerInput } from './networked-state/player-networked-state';
import { IProjectileSpawnInput } from './networked-state/projectile-networked-state';

export type KeyedInputData =
  | { inputKey: 0; data: IPlayerInput }
  | { inputKey: 1; data: IProjectileSpawnInput };

export type InputNode = { input: KeyedInputData[] } & {
  clientId: string;
  next?: InputNode;
};

export class InputQueue {
  private head?: InputNode;
  private tail?: InputNode;

  public addInput(input: KeyedInputData, clientId: string) {
    if (!this.head) {
      const node = { input: [input], clientId };
      this.head = node;
      this.tail = node;
    } else {
      let currNode: InputNode | undefined = this.head;
      let clientInputNodesPassed = 0;
      do {
        if (clientInputNodesPassed > 180) break; // Prevent flooding input
        if (currNode.clientId === clientId) {
          clientInputNodesPassed++;

          /** @todo: Extract clientTick and make general required feild */
          if (currNode.input[0].data.clientTick === input.data.clientTick) {
            if (!currNode.input.some(v => v.inputKey === input.inputKey)) {
              currNode.input.push(input);
              break;
            }
          }
        }

        if (currNode.next === undefined) {
          const node = { input: [input], clientId };
          currNode.next = node;
          this.tail = node;
          break;
        }
      } while ((currNode = currNode.next));
    }
  }

  public *getNextInput(inputsPerClient: number) {
    if (this.head && this.tail) {
      const clientInputNodesProcessed = new Map<string | undefined, number>();
      let currNode: InputNode | undefined = this.head;
      let prevNode: InputNode | undefined = undefined;
      const endNode: InputNode = this.tail;
      do {
        let inputsProcessedByThisClient =
          clientInputNodesProcessed.get(currNode.clientId) || 0;

        if (inputsProcessedByThisClient < inputsPerClient) {
          inputsProcessedByThisClient++;
          clientInputNodesProcessed.set(
            currNode.clientId,
            inputsProcessedByThisClient
          );

          if (prevNode) {
            prevNode.next = currNode.next;
          } else {
            this.head = currNode.next;
          }

          yield currNode;
        } else {
          prevNode = currNode;
        }

        if (Object.is(currNode, endNode)) {
          break;
        }
      } while ((currNode = currNode.next));
    }
  }
}
