import { Room, Client, Server } from 'colyseus';
import { env } from './shared/env/env';
import { monitor } from '@colyseus/monitor';
import { Queue } from './shared/util/queue';
import { matchMaker } from '@colyseus/core';
import { World } from '@lastolivegames/becsy';
import { MoveServerPlayers } from './core/systems/move-players/move-server-players';
import { RecieveClientInput } from './core/systems/network-state-sync/recieve-client-input';
import { BroadcastMutatedState } from './core/systems/network-state-sync/broadcast-mutated-state';
import { NetworkedState } from './shared/network/networked-state';
import { HandleServerConnections } from './core/systems/network-state-sync/handle-server-connections';
import { HandleServerDisconnections } from './core/systems/network-state-sync/handle-server-disconnections';

export class MainRoom extends Room<NetworkedState> {
  private fixedTimeStep = 1000 / env.serverTicksPerSecond;
  private newClientQueue = new Queue<{ sessionId: string }>();
  private disconnectedClientQueue = new Queue<{ sessionId: string }>();
  private ecsWorld!: World;
  public autoDispose = false;

  public async onCreate() {
    this.setState(new NetworkedState());
    this.ecsWorld = await World.create({
      defs: [
        HandleServerConnections,
        {
          newClientQueue: this.newClientQueue,
        },
        RecieveClientInput,
        {
          room: this,
        },
        MoveServerPlayers,
        HandleServerDisconnections,
        {
          disconnectedClientQueue: this.disconnectedClientQueue,
        },
        BroadcastMutatedState,
        {
          xyTransformMap: this.state.xyTransforms,
        },
      ],
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
    this.ecsWorld.execute();
  }

  public onJoin(client: Client) {
    console.log(client.sessionId, 'joined!');
    this.newClientQueue.push(client);
  }

  public onLeave(client: Client) {
    console.log(client.sessionId, 'left!');
    this.disconnectedClientQueue.push(client);
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
