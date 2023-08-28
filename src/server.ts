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
import { Queue } from './shared/util/queue';
import { matchMaker } from '@colyseus/core';

export class MainRoom extends Room<GameState> {
  public fixedTimeStep = env.serverFixedTimeStep;

  private inputQueues: Map<Schema, Queue<object>> = new Map();

  public onCreate() {
    this.setState(new GameState());

    this.state.mapWidth = 800;
    this.state.mapHeight = 600;

    this.onMessage(0, (client, input) => {
      const player = this.state.players.get(client.sessionId)!;
      const inputQueue = this.inputQueues.get(player);
      inputQueue?.push(input);
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

  public fixedTick() {
    this.state.players.forEach(player => {
      const inputQueue = this.inputQueues.get(player);
      let input: IPlayerInput | undefined;

      while ((input = <IPlayerInput>inputQueue?.shift())) {
        playerStateModification(input, player);
      }
    });
  }

  private addStateInstance(
    sessionId: string,
    stateList: MapSchema,
    state: Schema
  ) {
    stateList.set(sessionId, state);
    this.inputQueues.set(state, new Queue());
  }

  private removeStateInstance(sessionId: string, stateList: MapSchema) {
    const state = stateList.get(sessionId);
    stateList.delete(sessionId);
    this.inputQueues.delete(state);
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
