import { Room, Client, Server } from 'colyseus';
import { env } from './shared/env/env';
import { IPlayerInput, playerStateModification } from './shared/network/player';
import { monitor } from '@colyseus/monitor';
import { Schema, MapSchema } from '@colyseus/schema';
import { matchMaker } from '@colyseus/core';
import {
  IProjectileSpawnInput,
  ProjectileType,
} from './shared/network//projectile';
import { InputQueue, KeyedInputData } from './shared/network/input-queue';
import { addProjectile } from './core/server/projectile/add-projectile';
import { moveProjectiles } from './core/server/projectile/move-projectiles';
import { NetworkedState } from './core/server/state/networked-state';
import { PlayerState } from './core/server/state/player-state';
import { detectProjectileCollision } from './core/server/projectile/detect-collision';
import { ExplosionState } from './core/server/state/explosion-state';
import { ExplosionType } from './shared/network/explosion';
import crypto from 'crypto';
import { ExplosionManager } from './core/server/explosion-manager/explosion-manager';

export class MainRoom extends Room<NetworkedState> {
  public fixedTimeStep = 1000 / env.serverTicksPerSecond;
  public clientTicksPerServerTick =
    env.clientTicksPerSecond / env.serverTicksPerSecond;

  private inputQueue = new InputQueue();
  private explosionManager!: ExplosionManager;

  public onCreate() {
    this.setState(new NetworkedState());
    this.explosionManager = new ExplosionManager(this.state.players);

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
    this.clearExplosions();

    for (let i = 0; i < this.clientTicksPerServerTick; i++) {
      for (const input of this.inputQueue.getNextInput(1)) {
        const movementInput = this.getInputWithKey(0, input.input);
        if (movementInput !== undefined) {
          const playerState = this.state.players.get(input.clientId);
          if (playerState) {
            playerStateModification(movementInput, playerState);
          }
        }
        const spawnProjectileInput = this.getInputWithKey(1, input.input);
        if (spawnProjectileInput !== undefined) {
          const playerState = this.state.players.get(input.clientId);
          if (playerState) {
            addProjectile(
              spawnProjectileInput,
              this.state.projectiles,
              playerState,
              input.clientId
            );
          }
        }
      }

      moveProjectiles(this.state.projectiles, (projectileKey, projectile) => {
        this.state.projectiles.delete(projectileKey);
        if (projectile.type === ProjectileType.Radius) {
          const explosion = new ExplosionState();
          explosion.x = projectile.desinationWorldX;
          explosion.y = projectile.desinationWorldY;
          explosion.explosionType = ExplosionType.FireExplosionOne;
          explosion.owner = projectile.owner;

          this.state.explosions.set(
            crypto.randomBytes(5).toString('hex'),
            explosion
          );
          this.explosionManager.addExplosion(explosion);
        }
      });

      detectProjectileCollision(
        this.state.projectiles,
        this.state.players,
        (projectileKey: string, playerKey: string) => {
          this.state.projectiles.delete(projectileKey);
          this.state.players.get(playerKey)!.health -= 10;
        }
      );

      this.explosionManager.processAddedExplosions();
    }

    this.broadcastPatch();
  }

  private clearExplosions() {
    this.state.explosions.clear();
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
