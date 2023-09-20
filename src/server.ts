import { Room, Client, Server } from 'colyseus';
import { GameState } from './shared/network/networked-state/networked-state';
import { env } from './shared/env/env';
import {
  IPlayerInput,
  PlayerState,
  playerStateModification,
} from './shared/network/networked-state/player-networked-state';
import { monitor } from '@colyseus/monitor';
import { Schema, MapSchema } from '@colyseus/schema';
import { matchMaker } from '@colyseus/core';
import { IProjectileSpawnInput } from './shared/network/networked-state/projectile-networked-state';
import { InputQueue, KeyedInputData } from './shared/network/input-queue';

export class MainRoom extends Room<GameState> {
  public fixedTimeStep = 1000 / env.serverTicksPerSecond;
  public clientTicksPerServerTick =
    env.clientTicksPerSecond / env.serverTicksPerSecond;

  private inputQueue = new InputQueue();

  public onCreate() {
    this.setState(new GameState());
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.setPatchRate(null);

    this.state.mapWidth = 800;
    this.state.mapHeight = 600;

    this.onMessage<IPlayerInput>(0, (client, input) => {
      this.inputQueue.addInput({ inputKey: 0, data: input }, client.sessionId);
    });

    this.onMessage<IProjectileSpawnInput>(1, (client, input) => {
      this.inputQueue.addInput({ inputKey: 1, data: input }, client.sessionId);
    });

    let elapsedTime = 0;
    this.setSimulationInterval(deltaTime => {
      elapsedTime += deltaTime;

      while (elapsedTime >= this.fixedTimeStep) {
        elapsedTime -= this.fixedTimeStep;
        this.fixedTick();
      }
    });
  }

  private getInputWithKey<T extends KeyedInputData, K extends T['inputKey']>(
    inputKey: K,
    inputData: KeyedInputData[]
  ): Extract<T, { inputKey: K }>['data'] | undefined {
    for (let i = 0; i < inputData.length; i++) {
      if (inputData[i].inputKey === inputKey) {
        return <Extract<T, { inputKey: K }>['data']>inputData[i].data; // trust me bro
      }
    }
  }

  public fixedTick() {
    for (let i = 0; i < this.clientTicksPerServerTick; i++) {
      for (const input of this.inputQueue.getNextInput(1)) {
        const movementInput = this.getInputWithKey(0, input.input);
        if (movementInput !== undefined) {
          const playerState = this.state.players.get(input.clientId);
          if (playerState) {
            playerStateModification(movementInput, playerState);
          }
        }
      }

      // Run server sims
    }

    this.broadcastPatch();
  }

  private addStateInstance(
    sessionId: string,
    stateList: MapSchema,
    state: Schema
  ) {
    stateList.set(sessionId, state);
  }

  private removeStateInstance(sessionId: string, stateList: MapSchema) {
    stateList.delete(sessionId);
  }

  public onJoin(client: Client) {
    console.log(client.sessionId, 'joined!');

    const player = new PlayerState();
    player.x = Math.random() * this.state.mapWidth;
    player.y = Math.random() * this.state.mapHeight;

    this.addStateInstance(client.sessionId, this.state.players, player);
  }

  public onLeave(client: Client) {
    console.log(client.sessionId, 'left!');
    this.removeStateInstance(client.sessionId, this.state.players);
  }

  public onDispose() {
    console.log('room', this.roomId, 'disposing...');
  }
}

matchMaker.controller.getCorsHeaders = () => {
  return {
    'Access-Control-Allow-Origin': '*',
    Vary: '*',
  };
};

const gameServer = new Server({});
gameServer.define('main', MainRoom);
gameServer.listen(env.serverPort);

const express = require('express');
const app = express();
const port = 3000;

app.use('/colyseus', monitor());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
