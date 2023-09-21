import { MapSchema, Schema, type } from '@colyseus/schema';
import { PlayerState } from './player-state';
import { ProjectileState } from './projectile-state';
import { INetworkedState } from '../../../shared/network/networked-state';

export class NetworkedState extends Schema implements INetworkedState {
  @type({ map: PlayerState }) public players = new MapSchema<PlayerState>();
  @type({ map: ProjectileState }) public projectiles =
    new MapSchema<ProjectileState>();
}
