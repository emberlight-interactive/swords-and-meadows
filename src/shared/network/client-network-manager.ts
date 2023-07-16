// PER TICK INPUT - send state modification (input), modify local state, store expected local state at tick #, render
// PER TICK RETRIEVAL - compare buffered local state for that tick, if server and local state match then continue, otherwise override local state to match server state
// if tick from server is a future tick indicating a lost packet then skip verification and move to the tick
// Once buffer reaches certain size disconnect game

import { MapSchema, Schema } from '@colyseus/schema';
import { Room, Client } from 'colyseus.js';
import { env } from '../env/env';
import {
  InputKey,
  NetworkedStateBundle,
} from './networked-state/networked-state';

// ClientManager cannot map sessionids to network entities because they are generics

// bundle state, input, modification rules

export interface NetworkBroadcastEntity<
  TNetworkStateBundle extends NetworkedStateBundle<object, InputKey, object>,
> {
  readonly inputKey: TNetworkStateBundle['inputKey'];
  getCurrentInput: (currentTick: number) => TNetworkStateBundle['input'];
  update: () => void;

  reconcileState(stateRef: TNetworkStateBundle['state']): void; // + private stateQueue for record keeping

  destroy: () => void;
}

export interface NetworkRecieverEntity<TState> {
  setState(stateRef: TState): void;
  update(): void;
  destroy(): void;
}

// Shared state, tickFreq, simuations

export class ClientNetworkManager<TGameState extends Schema> {
  public connectionStatus: 'connected' | 'disconnected' | 'connecting' =
    'disconnected';
  private _room!: Room<TGameState>;
  public get room(): Room<TGameState> {
    return this._room;
  }

  private networkBroadcastEntityCallbacks = new Map<
    string,
    (currTick: number) => void
  >();

  private networkRecieverEntityCallbacks = new Map<
    string,
    (currTick: number) => void
  >();

  private elapsedTime = 0;
  private fixedTimeStep = env.fixedTimeStep;

  private currentTick: number = 0;

  public async connect() {
    console.log('Trying to connect with the server...');
    this.connectionStatus = 'connecting';
    const client = new Client(env.serverWsUrl);

    try {
      this._room = await client.joinOrCreate(env.serverRoomName, {});
      this.connectionStatus = 'connected';
    } catch (e) {
      console.error('Failed to connect');
      this.connectionStatus = 'disconnected';
    }
  }

  public registerEntity<TState extends Schema>(
    mapSchemaRef: MapSchema<TState, string>,
    entityBroadcasterFactory: (
      stateRef: TState
    ) => NetworkBroadcastEntity<NetworkedStateBundle<object, InputKey, TState>>,
    entityRecieverFactory: (stateRef: TState) => NetworkRecieverEntity<TState>,
    uniquieEntityKey: string
  ) {
    mapSchemaRef.onAdd((state: TState, sessionId) => {
      const entityKey = `${uniquieEntityKey}-${sessionId}`;

      if (sessionId === this._room.sessionId) {
        const broadcasterEntity = entityBroadcasterFactory(state);
        this.networkBroadcastEntityCallbacks.set(
          entityKey,
          (currTick: number) => {
            this._room.send(
              broadcasterEntity.inputKey,
              broadcasterEntity.getCurrentInput(currTick)
            );
            broadcasterEntity.update();
          }
        );

        state.onChange(() => broadcasterEntity.reconcileState(state));
        state.onRemove(() => {
          broadcasterEntity.destroy();
          this.networkBroadcastEntityCallbacks.delete(entityKey);
        });
      } else {
        const recieverEntity = entityRecieverFactory(state);
        recieverEntity.setState(state);
        this.networkRecieverEntityCallbacks.set(entityKey, () =>
          recieverEntity.update()
        );
        state.onRemove(() => {
          recieverEntity.destroy();
          this.networkRecieverEntityCallbacks.delete(entityKey);
        });
      }
    });
  }

  public fixedTick(delta: number) {
    this.currentTick++;
    this.elapsedTime += delta;
    while (this.elapsedTime >= this.fixedTimeStep) {
      this.elapsedTime -= this.fixedTimeStep;
      this.runTick();
    }
  }

  private runTick() {
    this.networkBroadcastEntityCallbacks.forEach(entity =>
      entity(this.currentTick)
    );

    this.networkRecieverEntityCallbacks.forEach(entity =>
      entity(this.currentTick)
    );
  }
}
