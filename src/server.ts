import { Room, Client, Server } from 'colyseus';
import { env } from './shared/env/env';
import {
  IPlayerInput,
  playerInputKey,
  playerStateModification,
} from './shared/network/player';
import { monitor } from '@colyseus/monitor';
import { Schema, MapSchema } from '@colyseus/schema';
import { matchMaker } from '@colyseus/core';
import {
  IProjectileHitInput,
  IProjectileSpawnInput,
  projectileHitInputKey,
  projectileInputKey,
} from './shared/network//projectile';
import { InputQueue, KeyedInputData } from './shared/network/input-queue';
import { addProjectile } from './core/server/projectile/add-projectile';
import {
  moveProjectile,
  moveProjectiles,
} from './core/server/projectile/move-projectiles';
import { NetworkedState } from './core/server/state/networked-state';
import { PlayerState } from './core/server/state/player-state';
import { XYTransformable } from './shared/models/x-y-transformable';
import { didProjectileHit } from './core/server/projectile/determine-projectile-hit';
import { Rotatable } from './shared/models/rotatable';

export class MainRoom extends Room<NetworkedState> {
  public fixedTimeStep = 1000 / env.serverTicksPerSecond;
  public clientTicksPerServerTick =
    env.clientTicksPerSecond / env.serverTicksPerSecond;

  private inputQueue = new InputQueue();
  private playerPositionHistory = new Map<string, XYTransformable[]>();

  public onCreate() {
    this.setState(new NetworkedState());
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.setPatchRate(null);
    // this.autoDispose = false;

    /** @todo: Spamming server messages causes braodcasted server changes to lag behind */
    this.onMessage<IPlayerInput>(0, (client, input) => {
      this.inputQueue.addInput({ inputKey: 0, data: input }, client.sessionId);
    });

    this.onMessage<IProjectileSpawnInput>(1, (client, input) => {
      this.inputQueue.addInput({ inputKey: 1, data: input }, client.sessionId);
    });

    this.onMessage<IProjectileHitInput>(2, (client, input) => {
      this.inputQueue.addInput({ inputKey: 2, data: input }, client.sessionId);
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
        const movementInput = this.getInputWithKey(playerInputKey, input.input);
        if (movementInput !== undefined) {
          const playerState = this.state.players.get(input.clientId);
          if (playerState) {
            playerStateModification(movementInput, playerState);
          }
        }

        const spawnProjectileInput = this.getInputWithKey(
          projectileInputKey,
          input.input
        );
        if (spawnProjectileInput !== undefined) {
          const playerState = this.state.players.get(input.clientId);
          if (playerState) {
            addProjectile(this.state.projectiles, playerState, input.clientId);
          }
        }

        const projectileHitInput = this.getInputWithKey(
          projectileHitInputKey,
          input.input
        );
        if (projectileHitInput !== undefined) {
          const otherPlayerPositionHistory = this.playerPositionHistory.get(
            projectileHitInput.otherPlayerKey
          );

          const currProjectile = this.state.projectiles.get(
            projectileHitInput.projectileKey
          );

          if (
            otherPlayerPositionHistory &&
            currProjectile &&
            currProjectile.owner !== projectileHitInput.otherPlayerKey
          ) {
            const playerHit = didProjectileHit(
              {
                x: projectileHitInput.otherPlayerX,
                y: projectileHitInput.otherPlayerY,
              },
              {
                x: projectileHitInput.projectileX,
                y: projectileHitInput.projectileY,
              },
              this.projectilePositionLastServerTick(currProjectile, i),
              otherPlayerPositionHistory
            );

            if (playerHit) {
              console.log('got rekt confirmed');
            }
          }
        }

        // bam - x, y of projectile, x, y player
        // server rewinds until it finds a matching x, y position
        // reverse lerp of player to two history points

        // confirmDirectHit(projectile: {x, y}, projectileKey: string, otherPlayer: {x, y}, otherPlayerKey: string) w\ History
      }

      moveProjectiles(this.state.projectiles);
      // Run server sims
    }

    this.addPlayerPositionsToHistory();
    this.broadcastPatch();
  }

  private addPlayerPositionsToHistory() {
    this.state.players.forEach((player, key) => {
      const playerPositionHistory = this.playerPositionHistory.get(key) || [];

      if (playerPositionHistory.length === 0) {
        this.playerPositionHistory.set(key, playerPositionHistory);
      }

      if (playerPositionHistory.length < 5) {
        playerPositionHistory.push({ x: player.x, y: player.y });
      } else {
        const ancientPosition = playerPositionHistory.shift()!;
        ancientPosition.x = player.x;
        ancientPosition.y = player.y;
        playerPositionHistory.push(ancientPosition);
      }
    });
  }

  private projectilePositionLastServerTick(
    projectile: XYTransformable & Rotatable,
    serverTickOffset: number
  ) {
    const rewindableProjectile = {
      x: projectile.x,
      y: projectile.y,
      angle: projectile.angle,
    };

    for (let i = serverTickOffset; i > 0; i--) {
      moveProjectile(rewindableProjectile, true);
    }

    return rewindableProjectile;
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
    player.x = Math.random() * 800;
    player.y = Math.random() * 600;

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
