import { Room, Client, Server } from 'colyseus';
import { GameState } from './shared/network/networked-state/networked-state';
import { env } from './shared/env/env';
import {
  IPlayerInput,
  PlayerState,
} from './shared/network/networked-state/player-networked-state';
import { monitor } from '@colyseus/monitor';

// State definitions
// How input modifies state (input, state) => state

export class MainRoom extends Room<GameState> {
  public fixedTimeStep = env.fixedTimeStep;

  public onCreate() {
    this.setState(new GameState());

    // set map dimensions
    this.state.mapWidth = 800;
    this.state.mapHeight = 600;

    this.onMessage(0, (client, input) => {
      // handle player input
      const player = this.state.players.get(client.sessionId);

      // enqueue input to user input buffer.
      player!.inputQueue.push(input);
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
    const velocity = 2;

    this.state.players.forEach(player => {
      let input: IPlayerInput | undefined;

      // dequeue player inputs
      while ((input = player.inputQueue.shift())) {
        if (input.left) {
          player.x -= velocity;
        } else if (input.right) {
          player.x += velocity;
        }

        if (input.up) {
          player.y -= velocity;
        } else if (input.down) {
          player.y += velocity;
        }

        player.tick = input.tick;
      }
    });
  }

  public onJoin(client: Client) {
    console.log(client.sessionId, 'joined!');

    const player = new PlayerState();
    player.x = Math.random() * this.state.mapWidth;
    player.y = Math.random() * this.state.mapHeight;

    this.state.players.set(client.sessionId, player);
  }

  public onLeave(client: Client) {
    console.log(client.sessionId, 'left!');
    this.state.players.delete(client.sessionId);
  }

  public onDispose() {
    console.log('room', this.roomId, 'disposing...');
  }
}

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
