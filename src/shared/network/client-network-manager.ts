import { MapSchema, Schema } from '@colyseus/schema';
import { Room, Client } from 'colyseus.js';
import { env } from '../env/env';
import {
  NetworkCommKey,
  NetworkedStateBundle,
} from './networked-state/networked-state';
import { FixedTickManager } from '../util/fixed-tick-manager';

export interface NetworkBroadcastEntity<
  TNetworkStateBundle extends NetworkedStateBundle<
    object,
    NetworkCommKey,
    object
  >,
> {
  readonly networkCommKey: TNetworkStateBundle['inputKey'];
  getCurrentInput: (currentTick: number) => TNetworkStateBundle['input'];
  tick: () => void;

  reconcileState(stateRef: TNetworkStateBundle['state']): void;

  destroy: () => void;
}

export interface NetworkRecieverEntity<TState> {
  setState(stateRef: TState): void;
  tick(): void;
  destroy(): void;
}

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

  constructor(private fixedTickManager = new FixedTickManager()) {}

  public async connect() {
    console.log('Trying to connect with the server...');
    this.connectionStatus = 'connecting';
    const client = new Client({
      secure: env.serverSSL,
      hostname: env.serverHostname,
      port: env.serverPort,
    });

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
    ) => NetworkBroadcastEntity<
      NetworkedStateBundle<object, NetworkCommKey, TState>
    >,
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
              broadcasterEntity.networkCommKey,
              broadcasterEntity.getCurrentInput(currTick)
            );
            broadcasterEntity.tick();
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
          recieverEntity.tick()
        );
        state.onRemove(() => {
          recieverEntity.destroy();
          this.networkRecieverEntityCallbacks.delete(entityKey);
        });
      }
    });
  }

  public fixedTick(delta: number) {
    this.fixedTickManager.runTick(delta, this.runTick);
  }

  private runTick = () => {
    this.networkBroadcastEntityCallbacks.forEach(entity =>
      entity(this.fixedTickManager.getTick())
    );

    this.networkRecieverEntityCallbacks.forEach(entity =>
      entity(this.fixedTickManager.getTick())
    );
  };
}
