import { PlayerBroadcasterEntity } from './player-broadcaster-entity';
import { PlayerRecieverEntity } from './player-reciever-entity';
import { IPlayerState, playerInputKey } from '../../shared/network/player';
import { XYTransformable } from '../../shared/models/x-y-transformable';
import { Rotatable } from '../../shared/models/rotatable';
import { Destroyable } from '../../shared/models/destroyable';
import { Scene } from 'phaser';
import { ServerMessenger } from '../../shared/models/server-messenger';
import { NetworkedMap } from '../../shared/models/networked-map';

export class PlayerManager {
  private playerMovementBroadcaster?: PlayerBroadcasterEntity;
  private otherPlayers = new Map<string, PlayerRecieverEntity>();

  constructor(
    private scene: Scene,
    private clientId: string,
    private playerMap: NetworkedMap<IPlayerState>,
    private serverMessenger: ServerMessenger,
    wandFactory: () => XYTransformable & Rotatable & Destroyable,
    playerEntityFactory: (
      x: number,
      y: number,
      tool: XYTransformable
    ) => XYTransformable & Destroyable
  ) {
    this.playerMap.onAdd((state, sessionId) => {
      if (sessionId === this.clientId) {
        const wand = wandFactory();
        this.playerMovementBroadcaster = new PlayerBroadcasterEntity(
          this.scene,
          playerEntityFactory(state.x, state.y, wand),
          wand
        );

        state.onChange(
          () => this.playerMovementBroadcaster?.reconcileState(state)
        );
        state.onRemove(() => {
          this.playerMovementBroadcaster?.destroy();
        });
      } else {
        const wand = wandFactory();
        const otherPlayer = new PlayerRecieverEntity(
          playerEntityFactory(state.x, state.y, wand),
          wand
        );

        this.otherPlayers.set(sessionId, otherPlayer);

        otherPlayer.setState(state);
        state.onRemove(() => {
          otherPlayer.destroy();
          this.otherPlayers.delete(sessionId);
        });
      }
    });
  }

  public tick(currTick: number) {
    if (this.playerMovementBroadcaster) {
      this.serverMessenger.send(
        playerInputKey,
        this.playerMovementBroadcaster.getCurrentInput(currTick)
      );
      this.playerMovementBroadcaster.tick();
    }

    for (const player of this.otherPlayers.values()) {
      player.tick();
    }
  }
}
